'use client';

import { createAppKit } from '@reown/appkit/react';
import { mainnet } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi';

import { networks, projectId, wagmiAdapter, wagmiConfig } from '@/config/appkit';

const queryClient = new QueryClient();

const metadata = {
  name: 'HyperUX',
  description: 'Composable trading surfaces for Hyperliquid',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://hyperux.dev',
  icons: ['/favicon.ico'],
};

let hasInitializedAppKit = false;

if (projectId && typeof window !== 'undefined' && !hasInitializedAppKit) {
  createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork: mainnet,
    metadata,
    features: {
      analytics: true,
    },
  });
  hasInitializedAppKit = true;
}

export default function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(wagmiConfig as Config, cookies ?? undefined);

  return (
    <WagmiProvider config={wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
