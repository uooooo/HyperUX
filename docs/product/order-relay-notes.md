# Hyperliquid Order Relay: Deep Dive (Next.js + SDK)

This document explains the end‑to‑end implementation of the `/api/order` relay: how Next.js App Router invokes our handler, how we shape/validate requests, how we quantize sizes using Hyperliquid metadata, how we enforce Builder Code on the server, and how errors are mapped back to clients. It includes file paths, function‑level flow, and key code snippets.

---

## App Router: How the handler is invoked

- File: `frontend/src/app/api/order/route.ts`
- Next.js App Router treats this module specially: exported HTTP verbs (e.g. `export async function POST(...)`) become the route handlers for `app/api/order`.
- We also export:
  - `export const runtime = 'nodejs'` to force Node runtime (required for ECDSA signing and SDK usage).
  - `export const dynamic = 'force-dynamic'` to ensure the route is always executed (no static caching).

At runtime, a request to `POST /api/order` is routed to the module’s `POST` function with a `NextRequest` instance.

## Transport Strategy

- Use `HttpTransport` for signed exchange actions. Hyperliquid's WebSocket POST path rejects mixed HTTP keepalive settings in Node 20/23, which produced `Server error: Error parsing JSON into valid websocket request`. Switching to HTTPS with `fetchOptions.keepalive = false` eliminated the keepalive mismatch.
- Keep an `InfoClient` over HTTP (same keepalive override) for builder-fee checks. The shared client reuses the same transport configuration so we avoid the Node fetch bug from the WebSocket fallback.

## Builder Code Enforcement

- Registry lookups normalize the builder split address to lowercase; this prevents signature recovery failures when the registry value is stored with checksum casing.
- Builder fee approvals are queried through the HTTP info client before attaching `builder: { b, f }` to the order. Any rejection surfaces as HTTP 403 instead of a generic 502.

## Size and Price Normalization

- The `meta.universe` response now populates both `assetId` and `szDecimals` for each perp market. We quantize every requested size to the market's allowed decimal precision (flooring). This removes 422 "Failed to deserialize" responses when Hyperliquid rejects a payload that has too many decimal places.
- `sizeUsd` requests convert to base units via `sizeUsd / price`, then quantize and reject if the result underflows the minimum increment.
- Clients must still supply a realistic price. Hyperliquid rejects anything more than ~80% away from the mid; we map this API error to HTTP 422 so the caller can adjust.
- The API response exposes `normalizedOrders[]`, including the computed `size`, `minSize`, and `szDecimals` so front-ends can display the minimum base unit directly in the UI.

## Idempotency Behaviour

- Responses are cached for 60 seconds using the normalized `x-idempotency-key`. Replay requests with the same key return the cached payload (including errors) instead of hitting Hyperliquid again.

## Sample Request

```
POST /api/order HTTP/1.1
Content-Type: application/json
x-bundle-hash: demo
x-wallet-address: 0x...
x-idempotency-key: order-2031

{
  "orders": [
    {
      "market": "BTC-PERP",
      "side": "buy",
      "sizeUsd": 50,
      "price": 115344,
      "timeInForce": "Gtc",
      "reduceOnly": false,
      "clientId": "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }
  ],
  "grouping": "na"
}
```

The handler will quantize the base size (e.g. `0.00043` for BTC) and forward it with the enforced builder code.

---

## File‑by‑file walkthrough

### 1) API handler: `frontend/src/app/api/order/route.ts`

Key exports and schemas:

```ts
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
    clientId: z.string().regex(/^0x[a-fA-F0-9]{32}$/).optional(),
  })
  .superRefine((data, ctx) => {
    const hasBaseSize = typeof data.size === 'number';
    const hasUsdSize = typeof data.sizeUsd === 'number' && typeof data.price === 'number';
    if (!hasBaseSize && !hasUsdSize) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Provide size (base units) or sizeUsd with price', path: ['size'] });
    }
    if (!data.price) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Limit orders require a price', path: ['price'] });
    }
  });

const ORDER_REQUEST_SCHEMA = z.object({
  orders: z.array(ORDER_SCHEMA).min(1),
  grouping: z.enum(['na', 'normalTpsl', 'positionTpsl']).default('na'),
  f: z.number().int().min(0).max(1000).optional(),
});
```

Execution flow inside `POST(request: NextRequest)`:

1) Header validation and idempotency

