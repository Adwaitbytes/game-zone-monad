import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { monadTestnet } from './chains';
import { sepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Game Zone Monad',
  projectId: '1326c337e84f78a3735c01e44d2a7331',
  chains: [sepolia, monadTestnet],
  ssr: false,
  batch: {
    multicall: true,
  },
  pollingInterval: 12000,
});
