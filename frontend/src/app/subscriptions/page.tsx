'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { UserSubscriptions } from '@/components/subscription/UserSubscriptions';
import {
  useSubscriptionManager,
  useAllPlans,
  usePyUSDBalance,
} from '@/hooks/useSubscriptionManager';

export default function SubscriptionsPage() {
  const { address, chainId } = useAccount();
  // Note: enableAutoPay is now default true in Lab version, removed UI control
  const [stakeYearly, setStakeYearly] = useState(false);

  const validChainId = (
    chainId === 31337 || chainId === 421614 || chainId === 42161
      ? chainId
      : 31337
  ) as 31337 | 421614 | 42161;

  const { subscribeMonthly, subscribeYearly, approvePyUSD, mintPyUSD, isPending } =
    useSubscriptionManager(validChainId);

  const { plans, isLoading: isLoadingPlans } = useAllPlans(validChainId);
  const { data: balance } = usePyUSDBalance(validChainId, address);

  const handleSubscribeMonthly = async (planId: bigint, amount: bigint) => {
    try {
      // Check balance before subscribing
      if (!balance || balance < amount) {
        alert('Insufficient PyUSD balance. Please mint PyUSD first.');
        return;
      }

      // First approve PyUSD spending
      await approvePyUSD(amount);
      // Then subscribe (auto-pay is default enabled)
      await subscribeMonthly(planId, stakeYearly);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription failed. Please try again.');
    }
  };

  const handleSubscribeYearly = async (planId: bigint, amount: bigint) => {
    try {
      // Check balance before subscribing
      if (!balance || balance < amount) {
        alert('Insufficient PyUSD balance. Please mint PyUSD first.');
        return;
      }

      // First approve PyUSD spending
      await approvePyUSD(amount);
      // Then subscribe
      await subscribeYearly(planId);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Subscription failed. Please try again.');
    }
  };

  const handleMintPyUSD = async () => {
    if (!address) return;
    try {
      // Mint 1000 PyUSD for testing
      const amount = parseUnits('1000', 6); // PyUSD has 6 decimals
      await mintPyUSD(address, amount);
    } catch (error) {
      console.error('Mint error:', error);
    }
  };

  const formattedBalance = balance ? formatUnits(balance, 6) : '0';

  if (!address) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Plans
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect your wallet to view and subscribe to plans
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Plans
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Choose a plan that works for you. Pay with PyUSD and earn yield on
            staked funds.
          </p>

          {/* PyUSD Balance and Mint */}
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex-1">
              <p className="text-sm text-blue-600 font-medium">Your PyUSD Balance</p>
              <p className="text-2xl font-bold text-blue-900">{formattedBalance} PYUSD</p>
            </div>
            <button
              onClick={handleMintPyUSD}
              disabled={isPending}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Processing...' : 'Get 1000 PyUSD'}
            </button>
          </div>
        </div>

        {/* Subscription Options */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Subscription Options</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <span className="font-medium">Auto-Pay Enabled</span>
                <p className="text-sm text-gray-600">
                  Monthly payments are automatically processed (default)
                </p>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={stakeYearly}
                onChange={(e) => setStakeYearly(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <span className="font-medium">
                  Stake Year Upfront (Monthly Plans)
                </span>
                <p className="text-sm text-gray-600">
                  Pay for the full year and earn yield on staked funds
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Available Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Plans
          </h2>
          {isLoadingPlans ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                No subscription plans available yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <SubscriptionCard
                  key={plan.planId.toString()}
                  planId={plan.planId}
                  planName={plan.name}
                  monthlyRate={plan.monthlyRate}
                  yearlyRate={plan.yearlyRate}
                  isActive={plan.isActive}
                  onSubscribeMonthly={() =>
                    handleSubscribeMonthly(
                      plan.planId,
                      stakeYearly ? plan.yearlyRate : plan.monthlyRate
                    )
                  }
                  onSubscribeYearly={() =>
                    handleSubscribeYearly(plan.planId, plan.yearlyRate)
                  }
                  isPending={isPending}
                />
              ))}
            </div>
          )}
        </div>

        {/* User's Active Subscriptions */}
        <div>
          <UserSubscriptions />
        </div>
      </div>
    </div>
  );
}
