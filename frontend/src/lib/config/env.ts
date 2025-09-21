export type HyperliquidNetwork = 'mainnet' | 'testnet';

const hyperliquidNetwork =
  (process.env.NEXT_PUBLIC_HYPERLIQUID_NETWORK as HyperliquidNetwork | undefined) ?? 'mainnet';

const mainnetDefaults = {
  api: 'https://api.hyperliquid.xyz',
  ws: 'wss://api.hyperliquid.xyz/ws',
};

const testnetDefaults = {
  api: 'https://api.hyperliquid-testnet.xyz',
  ws: 'wss://api.hyperliquid-testnet.xyz/ws',
};

const networkDefaults = hyperliquidNetwork === 'testnet' ? testnetDefaults : mainnetDefaults;

export const env = {
  hyperliquid: {
    network: hyperliquidNetwork,
    apiUrl: process.env.NEXT_PUBLIC_HYPERLIQUID_API_URL ?? networkDefaults.api,
    wsUrl: process.env.NEXT_PUBLIC_HYPERLIQUID_WS_URL ?? networkDefaults.ws,
    dex: process.env.NEXT_PUBLIC_HYPERLIQUID_DEX ?? '',
  },
  binance: {
    restUrl: 'https://api.binance.com',
  },
  upbit: {
    restUrl: 'https://api.upbit.com',
  },
} as const;

export type Env = typeof env;
