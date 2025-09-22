'use client';

import { useMutation } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { useTradeBundle } from '@/context/trade-bundle';

export type PlaceOrderInput = {
  market: string;
  side: 'buy' | 'sell';
  price: number;
  sizeUsd: number;
  reduceOnly?: boolean;
  timeInForce?: 'Gtc' | 'Ioc' | 'Alo';
  clientId?: `0x${string}`;
};

async function submitOrder(
  bundleHash: string,
  walletAddress: string,
  order: PlaceOrderInput,
) {
  if (!order.market) {
    throw new Error('Missing market symbol');
  }
  if (!(order.price > 0) || !(order.sizeUsd > 0)) {
    throw new Error('Price and sizeUsd must be positive');
  }

  const idempotencyKey = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-bundle-hash': bundleHash,
      'x-wallet-address': walletAddress,
      'x-idempotency-key': idempotencyKey,
    },
    body: JSON.stringify({
      orders: [
        {
          market: order.market,
          side: order.side,
          price: order.price,
          sizeUsd: order.sizeUsd,
          reduceOnly: order.reduceOnly ?? false,
          timeInForce: order.timeInForce ?? 'Gtc',
          clientId: order.clientId,
          orderType: 'limit',
        },
      ],
    }),
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch (error) {
    if (response.ok) {
      throw error;
    }
  }

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'error' in payload && typeof (payload as { error?: string }).error === 'string'
        ? (payload as { error: string }).error
        : 'Order request failed');
    throw new Error(message);
  }

  return payload;
}

export function usePlaceOrder() {
  const { bundleHash } = useTradeBundle();
  const { address } = useAccount();

  return useMutation({
    mutationKey: ['placeOrder', bundleHash, address],
    mutationFn: async (order: PlaceOrderInput) => {
      if (!address) {
        throw new Error('Connect wallet to trade');
      }
      return submitOrder(bundleHash, address, order);
    },
  });
}
