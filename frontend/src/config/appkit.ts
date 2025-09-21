import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import type { Chain } from 'viem';
import { cookieStorage, createStorage } from 'wagmi';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not defined. Please set it in .env.local');
}

export const networks: [Chain, ...Chain[]] = [mainnet, arbitrum];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