```ts
const headersParse = HEADER_SCHEMA.safeParse({
  bundleHash: request.headers.get('x-bundle-hash'),
  walletAddress: request.headers.get('x-wallet-address'),
  idempotencyKey: request.headers.get('x-idempotency-key'),
});
// normalize and serve cached response when key is replayed within TTL
```

2) Body parsing and request validation

```ts
const parsed = ORDER_REQUEST_SCHEMA.safeParse(await request.json());
// on failure: 400 with detailed Zod errors
```

3) Deployment guard and registry lookup

```ts
if (!process.env.HYPERLIQUID_API_PRIVATE_KEY) return 501;
const registryRecord = await lookupBundle(bundleHash); // builder split + fMax
```

4) Builder enforcement and approval check

```ts
const builderFee = Math.min(f ?? registryRecord.maxBuilderFee, registryRecord.maxBuilderFee);
if (builderFee > 0) await ensureBuilderFeeWithinLimit(userAddress, registryRecord, builderFee);
```

5) Market metadata + size quantisation

```ts
for (const order of inputOrders) {
  const { assetId, szDecimals } = await getPerpAssetMeta(order.market);
  const size = computeBaseSize(order, szDecimals); // floors to szDecimals
  const price = ensurePrice(order);
  orders.push({ a: assetId, b: order.side === 'buy', p: decimalToString(price), s: decimalToString(size), r: order.reduceOnly ?? false, t: { limit: { tif: order.timeInForce } }, ...(order.clientId && { c: order.clientId as `0x${string}` }) });
  normalizedOrders.push({ market: order.market, assetId, szDecimals, size: decimalToString(size), minSize: decimalToString(minSizeFromDecimals(szDecimals)) });
}
```

6) Hyperliquid call

```ts
const exchangeClient = await getExchangeClient();
const response = await exchangeClient.order(
  builderFee > 0 ? { orders, grouping, builder: { b: registryRecord.splitAddress, f: builderFee } } : { orders, grouping }
);
// return { status:'ok', normalizedOrders, response }
```

7) Error mapping with context

```ts
if (error instanceof ApiRequestError) {
  // e.g. "Order price cannot be more than 80% away..." -> 422
  return json({ error: error.message, response: error.response, normalizedOrders }, 422);
}
```

Supporting functions (excerpt):

```ts
function computeBaseSize(order, szDecimals) {
  if (order.size) return ensurePositive(quantizeSize(new Decimal(order.size), szDecimals));
  if (order.sizeUsd && order.price) return ensurePositive(quantizeSize(new Decimal(order.sizeUsd).div(order.price), szDecimals));
  throw new Error('Order must include size or sizeUsd + price');
}

async function ensureBuilderFeeWithinLimit(user, registry, builderFee) {
  if (!registry || registry.maxBuilderFee <= 0 || builderFee <= 0) return;
  const approved = await getHttpInfoClient().maxBuilderFee({ user, builder: registry.splitAddress });
  if (typeof approved === 'number' && approved < builderFee) throw new HttpError(403, 'Builder fee exceeds user approval');
}
```

### 2) Hyperliquid SDK clients: `frontend/src/server/hyperliquid/exchange.ts`

Key points:

```ts
const transport = new hl.HttpTransport({
  isTestnet,
  server: { mainnet: { api: env.hyperliquid.apiUrl }, testnet: { api: env.hyperliquid.apiUrl } },
  fetchOptions: { keepalive: false },
});

export async function getExchangeClient() {
  const account = privateKeyToAccount(process.env.HYPERLIQUID_API_PRIVATE_KEY as `0x${string}`);
  return exchangeClient ??= new hl.ExchangeClient({ wallet: account, transport, isTestnet });
}

export function getHttpInfoClient() {
  // Separate instance; same keepalive workaround
  return httpInfoClient ??= new hl.InfoClient({ transport: new hl.HttpTransport({ isTestnet, server: { ... }, fetchOptions: { keepalive:false } }) });
}
```

Why HTTP? We observed WS POST incompatibilities around keepalive and server parsing in Node 20/23; HTTP with keepalive=false is reliable across environments (Next dev/Prod, Vercel Functions).

### 3) Market metadata + helpers: `frontend/src/server/hyperliquid/assets.ts`

