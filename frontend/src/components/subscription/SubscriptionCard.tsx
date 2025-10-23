'use client';

import { formatUnits } from 'viem';
import { Button } from '@/components/ui/Button';

interface SubscriptionCardProps {
  planId: bigint;
  planName: string;
  monthlyRate: bigint;
  yearlyRate: bigint;
  isActive: boolean;
  onSubscribeMonthly: () => void;
  onSubscribeYearly: () => void;
  isPending?: boolean;
}

export function SubscriptionCard({
  planId,
  planName,
  monthlyRate,
  yearlyRate,
  isActive,
  onSubscribeMonthly,
  onSubscribeYearly,
  isPending,
}: SubscriptionCardProps) {
  const monthlyPriceFormatted = formatUnits(monthlyRate, 6);
  const yearlyPriceFormatted = formatUnits(yearlyRate, 6);
  const monthlySavings =
    ((Number(monthlyRate) * 12 - Number(yearlyRate)) / (Number(monthlyRate) * 12)) * 100;

  return (
    <div className="rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{planName}</h3>
        {!isActive && (
          <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 rounded">
            Inactive
          </span>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {monthlyPriceFormatted} <span className="text-sm font-normal">PYUSD</span>
            </p>
            <p className="text-sm text-gray-500">per month</p>
          </div>
          <Button
            onClick={onSubscribeMonthly}
            disabled={!isActive || isPending}
            className="px-4 py-2"
          >
            {isPending ? 'Processing...' : 'Subscribe'}
          </Button>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {yearlyPriceFormatted} <span className="text-sm font-normal">PYUSD</span>
              </p>
              <p className="text-sm text-gray-500">per year</p>
              {monthlySavings > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Save {monthlySavings.toFixed(1)}%
                </p>
              )}
            </div>
            <Button
              onClick={onSubscribeYearly}
              disabled={!isActive || isPending}
              className="px-4 py-2"
              variant="secondary"
            >
              {isPending ? 'Processing...' : 'Subscribe Yearly'}
            </Button>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <p>✓ Automatic payments with PyUSD</p>
        <p>✓ Earn yield on staked funds</p>
        <p>✓ Cancel anytime with pro-rata refunds</p>
      </div>
    </div>
  );
}

