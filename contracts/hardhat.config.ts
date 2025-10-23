import { HardhatUserConfig } from 'hardhat/config';
import hardhatViem from '@nomicfoundation/hardhat-viem';
import hardhatNetworkHelpers from '@nomicfoundation/hardhat-network-helpers';
import hardhatMocha from '@nomicfoundation/hardhat-mocha';
import hardhatViemAssertions from '@nomicfoundation/hardhat-viem-assertions';

const config: HardhatUserConfig = {
  plugins: [
    hardhatViem,
    hardhatNetworkHelpers,
    hardhatMocha,
    hardhatViemAssertions,
  ],
  solidity: {
    version: '0.8.28',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      type: 'edr-simulated' as const,
      chainId: 31337,
    },
    arbitrumSepolia: {
      type: 'http' as const,
      url:
        process.env.ARBITRUM_SEPOLIA_RPC_URL ||
        'https://sepolia-rollup.arbitrum.io/rpc',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 421614,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;