```ts
interface PerpMeta { assetId: number; szDecimals: number; }

const cache = new Map<string, PerpMeta>();
async function refreshMetaIfNeeded() {
  const meta = await getCachedInfoClient().meta();
  meta.universe.forEach((entry, index) => cache.set(entry.name.toUpperCase(), { assetId:index, szDecimals: entry.szDecimals }));
}

export async function getPerpAssetMeta(market: string): Promise<PerpMeta> { await refreshMetaIfNeeded(); /* ... */ }
export function quantizeSize(value: Decimal, decimals: number) { return value.toDecimalPlaces(decimals, Decimal.ROUND_FLOOR); }
export function minSizeFromDecimals(decimals: number) { return decimals <= 0 ? new Decimal(1) : new Decimal(1).div(new Decimal(10).pow(decimals)); }
```

This aligns with Hyperliquid docs: `szDecimals` defines allowable base‑size precision per market. Sending more decimals causes deserialization/signature validation failures; flooring client input to `szDecimals` is the safe server‑side guard.

### 4) Registry: `frontend/src/server/registry.ts`

The in‑memory registry normalizes `splitAddress` to lowercase on insertion and lookup so the signed payloads are deterministic (matching HL guidelines about lowercasing addresses for signing).

---

## Why we quantize size (best practice)

Hyperliquid enforces per‑market lot sizes (`szDecimals`). Payloads with more precision are rejected at the API boundary (often with `422 Failed to deserialize…`). Using `info.meta` to drive server‑side flooring ensures every forwarded order adheres to venue constraints, while still allowing the UI to accept `sizeUsd` convenience inputs.

Additional venue rules (e.g. minimum notional $10, price distance, post‑only behaviour) are still enforced by Hyperliquid; we surface their messages and map to appropriate HTTP codes (400/403/422) for consistent client handling.

---

## End‑to‑end sequence

1. Client → `/api/order` with headers (`x-bundle-hash`, `x-wallet-address`, `x-idempotency-key`) and a JSON body per schema.
2. Server validates headers/body; rejects or de‑duplicates via idempotency cache.
3. Server looks up builder split/fMax from registry; optionally checks maxBuilderFee via Info API.
4. For each order, server resolves `{ assetId, szDecimals }`, quantizes `size`, and prepares `OrderParams`.
5. Server signs and sends via SDK `ExchangeClient.order` using the HTTP transport with keepalive disabled.
6. Server returns Hyperliquid’s response along with `normalizedOrders[]` (size/minSize/szDecimals/assetId) for UI hints.

---

## Local testing tips

- Quick manual tests: `frontend/requests/api-order.http` using your dev server (`bun run dev`).
- Use realistic prices and a 32‑hex `clientId` (e.g. `0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`).
- If you see `422 Failed to deserialize…`, check size precision; if you see `Order price cannot be more than 80% away…`, adjust the price towards mid.

---

## Appendix: Error mapping cheatsheet

- 400 – Zod validation (schema), missing price/size.
- 403 – Builder fee approval missing/insufficient, unauthorized bundle hash.
- 422 – Venue constraints (e.g. price distance), surfaced from `ApiRequestError`.
- 502 – Transport layer (rare now that HTTP keepalive=false is used).

---

## Code‑level, line‑by‑line commentary (important parts only)

Below are condensed code slices from the repo with terse commentary so you can map concepts directly to implementation.

### A. Route entry, runtime, dynamic

```ts
// frontend/src/app/api/order/route.ts
export const runtime = 'nodejs';      // Force Node runtime for signing/SDK
export const dynamic = 'force-dynamic'; // Always run on demand (no ISR cache)
```

### B. Shape input with Zod + cross‑field rules

```ts
// ORDER_SCHEMA enforces 128‑bit cloid + either size or (sizeUsd+price)
const ORDER_SCHEMA = z.object({
  market: z.string().min(1),
  side: z.enum(['buy','sell']),
  price: z.number().positive().optional(),
  size: z.number().positive().optional(),
  sizeUsd: z.number().positive().optional(),
  timeInForce: z.enum(['Gtc','Ioc','Alo']).default('Gtc'),
  clientId: z.string().regex(/^0x[a-fA-F0-9]{32}$/).optional(),
}).superRefine((data, ctx) => {
  const hasBase = typeof data.size === 'number';
  const hasUsd = typeof data.sizeUsd === 'number' && typeof data.price === 'number';
  if (!hasBase && !hasUsd) ctx.addIssue({ message: 'Provide size (base units) or sizeUsd with price', path:['size'], code:z.ZodIssueCode.custom });
  if (!data.price) ctx.addIssue({ message: 'Limit orders require a price', path:['price'], code:z.ZodIssueCode.custom });
});
```

