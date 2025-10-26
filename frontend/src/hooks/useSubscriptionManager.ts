import {
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
  useConfig,
} from 'wagmi';
import { simulateContract } from '@wagmi/core';
import { useMemo } from 'react';
import {
  SUBSCRIPTION_MANAGER_ABI,
  PYUSD_ABI,
  getContractAddress,
  type NetworkId,
} from '@/lib/contracts';

export function useSubscriptionManager(chainId: NetworkId) {
  const subscriptionManagerAddress = getContractAddress(
    chainId,
    'subscriptionManager'
  );
  const pyusdAddress = getContractAddress(chainId, 'pyusd');
  const config = useConfig();

  // Write operations
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Approve PyUSD spending with simulation
  const approvePyUSD = async (amount: bigint) => {
    // First simulate to validate and get proper gas estimation
    const { request } = await simulateContract(config, {
      address: pyusdAddress,
      abi: PYUSD_ABI,
      functionName: 'approve',
      args: [subscriptionManagerAddress, amount],
      chainId,
    });

    // Then execute with the simulated request
    return writeContract(request);
  };

  // Subscribe to monthly plan with simulation
  // Note: Auto-pay is now enabled by default in the Lab version contract
  const subscribeMonthly = async (
    planId: bigint,
    stakeYearlyAmount: boolean
  ) => {
    // First simulate to validate and get proper gas estimation
    const { request } = await simulateContract(config, {
      address: subscriptionManagerAddress,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'subscribeMonthly',
      args: [planId, stakeYearlyAmount],
      chainId,
    });

    // Then execute with the simulated request
    return writeContract(request);
  };

  // Subscribe to yearly plan with simulation
  const subscribeYearly = async (planId: bigint) => {
    // First simulate to validate and get proper gas estimation
    const { request } = await simulateContract(config, {
      address: subscriptionManagerAddress,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'subscribeYearly',
      args: [planId],
      chainId,
    });

    // Then execute with the simulated request
    return writeContract(request);
  };

  // Cancel subscription with simulation
  const cancelSubscription = async (planId: bigint) => {
    // First simulate to validate and get proper gas estimation
    const { request } = await simulateContract(config, {
      address: subscriptionManagerAddress,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'cancelSubscription',
      args: [planId],
      chainId,
    });

    // Then execute with the simulated request
    return writeContract(request);
  };

  // Mint PyUSD for testing with simulation
  const mintPyUSD = async (to: `0x${string}`, amount: bigint) => {
    // First simulate to validate and get proper gas estimation
    const { request } = await simulateContract(config, {
      address: pyusdAddress,
      abi: PYUSD_ABI,
      functionName: 'mint',
      args: [to, amount],
      chainId,
    });

    // Then execute with the simulated request
    return writeContract(request);
  };

  // Note: withdrawYield removed in Lab version - yield is automatically returned on cancellation

  return {
    approvePyUSD,
    subscribeMonthly,
    subscribeYearly,
    cancelSubscription,
    mintPyUSD,
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
  const subscriptionManagerAddress = getContractAddress(
    chainId,
    'subscriptionManager'
  );

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
  const subscriptionManagerAddress = getContractAddress(
    chainId,
    'subscriptionManager'
  );

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
  const subscriptionManagerAddress = getContractAddress(
    chainId,
    'subscriptionManager'
  );

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

// Subscription plan type
export interface SubscriptionPlan {
  planId: bigint;
  monthlyRate: bigint;
  yearlyRate: bigint;
  isActive: boolean;
  name: string;
}

// Read all active subscription plans
export function useAllPlans(chainId: NetworkId) {
  const subscriptionManagerAddress = getContractAddress(
    chainId,
    'subscriptionManager'
  );

  // Batch query planId 1-10
  const { data, isLoading, error } = useReadContracts({
    contracts: Array.from({ length: 10 }, (_, i) => ({
      address: subscriptionManagerAddress,
      abi: SUBSCRIPTION_MANAGER_ABI,
      functionName: 'subscriptionPlans',
      args: [BigInt(i + 1)],
    })),
    query: {
      // Allow individual queries to fail without breaking the whole request
      // This handles cases where some planIds don't exist yet
      select: (data) => data,
    },
  });

  // Filter and format active plans
  const plans = useMemo(() => {
    if (!data) return [];

    return data
      .map((result, index) => {
        if (result.status !== 'success' || !result.result) return null;

        // @ts-expect-error - Type assertion for the tuple result from contract
        const [monthlyRate, yearlyRate, isActive, name] = result.result as readonly [
          bigint,
          bigint,
          boolean,
          string
        ];

        return {
          planId: BigInt(index + 1),
          monthlyRate,
          yearlyRate,
          isActive,
          name,
        } as SubscriptionPlan;
      })
      .filter(
        (plan): plan is SubscriptionPlan => plan !== null && plan.isActive
      );
  }, [data]);

  return {
    plans,
    isLoading,
    error,
  };
}

// Read PyUSD balance
export function usePyUSDBalance(
  chainId: NetworkId,
  userAddress?: `0x${string}`
) {
  const pyusdAddress = getContractAddress(chainId, 'pyusd');

  return useReadContract({
    address: pyusdAddress,
    abi: PYUSD_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });
}

// Read PyUSD allowance
export function usePyUSDAllowance(
  chainId: NetworkId,
  userAddress?: `0x${string}`
) {
  const pyusdAddress = getContractAddress(chainId, 'pyusd');
  const subscriptionManagerAddress = getContractAddress(
    chainId,
    'subscriptionManager'
  );

  return useReadContract({
    address: pyusdAddress,
    abi: PYUSD_ABI,
    functionName: 'allowance',
    args: userAddress ? [userAddress, subscriptionManagerAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });
}
