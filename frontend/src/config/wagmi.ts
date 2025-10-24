import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, arbitrumSepolia } from 'wagmi/chains';
import { localhost } from './chains';

export const config = getDefaultConfig({
  appName: 'PyUSD Subscription Platform',
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [
    // Development: localhost (Hardhat node)
    ...(process.env.NEXT_PUBLIC_ENABLE_LOCALHOST === 'true' ? [localhost] : []),
    // Testnet
    arbitrumSepolia,
    // Production
    ...(process.env.NODE_ENV === 'production' ? [arbitrum] : []),
  ],
  ssr: true,
});
