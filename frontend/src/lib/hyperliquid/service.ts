import type {
  AllMids,
  FundingHistory,
  PerpsAssetCtx,
  PerpsMetaAndAssetCtxs,
  PerpsClearinghouseState,
} from '@nktkas/hyperliquid';

import { env } from '@/lib/config/env';
import { getInfoClient } from './client';

const ONE_DAY_MS = 86_400_000;

function toNumber(value: string | null | undefined) {
  if (value === null || value === undefined) {
    return undefined;
  }
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
}

export interface PerpAssetWithDerived {
  coin: string;
  raw: PerpsAssetCtx;
  markPrice: number;
  midPrice: number | null;
  fundingRate: number;
  premiumRate: number | null;
  openInterest: number;
  oraclePrice: number;
}

function enrichPerpAssets([meta, assetCtxs]: PerpsMetaAndAssetCtxs) {
  return assetCtxs.reduce<Record<string, PerpAssetWithDerived>>((acc, ctx, index) => {
    const coin = meta.universe[index]?.name;
    if (!coin) return acc;
    acc[coin] = {
      coin,
      raw: ctx,
      markPrice: toNumber(ctx.markPx) ?? 0,
      midPrice: ctx.midPx ? toNumber(ctx.midPx) ?? null : null,
      fundingRate: toNumber(ctx.funding) ?? 0,
      premiumRate: ctx.premium ? toNumber(ctx.premium) ?? null : null,
      openInterest: toNumber(ctx.openInterest) ?? 0,
      oraclePrice: toNumber(ctx.oraclePx) ?? 0,
    };
    return acc;
  }, {});
}

export async function fetchAllMids(dex = env.hyperliquid.dex): Promise<AllMids> {
  return getInfoClient().allMids({ dex });
}

export async function fetchPerpAssetContexts(dex = env.hyperliquid.dex) {
  const result = await getInfoClient().metaAndAssetCtxs({ dex });
  return enrichPerpAssets(result);
}

export interface FundingSnapshot {
  coin: string;
  fundingRate: number;
  premium: number;
  time: number;
}

export async function fetchRecentFundingHistory(coin: string, lookbackMs = ONE_DAY_MS): Promise<FundingSnapshot[]> {
  const endTime = Date.now();
  const startTime = endTime - lookbackMs;
  const history = await getInfoClient().fundingHistory({ coin, startTime, endTime });
  return history.map((entry: FundingHistory) => ({
    coin: entry.coin,
    fundingRate: toNumber(entry.fundingRate) ?? 0,
    premium: toNumber(entry.premium) ?? 0,
    time: entry.time,
  }));
}

export async function fetchClearinghouseState(user: string): Promise<PerpsClearinghouseState | null> {
  if (!user) {
    return null;
  }
  try {
    return await getInfoClient().clearinghouseState({ user: user as `0x${string}`, dex: env.hyperliquid.dex || undefined });
  } catch (error) {
    console.error('Failed to fetch clearinghouse state', error);
    return null;
  }
}
