// Contract addresses per network
export const CONTRACT_ADDRESSES = {
  // Arbitrum Sepolia Testnet
  421614: {
    subscriptionManager: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    pyusd: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    morphoVault: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
  },
  // Arbitrum One Mainnet
  42161: {
    subscriptionManager: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    pyusd: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
    morphoVault: '0x0000000000000000000000000000000000000000', // TODO: Update after deployment
  },
} as const;

export type NetworkId = keyof typeof CONTRACT_ADDRESSES;

export function getContractAddress(
  networkId: NetworkId,
  contract: keyof (typeof CONTRACT_ADDRESSES)[NetworkId]
): `0x${string}` {
  return CONTRACT_ADDRESSES[networkId][contract] as `0x${string}`;
}

