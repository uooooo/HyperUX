import * as hl from '@nktkas/hyperliquid';
import { env } from '@/lib/config/env';

let infoClient: hl.InfoClient | null = null;
let httpTransport: hl.HttpTransport | null = null;

function getHttpTransport() {
  if (!httpTransport) {
    httpTransport = new hl.HttpTransport({
      isTestnet: env.hyperliquid.network === 'testnet',
      server: {
        mainnet: {
          api: env.hyperliquid.apiUrl,
        },
        testnet: {
          api: env.hyperliquid.apiUrl,
        },
      },
    });
  }
  return httpTransport;
}

export function getInfoClient() {
  if (!infoClient) {
    infoClient = new hl.InfoClient({ transport: getHttpTransport() });
  }
  return infoClient;
}

let websocketTransport: hl.WebSocketTransport | null = null;
let subscriptionClient: hl.SubscriptionClient | null = null;

function getWebSocketTransport() {
  if (typeof window === 'undefined') {
    throw new Error('Hyperliquid WebSocket transport is only available in the browser');
  }
  if (!websocketTransport) {
    websocketTransport = new hl.WebSocketTransport({
      url: env.hyperliquid.wsUrl,
      reconnect: {
        maxRetries: Infinity,
      },
      keepAlive: {
        interval: 30_000,
        timeout: 10_000,
      },
    });
  }
  return websocketTransport;
}

export function getSubscriptionClient() {
  if (typeof window === 'undefined') {
    throw new Error('Hyperliquid subscriptions require a browser environment');
  }
  if (!subscriptionClient) {
    subscriptionClient = new hl.SubscriptionClient({ transport: getWebSocketTransport() });
  }
  return subscriptionClient;
}

export type HyperliquidSubscription = hl.Subscription;
