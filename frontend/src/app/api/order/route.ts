import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import Decimal from 'decimal.js-light';

import { getExchangeClient, getHttpInfoClient } from '@/server/hyperliquid/exchange';
import { getPerpAssetMeta, minSizeFromDecimals, quantizeSize } from '@/server/hyperliquid/assets';
import { HttpError } from '@/server/hyperliquid/errors';
import { lookupBundle } from '@/server/registry';
import type { OrderParams } from '@nktkas/hyperliquid';
import { ApiRequestError, TransportError } from '@nktkas/hyperliquid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ORDER_SCHEMA = z
  .object({
    market: z.string().min(1),
    side: z.enum(['buy', 'sell']),
    price: z.number().positive().optional(),
    size: z.number().positive().optional(),
    sizeUsd: z.number().positive().optional(),
    reduceOnly: z.boolean().optional(),
    timeInForce: z.enum(['Gtc', 'Ioc', 'Alo']).default('Gtc'),
    clientId: z
      .string()
      .regex(/^0x[a-fA-F0-9]{32}$/)
      .optional(),
  })
  .superRefine((data, ctx) => {
    const hasBaseSize = typeof data.size === 'number';
    const hasUsdSize = typeof data.sizeUsd === 'number' && typeof data.price === 'number';
    if (!hasBaseSize && !hasUsdSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide size (base units) or sizeUsd with price',
        path: ['size'],
      });
    }
    if (!data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Limit orders require a price',
        path: ['price'],
      });
    }
  });

const ORDER_REQUEST_SCHEMA = z.object({
  orders: z.array(ORDER_SCHEMA).min(1),
  grouping: z.enum(['na', 'normalTpsl', 'positionTpsl']).default('na'),
  f: z.number().int().min(0).max(1000).optional(),
});

const HEADER_SCHEMA = z.object({
  bundleHash: z.string().min(1),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  idempotencyKey: z.string().min(1),
});

const IDEMPOTENCY_TTL_MS = 60_000;
const idempotencyCache = new Map<string, { timestamp: number; status: number; body: unknown }>();

function normalizeIdempotencyKey(key: string) {
  return key.trim();
}

function getCachedResponse(key: string) {
  const entry = idempotencyCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > IDEMPOTENCY_TTL_MS) {
    idempotencyCache.delete(key);
    return null;
  }
  return entry;
}

function storeIdempotentResponse(key: string, status: number, body: unknown) {
  idempotencyCache.set(key, {
    timestamp: Date.now(),
    status,
    body,
  });
}

type NormalizedOrderInfo = {
  market: string;
  assetId: number;
  szDecimals: number;
  size: string;
  minSize: string;
};

