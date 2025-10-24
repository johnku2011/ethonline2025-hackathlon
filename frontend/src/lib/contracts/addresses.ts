// Contract addresses per network
export const CONTRACT_ADDRESSES = {
  // Localhost (Hardhat Node)
  31337: {
    subscriptionManager: '0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6',
    pyusd: '0x0165878a594ca255338adfa4d48449f69242eb8f',
    morphoVault: '0xa513e6e4b8f2a923d98304ec87f64353c4d5c853',
  },
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