Why: schema‑first catches client mistakes early and returns structured errors. The superRefine encodes venue‑agnostic invariants.

### C. Idempotency guard

```ts
const IDEMPOTENCY_TTL_MS = 60_000;
const idempotencyCache = new Map<string, { timestamp:number; status:number; body:unknown }>();

function getCachedResponse(key: string) {
  const e = idempotencyCache.get(key);
  if (!e) return null;
  if (Date.now() - e.timestamp > IDEMPOTENCY_TTL_MS) { idempotencyCache.delete(key); return null; }
  return e;
}
```

Why: Hyperliquid actions are not free. Caching the last result per key prevents duplicate sends.

### D. Builder enforcement and approval

```ts
const builderFee = Math.min(f ?? registryRecord.maxBuilderFee, registryRecord.maxBuilderFee);
if (builderFee > 0) await ensureBuilderFeeWithinLimit(userAddress, registryRecord, builderFee);

async function ensureBuilderFeeWithinLimit(user, registry, fee) {
  if (!registry || registry.maxBuilderFee <= 0 || fee <= 0) return;
  const approved = await getHttpInfoClient().maxBuilderFee({ user, builder: registry.splitAddress });
  if (typeof approved === 'number' && approved < fee) throw new HttpError(403, 'Builder fee exceeds user approval');
}
```

Why: server side decides `b,f` to guarantee attribution and revenue split; we never trust client‑provided builder fields.

### E. Market lookup + size quantisation

```ts
for (const order of inputOrders) {
  const { assetId, szDecimals } = await getPerpAssetMeta(order.market);
  const size = computeBaseSize(order, szDecimals); // ← floors to lot size
  const price = ensurePrice(order);

  orders.push({
    a: assetId,
    b: order.side === 'buy',
    p: decimalToString(price),
    s: decimalToString(size),
    r: order.reduceOnly ?? false,
    t: { limit: { tif: order.timeInForce } },
    ...(order.clientId && { c: order.clientId as `0x${string}` }),
  });
}
```

Why: Hyperliquid rejects payloads with more decimals than `szDecimals`. We floor before signing to avoid venue errors.

### F. Asset meta cache

```ts
// frontend/src/server/hyperliquid/assets.ts
const cache = new Map<string, { assetId:number; szDecimals:number }>();
async function refreshMetaIfNeeded() {
  const meta = await getCachedInfoClient().meta();
  meta.universe.forEach((entry, index) => cache.set(entry.name.toUpperCase(), { assetId:index, szDecimals:entry.szDecimals }));
}
export async function getPerpAssetMeta(market: string) { await refreshMetaIfNeeded(); return cache.get(normalize(market))!; }
export function quantizeSize(v: Decimal, d: number) { return v.toDecimalPlaces(d, Decimal.ROUND_FLOOR); }
export function minSizeFromDecimals(d: number) { return d <= 0 ? new Decimal(1) : new Decimal(1).div(new Decimal(10).pow(d)); }
```

### G. Exchange/Info clients with safe HTTP transport

```ts
// frontend/src/server/hyperliquid/exchange.ts
const transport = new hl.HttpTransport({ isTestnet, server:{ mainnet:{ api: env.hyperliquid.apiUrl }, testnet:{ api: env.hyperliquid.apiUrl } }, fetchOptions:{ keepalive:false } });
export async function getExchangeClient() { const acct = privateKeyToAccount(process.env.HYPERLIQUID_API_PRIVATE_KEY as `0x${string}`); return exchangeClient ??= new hl.ExchangeClient({ wallet: acct, transport, isTestnet }); }
export function getHttpInfoClient() { return httpInfoClient ??= new hl.InfoClient({ transport: new hl.HttpTransport({ isTestnet, server:{ ... }, fetchOptions:{ keepalive:false } }) }); }
```

Why: consistent, robust across Node/Next/Vercel. No WS POST vagaries; no keepalive bug.

### H. Response shape with normalised order hints

```ts
const body = { status: 'ok', normalizedOrders, response };
return NextResponse.json(body, { status: 200 });
```

Why: UI can render `minSize`, `szDecimals`, and the exact `size` we signed—helps users adjust inputs without another roundtrip.
