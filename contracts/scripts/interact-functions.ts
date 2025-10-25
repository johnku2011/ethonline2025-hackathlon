/**
 * Contract interaction functions for CLI tool
 * Part 2 of 2 - Core functions
 */

import { formatUnits, parseUnits, Address, Hash } from 'viem';
import {
  publicClient,
  getWalletClient,
  waitForTransaction,
  ADDRESSES,
  SUBSCRIPTION_MANAGER_ABI,
  ERC20_ABI,
  PYUSD_DECIMALS,
} from './interact-config.js';

// ============================================
// CONTRACT READ FUNCTIONS
// ============================================

export async function getTokenBalance(address: Address): Promise<string> {
  const balance = await publicClient.readContract({
    address: ADDRESSES.mockToken,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  });
  return formatUnits(balance, PYUSD_DECIMALS);
}

export async function getSubscriptionPlan(planId: bigint) {
  const plan = (await publicClient.readContract({
    address: ADDRESSES.subscriptionManager,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'subscriptionPlans',
    args: [planId],
  })) as [bigint, bigint, boolean, string];

  return {
    monthlyRate: formatUnits(plan[0], PYUSD_DECIMALS),
    yearlyRate: formatUnits(plan[1], PYUSD_DECIMALS),
    isActive: plan[2],
    name: plan[3],
  };
}

export async function getUserSubscription(user: Address, planId: bigint) {
  const sub = await publicClient.readContract({
    address: ADDRESSES.subscriptionManager,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'getSubscription',
    args: [user, planId],
  });

  return {
    status: sub.status,
    type: sub.subType,
    expirationTime: sub.expirationTime,
    monthlyRate: sub.monthlyRate,
    yearlyRate: sub.yearlyRate,
    lastPayment: sub.lastPayment,
    stakedAmount: sub.stakedAmount,
    morphoShares: sub.morphoShares,
    autoPayEnabled: sub.autoPayEnabled,
  };
}

export async function getActiveSubscriptions(user: Address): Promise<bigint[]> {
  const planIds = (await publicClient.readContract({
    address: ADDRESSES.subscriptionManager,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'getUserActiveSubscriptions',
    args: [user],
  })) as bigint[];

  return planIds;
}

export async function getContractInfo() {
  const [backend, owner, paused] = await Promise.all([
    publicClient.readContract({
      address: ADDRESSES.subscriptionManager,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'backend',
    }),
    publicClient.readContract({
      address: ADDRESSES.subscriptionManager,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'owner',
    }),
    publicClient.readContract({
      address: ADDRESSES.subscriptionManager,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'paused',
    }),
  ]);

  return { backend, owner, paused };
}