export async function POST(request: NextRequest) {
  const headersParse = HEADER_SCHEMA.safeParse({
    bundleHash: request.headers.get('x-bundle-hash'),
    walletAddress: request.headers.get('x-wallet-address'),
    idempotencyKey: request.headers.get('x-idempotency-key'),
  });

  if (!headersParse.success) {
    return NextResponse.json(
      { error: 'Invalid headers', details: headersParse.error.format() },
      { status: 400 },
    );
  }

  const { bundleHash, walletAddress, idempotencyKey } = headersParse.data;
  const normalizedKey = normalizeIdempotencyKey(idempotencyKey);

  const cached = getCachedResponse(normalizedKey);
  if (cached) {
    return NextResponse.json(cached.body, { status: cached.status });
  }

  let requestJson: unknown;
  try {
    requestJson = await request.json();
  } catch {
    storeIdempotentResponse(normalizedKey, 400, { error: 'Invalid JSON body' });
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = ORDER_REQUEST_SCHEMA.safeParse(requestJson);
  if (!parsed.success) {
    storeIdempotentResponse(normalizedKey, 400, { error: 'Invalid request body', details: parsed.error.format() });
    return NextResponse.json(
      { error: 'Invalid request body', details: parsed.error.format() },
      { status: 400 },
    );
  }

  if (!process.env.HYPERLIQUID_API_PRIVATE_KEY) {
    const body = { error: 'Hyperliquid trading is not configured on this deployment' };
    storeIdempotentResponse(normalizedKey, 501, body);
    return NextResponse.json(body, { status: 501 });
  }

  let normalizedOrders: NormalizedOrderInfo[] = [];

  try {
    const registryRecord = await lookupBundle(bundleHash);
    if (!registryRecord) {
      throw new HttpError(403, 'Bundle hash not authorized');
    }

    const { orders: inputOrders, grouping, f } = parsed.data;
    const builderFee = Math.min(f ?? registryRecord.maxBuilderFee, registryRecord.maxBuilderFee);

    const userAddress = walletAddress.toLowerCase() as `0x${string}`;
    if (builderFee > 0) {
      await ensureBuilderFeeWithinLimit(userAddress, registryRecord, builderFee);
    }

    const orders: OrderParams[] = [];
    const nextNormalizedOrders: NormalizedOrderInfo[] = [];

    for (const order of inputOrders) {
      const { assetId, szDecimals } = await getPerpAssetMeta(order.market);
      const size = computeBaseSize(order, szDecimals);
      const price = ensurePrice(order);
      const sizeString = decimalToString(size);
      const minSize = decimalToString(minSizeFromDecimals(szDecimals));

      const orderParams: OrderParams = {
        a: assetId,
        b: order.side === 'buy',
        p: decimalToString(price),
        s: sizeString,
        r: order.reduceOnly ?? false,
        t: {
          limit: {
            tif: order.timeInForce,
          },
        },
      };

      if (order.clientId) {
        orderParams.c = order.clientId as `0x${string}`;
      }

      orders.push(orderParams);
      nextNormalizedOrders.push({
        market: order.market,
        assetId,
        szDecimals,
        size: sizeString,
        minSize,
      });
    }

    normalizedOrders = nextNormalizedOrders;

    const exchangeClient = await getExchangeClient();
    const response = await exchangeClient.order(
      builderFee > 0
        ? {
            orders,
            grouping,
            builder: {
              b: registryRecord.splitAddress,
              f: builderFee,
            },
          }
        : {
            orders,
            grouping,
          },
    );

    const body = {
      status: 'ok',
      normalizedOrders,
      response,
    };
    storeIdempotentResponse(normalizedKey, 200, body);
    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    return handleError(error, normalizedKey, normalizedOrders);
  }
}

function computeBaseSize(order: z.infer<typeof ORDER_SCHEMA>, szDecimals: number) {
  if (order.size) {
    return ensurePositive(quantizeSize(new Decimal(order.size), szDecimals));
  }
  if (order.sizeUsd && order.price) {
    const size = new Decimal(order.sizeUsd).div(order.price);
    return ensurePositive(quantizeSize(size, szDecimals));
  }
  throw new Error('Order must include size or sizeUsd + price');
}

function ensurePositive(value: Decimal) {
  if (!value.gt(0)) {
    throw new Error('Order size is below market minimum increment');
  }
  return value;
}

function ensurePrice(order: z.infer<typeof ORDER_SCHEMA>) {
  if (!order.price) {
    throw new Error('Limit orders require a price');
  }
  return new Decimal(order.price);
}

function decimalToString(value: Decimal) {
  return value.toSignificantDigits(18).toString();
}

async function ensureBuilderFeeWithinLimit(
  user: `0x${string}`,
  registry: Awaited<ReturnType<typeof lookupBundle>>,
  builderFee: number,
) {
  if (!registry || registry.maxBuilderFee <= 0 || builderFee <= 0) return;
  const infoClient = getHttpInfoClient();
  try {
    const approved = await infoClient.maxBuilderFee({
      user,
      builder: registry.splitAddress,
    });
    if (typeof approved === 'number' && approved < builderFee) {
      throw new HttpError(403, 'Builder fee exceeds user approval');
    }
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(403, 'Unable to verify builder fee approval');
  }
}

function handleError(error: unknown, idempotencyKey: string, normalizedOrders: NormalizedOrderInfo[]) {
  if (error instanceof HttpError) {
    const body = withNormalizedOrders({ error: error.message }, normalizedOrders);
    storeIdempotentResponse(idempotencyKey, error.status, body);
    return NextResponse.json(body, { status: error.status });
  }

  if (error instanceof ApiRequestError) {
    const message = error.message || 'Hyperliquid API error';
    const code = inferStatusFromApiError(error);
    const body = withNormalizedOrders({ error: message, response: error.response }, normalizedOrders);
    storeIdempotentResponse(idempotencyKey, code, body);
    return NextResponse.json(body, { status: code });
  }

  if (error instanceof TransportError) {
    const body = withNormalizedOrders({ error: 'Hyperliquid transport error', details: error.message }, normalizedOrders);
    storeIdempotentResponse(idempotencyKey, 502, body);
    return NextResponse.json(body, { status: 502 });
  }

  const message = error instanceof Error ? error.message : 'Unexpected server error';
  const body = withNormalizedOrders({ error: message }, normalizedOrders);
  storeIdempotentResponse(idempotencyKey, 500, body);
  return NextResponse.json(body, { status: 500 });
}

function withNormalizedOrders<T extends object>(body: T, normalizedOrders: NormalizedOrderInfo[]) {
  if (normalizedOrders.length === 0) return body;
  return { ...body, normalizedOrders };
}

function inferStatusFromApiError(error: ApiRequestError) {
  const message = error.message.toLowerCase();
  if (message.includes('rate limit')) {
    return 429;
  }
  if (message.includes('unauthorized') || message.includes('builder')) {
    return 403;
  }
  if (message.includes('does not exist') || message.includes('must deposit')) {
    return 403;
  }
  if (message.includes('order') && message.includes('price')) {
    return 422;
  }
  if (message.includes('invalid') || message.includes('missing')) {
    return 400;
  }
  return 502;
}
