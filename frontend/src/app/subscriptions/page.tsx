'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { UserSubscriptions } from '@/components/subscription/UserSubscriptions';
import { useSubscriptionManager, useSubscriptionPlan } from '@/hooks/useSubscriptionManager';

// Mock plans for demo - in production, these would be fetched from the contract
const DEMO_PLANS = [
  { id: 1n, monthlyRate: parseUnits('9.99', 6), yearlyRate: parseUnits('99', 6), name: 'Basic Plan' },
  { id: 2n, monthlyRate: parseUnits('29.99', 6), yearlyRate: parseUnits('299', 6), name: 'Pro Plan' },
  { id: 3n, monthlyRate: parseUnits('99.99', 6), yearlyRate: parseUnits('999', 6), name: 'Enterprise Plan' },
];

export default function SubscriptionsPage() {
  const { address, chainId } = useAccount();
  const [selectedPlanType, setSelectedPlanType] = useState<'monthly' | 'yearly'>('monthly');
  const [enableAutoPay, setEnableAutoPay] = useState(true);
  const [stakeYearly, setStakeYearly] = useState(false);

  const validChainId = (chainId === 421614 || chainId === 42161 ? chainId : 421614) as 421614 | 42161;
  const { subscribeMonthly, subscribeYearly, approvePyUSD, isPending } = useSubscriptionManager(validChainId);

  const handleSubscribeMonthly = async (planId: bigint, amount: bigint) => {
    try {
      // First approve PyUSD spending
      await approvePyUSD(amount);
      // Then subscribe
      await subscribeMonthly(planId, enableAutoPay, stakeYearly);
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  const handleSubscribeYearly = async (planId: bigint, amount: bigint) => {
    try {
      // First approve PyUSD spending
      await approvePyUSD(amount);
      // Then subscribe
      await subscribeYearly(planId);
    } catch (error) {
      console.error('Subscription error:', error);
    }
  };

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Subscription Plans</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect your wallet to view and subscribe to plans
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Subscription Plans</h1>
          <p className="text-lg text-gray-600">
            Choose a plan that works for you. Pay with PyUSD and earn yield on staked funds.
          </p>
        </div>

        {/* Subscription Options */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Subscription Options</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableAutoPay}
                onChange={(e) => setEnableAutoPay(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <span className="font-medium">Enable Auto-Pay</span>
                <p className="text-sm text-gray-600">
                  Automatically process monthly payments
                </p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={stakeYearly}
                onChange={(e) => setStakeYearly(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <div>
                <span className="font-medium">Stake Year Upfront (Monthly Plans)</span>
                <p className="text-sm text-gray-600">
                  Pay for the full year and earn yield on staked funds
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Available Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_PLANS.map((plan) => (
              <SubscriptionCard
                key={plan.id.toString()}
                planId={plan.id}
                planName={plan.name}
                monthlyRate={plan.monthlyRate}
                yearlyRate={plan.yearlyRate}
                isActive={true}
                onSubscribeMonthly={() => handleSubscribeMonthly(plan.id, stakeYearly ? plan.yearlyRate : plan.monthlyRate)}
                onSubscribeYearly={() => handleSubscribeYearly(plan.id, plan.yearlyRate)}
                isPending={isPending}
              />
            ))}
          </div>
        </div>

        {/* User's Active Subscriptions */}
        <div>
          <UserSubscriptions />
        </div>
      </div>
    </div>
  );
}

