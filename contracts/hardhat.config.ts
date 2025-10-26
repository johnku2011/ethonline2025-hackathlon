import { HardhatUserConfig } from 'hardhat/config';
import hardhatToolboxViem from '@nomicfoundation/hardhat-toolbox-viem';
import hardhatIgnitionViem from '@nomicfoundation/hardhat-ignition-viem';
import 'dotenv/config';

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViem, hardhatIgnitionViem],
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
    localhost: {
      type: 'http' as const,
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },
    arbitrumSepolia: {
      type: 'http' as const,
      url:
        process.env.ARBITRUM_SEPOLIA_RPC_URL ||
        'https://sepolia-rollup.arbitrum.io/rpc',
      accounts:
        process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.startsWith('0x')
          ? [process.env.PRIVATE_KEY]
          : undefined,
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
