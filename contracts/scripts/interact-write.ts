/**
 * Contract write functions for CLI tool
 * Part 3 of 4 - Write operations
 */

import { parseUnits, Address, Hash } from 'viem';
import {
  getWalletClient,
  waitForTransaction,
  ADDRESSES,
  SUBSCRIPTION_MANAGER_ABI,
  ERC20_ABI,
  PYUSD_DECIMALS,
} from './interact-config.js';

// ============================================
// CONTRACT WRITE FUNCTIONS
// ============================================

export async function mintTokens(to: Address, amount: string): Promise<Hash> {
  const walletClient = getWalletClient();
  const amountWei = parseUnits(amount, PYUSD_DECIMALS);

  const hash = await walletClient.writeContract({
    address: ADDRESSES.mockToken,
    abi: ERC20_ABI,
    functionName: 'mint',
    args: [to, amountWei],
  });

  await waitForTransaction(hash, `Minting ${amount} PYUSD to ${to}`);
  return hash;
}

export async function approveTokens(amount: string): Promise<Hash> {
  const walletClient = getWalletClient();
  const amountWei = parseUnits(amount, PYUSD_DECIMALS);

  const hash = await walletClient.writeContract({
    address: ADDRESSES.mockToken,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [ADDRESSES.subscriptionManager, amountWei],
  });

  await waitForTransaction(
    hash,
    `Approving ${amount} PYUSD for SubscriptionManager`
  );
  return hash;
}

export async function createPlan(
  monthlyRate: string,
  yearlyRate: string,
  name: string
): Promise<Hash> {
  const walletClient = getWalletClient();
  const monthlyWei = parseUnits(monthlyRate, PYUSD_DECIMALS);
  const yearlyWei = parseUnits(yearlyRate, PYUSD_DECIMALS);

  const hash = await walletClient.writeContract({
    address: ADDRESSES.subscriptionManager,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'createSubscriptionPlan',
    args: [monthlyWei, yearlyWei, name],
  });

  await waitForTransaction(hash, `Creating plan "${name}"`);
  return hash;
}

export async function subscribeMonthly(
  planId: bigint,
  stakeYearly: boolean = true
): Promise<Hash> {
  const walletClient = getWalletClient();

  const hash = await walletClient.writeContract({
    address: ADDRESSES.subscriptionManager,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'subscribeMonthly',
    args: [planId, stakeYearly],
  });

  await waitForTransaction(hash, `Subscribing to monthly plan ${planId}`);
  return hash;
}

export async function subscribeYearly(planId: bigint): Promise<Hash> {
  const walletClient = getWalletClient();

  const hash = await walletClient.writeContract({
    address: ADDRESSES.subscriptionManager,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'subscribeYearly',
    args: [planId],
  });

  await waitForTransaction(hash, `Subscribing to yearly plan ${planId}`);
  return hash;
}

export async function cancelSubscription(planId: bigint): Promise<Hash> {
  const walletClient = getWalletClient();

  const hash = await walletClient.writeContract({
    address: ADDRESSES.subscriptionManager,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'cancelSubscription',
    args: [planId],
  });

  await waitForTransaction(hash, `Cancelling subscription ${planId}`);
  return hash;
}
