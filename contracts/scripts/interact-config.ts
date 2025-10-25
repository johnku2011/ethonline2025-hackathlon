/**
 * Configuration for interact CLI tool
 * This file contains contract addresses and basic setup
 * Part 1 of 2 - Config and helpers
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  Address,
  Hash,
} from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

// ERC20 ABI for token operations
export const ERC20_ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function mint(address to, uint256 amount)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
]);

// Load SubscriptionManager ABI from compiled artifacts
export function loadSubscriptionManagerABI() {
  try {
    const artifactPath = join(
      __dirname,
      '../artifacts/contracts/SubscriptionManager.sol/SubscriptionManager.json'
    );
    const artifact = JSON.parse(readFileSync(artifactPath, 'utf-8'));
    return artifact.abi;
  } catch (error) {
    console.error(
      '❌ Failed to load SubscriptionManager ABI. Please compile contracts first:'
    );
    console.error('   cd contracts && npx hardhat compile\n');
    process.exit(1);
  }
}

export const SUBSCRIPTION_MANAGER_ABI = loadSubscriptionManagerABI();

// Configuration
export const CHAIN = arbitrumSepolia;
export const RPC_URL =
  process.env.ARBITRUM_SEPOLIA_RPC_URL ||
  'https://sepolia-rollup.arbitrum.io/rpc';
export const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;

// Contract addresses (will be updated after deployment)
export const ADDRESSES = {
  subscriptionManager: process.env.SUBSCRIPTION_MANAGER_ADDRESS as Address,
  mockToken: process.env.MOCK_PYUSD_ADDRESS as Address,
  mockVault: process.env.MOCK_VAULT_ADDRESS as Address,
};

// Constants
export const PYUSD_DECIMALS = 6;

// Create public client
export const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(RPC_URL),
});

// Create wallet client
export const getWalletClient = () => {
  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY not found in environment variables');
  }
  const account = privateKeyToAccount(PRIVATE_KEY);
  return createWalletClient({
    account,
    chain: CHAIN,
    transport: http(RPC_URL),
  });
};

// Helper: wait for transaction
export async function waitForTransaction(hash: Hash, description: string) {
  console.log(`⏳ ${description}...`);
  console.log(`   Transaction: ${hash}`);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(`✅ Confirmed in block ${receipt.blockNumber}`);
  return receipt;
}

// Helper: serialize BigInt for JSON output
export function serializeBigInt(value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(serializeBigInt);
  }
  if (value !== null && typeof value === 'object') {
    const serialized: any = {};
    for (const key in value) {
      serialized[key] = serializeBigInt(value[key]);
    }
    return serialized;
  }
  return value;
}
