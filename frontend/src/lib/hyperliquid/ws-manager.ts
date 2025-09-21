'use client';

import type { AllMids } from '@nktkas/hyperliquid';

import { getSubscriptionClient, HyperliquidSubscription } from './client';

export type AllMidsListener = (data: AllMids) => void;

type AllMidsBucket = {
  listeners: Set<AllMidsListener>;
  subscription: HyperliquidSubscription | null;
  subscribePromise: Promise<void> | null;
};

const buckets = new Map<string, AllMidsBucket>();

function getBucket(dex: string): AllMidsBucket {
  let bucket = buckets.get(dex);
  if (!bucket) {
    bucket = {
      listeners: new Set(),
      subscription: null,
      subscribePromise: null,
    };
    buckets.set(dex, bucket);
  }
  return bucket;
}

async function ensureAllMidsSubscription(dex: string) {
  const bucket = getBucket(dex);
  if (bucket.subscription || bucket.subscribePromise) {
    return bucket.subscribePromise;
  }
  const client = getSubscriptionClient();
  bucket.subscribePromise = client
    .allMids({ dex }, (payload) => {
      const mids = payload?.mids;
      if (!mids) return;
      bucket.listeners.forEach((listener) => listener(mids));
    })
    .then((subscription) => {
      bucket.subscription = subscription;
    })
    .finally(() => {
      bucket.subscribePromise = null;
    });
  return bucket.subscribePromise;
}

export async function subscribeAllMids(listener: AllMidsListener, dex = '') {
  if (typeof window === 'undefined') {
    return async () => {};
  }
  const bucket = getBucket(dex);
  bucket.listeners.add(listener);
  await ensureAllMidsSubscription(dex);
  return async () => {
    bucket.listeners.delete(listener);
    if (bucket.listeners.size === 0 && bucket.subscription) {
      await bucket.subscription.unsubscribe();
      bucket.subscription = null;
      buckets.delete(dex);
    }
  };
}
