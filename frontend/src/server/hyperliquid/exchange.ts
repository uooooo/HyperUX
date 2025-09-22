import * as hl from '@nktkas/hyperliquid';
import { privateKeyToAccount } from 'viem/accounts';

import { env } from '@/lib/config/env';

const privateKey = process.env.HYPERLIQUID_API_PRIVATE_KEY;

if (!privateKey) {
  console.warn('[hyperliquid] HYPERLIQUID_API_PRIVATE_KEY is not set. /api/order will return 501.');
}

const isTestnet = env.hyperliquid.network === 'testnet';

let exchangeClient: hl.ExchangeClient | null = null;
let infoClient: hl.InfoClient | null = null;

export async function getExchangeClient() {
  if (!privateKey) {
    throw new Error('HYPERLIQUID_API_PRIVATE_KEY is not configured');
  }
  if (!exchangeClient) {
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const transport = new hl.HttpTransport({
      isTestnet,
      server: {
        mainnet: { api: env.hyperliquid.apiUrl },
        testnet: { api: env.hyperliquid.apiUrl },
      },
      fetchOptions: {
        keepalive: false,
      },
    });

    exchangeClient = new hl.ExchangeClient({
      wallet: account,
      transport,
      isTestnet,
    });
  }
  return exchangeClient;
}

export function getCachedInfoClient() {
  if (!infoClient) {
    const ws = new hl.WebSocketTransport({
      url: env.hyperliquid.wsUrl,
      autoResubscribe: true,
      keepAlive: { interval: 30_000, timeout: 10_000 },
      reconnect: { maxRetries: Infinity },
    });
    infoClient = new hl.InfoClient({ transport: ws });
  }
  return infoClient;
}

// Dedicated HTTP InfoClient for APIs not supported via WebSocket (like maxBuilderFee)
let httpInfoClient: hl.InfoClient | null = null;

export function getHttpInfoClient() {
  if (!httpInfoClient) {
    const transport = new hl.HttpTransport({
      isTestnet,
      server: {
        mainnet: { api: env.hyperliquid.apiUrl },
        testnet: { api: env.hyperliquid.apiUrl },
      },
      fetchOptions: {
        keepalive: false,
      },
    });

    httpInfoClient = new hl.InfoClient({ transport });
  }
  return httpInfoClient;
}
