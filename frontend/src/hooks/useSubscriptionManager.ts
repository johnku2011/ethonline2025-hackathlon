import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import {
  SUBSCRIPTION_MANAGER_ABI,
  PYUSD_ABI,
  getContractAddress,
  type NetworkId,
} from '@/lib/contracts';

export function useSubscriptionManager(chainId: NetworkId) {
  const subscriptionManagerAddress = getContractAddress(chainId, 'subscriptionManager');
  const pyusdAddress = getContractAddress(chainId, 'pyusd');

  // Write operations
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Approve PyUSD spending
  const approvePyUSD = async (amount: bigint) => {
    return writeContract({
      address: pyusdAddress,
      abi: PYUSD_ABI,
      functionName: 'approve',
      args: [subscriptionManagerAddress, amount],
    });
  };

  // Subscribe to monthly plan
  const subscribeMonthly = async (
    planId: bigint,
    enableAutoPay: boolean,
    stakeYearlyAmount: boolean
  ) => {
    return writeContract({
      address: subscriptionManagerAddress,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'subscribeMonthly',
      args: [planId, enableAutoPay, stakeYearlyAmount],
    });
  };

  // Subscribe to yearly plan
  const subscribeYearly = async (planId: bigint) => {
    return writeContract({
      address: subscriptionManagerAddress,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'subscribeYearly',
      args: [planId],
    });
  };

  // Cancel subscription
  const cancelSubscription = async (planId: bigint) => {
    return writeContract({
      address: subscriptionManagerAddress,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'cancelSubscription',
      args: [planId],
    });
  };

  // Withdraw yield
  const withdrawYield = async (planId: bigint) => {
    return writeContract({
      address: subscriptionManagerAddress,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'withdrawYield',
      args: [planId],
    });
  };

  return {
    approvePyUSD,
    subscribeMonthly,
    subscribeYearly,
    cancelSubscription,
    withdrawYield,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

// Read subscription details
export function useSubscription(
  chainId: NetworkId,
  userAddress?: `0x${string}`,
  planId?: bigint
) {
  const subscriptionManagerAddress = getContractAddress(chainId, 'subscriptionManager');

  return useReadContract({
    address: subscriptionManagerAddress,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'getSubscription',
    args: userAddress && planId ? [userAddress, planId] : undefined,
    query: {
      enabled: !!userAddress && planId !== undefined,
    },
  });
}

// Read user's active subscriptions
export function useUserActiveSubscriptions(
  chainId: NetworkId,
  userAddress?: `0x${string}`
) {
  const subscriptionManagerAddress = getContractAddress(chainId, 'subscriptionManager');

  return useReadContract({
    address: subscriptionManagerAddress,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'getUserActiveSubscriptions',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });
}

// Read subscription plan details
export function useSubscriptionPlan(chainId: NetworkId, planId?: bigint) {
  const subscriptionManagerAddress = getContractAddress(chainId, 'subscriptionManager');

  return useReadContract({
    address: subscriptionManagerAddress,
    abi: SUBSCRIPTION_MANAGER_ABI,
    functionName: 'subscriptionPlans',
    args: planId !== undefined ? [planId] : undefined,
    query: {
      enabled: planId !== undefined,
    },
  });
}

