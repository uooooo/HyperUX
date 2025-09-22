import Decimal from 'decimal.js-light';

import { getCachedInfoClient } from './exchange';

interface PerpMeta {
  assetId: number;
  szDecimals: number;
}

const cache = new Map<string, PerpMeta>();
let lastMetaFetch = 0;
const META_TTL_MS = 60_000;

async function refreshMetaIfNeeded() {
  const now = Date.now();
  if (now - lastMetaFetch < META_TTL_MS && cache.size > 0) {
    return;
  }
  const info = getCachedInfoClient();
  const meta = await info.meta();
  meta.universe.forEach((entry, index) => {
    cache.set(entry.name.toUpperCase(), {
      assetId: index,
      szDecimals: entry.szDecimals,
    });
  });
  lastMetaFetch = now;
}

export async function getPerpAssetMeta(market: string): Promise<PerpMeta> {
  await refreshMetaIfNeeded();
  const normalized = normalizeMarketName(market);
  const meta = cache.get(normalized);
  if (!meta) {
    throw new Error(`Unknown market: ${market}`);
  }
  return meta;
}

function normalizeMarketName(market: string) {
  const upper = market.toUpperCase();
  if (upper.endsWith('-PERP')) {
    return upper.replace('-PERP', '');
  }
  return upper;
}

export function quantizeSize(value: Decimal, decimals: number) {
  if (decimals < 0) return value;
  return value.toDecimalPlaces(decimals, Decimal.ROUND_FLOOR);
}

export function minSizeFromDecimals(decimals: number) {
  if (decimals <= 0) {
    return new Decimal(1);
  }
  return new Decimal(1).div(new Decimal(10).pow(decimals));
}
