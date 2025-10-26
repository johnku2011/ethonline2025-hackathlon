import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Pay2Earn',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '0',
  chains: [arbitrumSepolia],
  ssr: true,
});
