'use client';

import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { Button } from '@/components/ui/Button';
import {
  useUserActiveSubscriptions,
  useSubscription,
  useSubscriptionPlan,
  useSubscriptionManager,
} from '@/hooks/useSubscriptionManager';

interface SubscriptionItemProps {
  planId: bigint;
  chainId: 31337 | 421614 | 42161;
  userAddress: `0x${string}`;
}

function SubscriptionItem({
  planId,
  chainId,
  userAddress,
}: SubscriptionItemProps) {
  const { data: subscription } = useSubscription(chainId, userAddress, planId);
  const { data: plan } = useSubscriptionPlan(chainId, planId);
  const { cancelSubscription, withdrawYield, isPending } =
    useSubscriptionManager(chainId);

  if (!subscription || !plan) return null;

  const [monthlyRate, yearlyRate, isActive, name] = plan;
  const [
    subType,
    status,
    ,
    ,
    startTime,
    ,
    expirationTime,
    ,
    stakedAmount,
    morphoShares,
  ] = subscription;

  const isMonthly = subType === 0;
  const isActiveStatus = status === 1;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">
            {isMonthly ? 'Monthly' : 'Yearly'} Subscription
          </p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            isActiveStatus
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-50 text-gray-700'
          }`}
        >
          {isActiveStatus ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Price:</span>
          <span className="font-medium">
            {formatUnits(isMonthly ? monthlyRate : yearlyRate, 6)} PYUSD
          </span>
        </div>
        {stakedAmount > 0n && (
          <div className="flex justify-between">
            <span className="text-gray-500">Staked:</span>
            <span className="font-medium">
              {formatUnits(stakedAmount, 6)} PYUSD
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Expires:</span>
          <span className="font-medium">
            {new Date(Number(expirationTime) * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {morphoShares > 0n && (
          <Button
            onClick={() => withdrawYield(planId)}
            disabled={isPending}
            className="flex-1"
            variant="secondary"
          >
            Withdraw Yield
          </Button>
        )}
        <Button
          onClick={() => cancelSubscription(planId)}
          disabled={!isActiveStatus || isPending}
          className="flex-1"
          variant="destructive"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function UserSubscriptions() {
  const { address, chainId } = useAccount();
  const validChainId = (
    chainId === 31337 || chainId === 421614 || chainId === 42161
      ? chainId
      : 31337
  ) as 31337 | 421614 | 42161;

  const { data: activeSubscriptions, isLoading } = useUserActiveSubscriptions(
    validChainId,
    address
  );

  if (!address) {
    return (
      <div className="text-center py-8 text-gray-500">
        Connect your wallet to view subscriptions
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading subscriptions...
      </div>
    );
  }

  if (!activeSubscriptions || activeSubscriptions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        You don't have any active subscriptions yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Your Subscriptions
      </h3>
      {activeSubscriptions.map((planId) => (
        <SubscriptionItem
          key={planId.toString()}
          planId={planId}
          chainId={validChainId}
          userAddress={address}
        />
      ))}
    </div>
  );
}
