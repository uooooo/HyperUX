'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { fetchRedstonePrice, type RedstonePrice } from '@/lib/markets/redstone';

type UseRedstonePriceOptions = Omit<UseQueryOptions<RedstonePrice | null, Error, RedstonePrice | null>, 'queryKey' | 'queryFn'>;

export function useRedstonePrice(symbol: string, options?: UseRedstonePriceOptions) {
  return useQuery({
    queryKey: ['redstone', symbol],
    queryFn: () => fetchRedstonePrice(symbol),
    enabled: Boolean(symbol),
    staleTime: 30_000,
    gcTime: 60_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
    ...options,
  });
}
