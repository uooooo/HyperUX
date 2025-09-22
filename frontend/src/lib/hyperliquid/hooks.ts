'use client';

import { useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import type { AllMids, PerpsClearinghouseState } from '@nktkas/hyperliquid';

import { env } from '@/lib/config/env';
import {
  fetchAllMids,
  fetchPerpAssetContexts,
  fetchRecentFundingHistory,
  fetchClearinghouseState,
  type PerpAssetWithDerived,
  type FundingSnapshot,
} from './service';
import { subscribeAllMids } from './ws-manager';
import { normalizePerpMarketSymbol } from './utils';

const allMidsKey = (dex: string) => ['hyperliquid', 'allMids', dex] as const;
type AllMidsKey = ReturnType<typeof allMidsKey>;

const perpCtxKey = (dex: string) => ['hyperliquid', 'perpAssetCtxs', dex] as const;
type PerpCtxKey = ReturnType<typeof perpCtxKey>;

const fundingHistoryKey = (coin: string) => ['hyperliquid', 'fundingHistory', coin] as const;
type FundingHistoryKey = ReturnType<typeof fundingHistoryKey>;

const clearinghouseKey = (user: string | null) => ['hyperliquid', 'clearinghouse', user] as const;
type ClearinghouseKey = ReturnType<typeof clearinghouseKey>;

type UseAllMidsOptions = Omit<UseQueryOptions<AllMids, Error, AllMids, AllMidsKey>, 'queryKey' | 'queryFn'>;
type UsePerpCtxOptions = Omit<
  UseQueryOptions<Record<string, PerpAssetWithDerived>, Error, Record<string, PerpAssetWithDerived>, PerpCtxKey>,
  'queryKey' | 'queryFn'
>;
type UseFundingHistoryOptions = Omit<
  UseQueryOptions<FundingSnapshot[], Error, FundingSnapshot[], FundingHistoryKey>,
  'queryKey' | 'queryFn'
>;
type UseClearinghouseOptions = Omit<
  UseQueryOptions<PerpsClearinghouseState | null, Error, PerpsClearinghouseState | null, ClearinghouseKey>,
  'queryKey' | 'queryFn'
>;

export function useHyperliquidAllMids(options?: UseAllMidsOptions) {
  const dex = env.hyperliquid.dex;
  const queryClient = useQueryClient();
  const query = useQuery<AllMids, Error, AllMids, AllMidsKey>({
    queryKey: allMidsKey(dex),
    queryFn: () => fetchAllMids(dex),
    staleTime: 5_000,
    gcTime: 60_000,
    refetchOnWindowFocus: false,
    ...options,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let unsubscribe: (() => Promise<void>) | undefined;
    let isMounted = true;
    subscribeAllMids((payload) => {
      queryClient.setQueryData(allMidsKey(dex), payload);
    }, dex)
      .then((fn) => {
        if (!isMounted) {
          fn();
          return;
        }
        unsubscribe = fn;
      })
      .catch((error) => {
        console.error('Hyperliquid allMids subscription failed', error);
      });
    return () => {
      isMounted = false;
      if (unsubscribe) {
        void unsubscribe();
      }
    };
  }, [dex, queryClient]);

  return query;
}

export function usePerpAssetContexts(options?: UsePerpCtxOptions) {
  const dex = env.hyperliquid.dex;
  return useQuery<Record<string, PerpAssetWithDerived>, Error, Record<string, PerpAssetWithDerived>, PerpCtxKey>({
    queryKey: perpCtxKey(dex),
    queryFn: () => fetchPerpAssetContexts(dex),
    staleTime: 15_000,
    gcTime: 120_000,
    refetchInterval: 15_000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useFundingHistory(coin: string, options?: UseFundingHistoryOptions) {
  return useQuery<FundingSnapshot[], Error, FundingSnapshot[], FundingHistoryKey>({
    queryKey: fundingHistoryKey(coin),
    queryFn: () => fetchRecentFundingHistory(coin),
    enabled: Boolean(coin),
    staleTime: 30_000,
    gcTime: 120_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useClearinghouseState(user: string | null, options?: UseClearinghouseOptions) {
  return useQuery<PerpsClearinghouseState | null, Error, PerpsClearinghouseState | null, ClearinghouseKey>({
    queryKey: clearinghouseKey(user),
    queryFn: () => fetchClearinghouseState(user ?? ''),
    enabled: Boolean(user),
    staleTime: 5_000,
    gcTime: 60_000,
    refetchInterval: 5_000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useHyperliquidPerpMetrics(symbol?: string | null) {
  const normalized = useMemo(() => (symbol ? normalizePerpMarketSymbol(symbol) : undefined), [symbol]);
  const { data: mids } = useHyperliquidAllMids({ enabled: Boolean(normalized) });
  const { data: assets } = usePerpAssetContexts({ enabled: Boolean(normalized) });

  if (!normalized) {
    return { market: undefined, asset: undefined, price: undefined, markPrice: undefined, midPrice: undefined };
  }

  const asset = assets?.[normalized];
  const midValue = mids?.[normalized];
  const midPrice = typeof midValue === 'string' ? Number(midValue) : undefined;
  const markPrice = asset?.markPrice ?? undefined;
  const price = typeof markPrice === 'number' && !Number.isNaN(markPrice) ? markPrice : midPrice;

  return {
    market: normalized,
    asset,
    price,
    markPrice,
    midPrice,
  };
}
