import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'PyUSD Subscription Platform',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [
    arbitrumSepolia, // Testnet for demo
    ...(process.env.NODE_ENV === 'production' ? [arbitrum] : []),
  ],
  ssr: true,
});

