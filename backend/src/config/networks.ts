/**
 * Network Configuration using Strategy Pattern
 * Allows switching between localhost, testnet, and mainnet environments
 */

export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  chainId: number;
  isTestnet: boolean;
}

export type NetworkType = 'localhost' | 'arbitrumSepolia' | 'arbitrumOne';

const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  localhost: {
    name: 'Localhost (Hardhat)',
    rpcUrl: 'http://127.0.0.1:8545',
    chainId: 31337,
    isTestnet: true,
  },
  arbitrumSepolia: {
    name: 'Arbitrum Sepolia Testnet',
    rpcUrl:
      process.env.ARBITRUM_SEPOLIA_RPC_URL ||
      'https://sepolia-rollup.arbitrum.io/rpc',
    chainId: 421614,
    isTestnet: true,
  },
  arbitrumOne: {
    name: 'Arbitrum One Mainnet',
    rpcUrl:
      process.env.ARBITRUM_ONE_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    chainId: 42161,
    isTestnet: false,
  },
};

/**
 * Get network configuration based on environment variable
 * @returns NetworkConfig for the selected network
 */
export function getNetworkConfig(): NetworkConfig {
  const networkType = (process.env.NETWORK || 'arbitrumSepolia') as NetworkType;

  const config = NETWORK_CONFIGS[networkType];

  if (!config) {
    throw new Error(
      `Invalid NETWORK environment variable: ${networkType}. Must be one of: localhost, arbitrumSepolia, arbitrumOne`
    );
  }

  // Allow RPC_URL override for any network
  if (process.env.RPC_URL) {
    return {
      ...config,
      rpcUrl: process.env.RPC_URL,
    };
  }

  return config;
}

