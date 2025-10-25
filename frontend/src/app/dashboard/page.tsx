'use client';

import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { UserSubscriptions } from '@/components/subscription/UserSubscriptions';
import { useUserActiveSubscriptions } from '@/hooks/useSubscriptionManager';
import { getContractAddress, PYUSD_ABI } from '@/lib/contracts';

export default function DashboardPage() {
  const { address, chainId } = useAccount();

  const validChainId = (
    chainId === 31337 || chainId === 421614 || chainId === 42161
      ? chainId
      : 31337
  ) as 31337 | 421614 | 42161;

  const pyusdAddress = getContractAddress(validChainId, 'pyusd');

  // Read PyUSD balance
  const { data: pyusdBalance } = useReadContract({
    address: pyusdAddress,
    abi: PYUSD_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read active subscriptions for stats
  const { data: activeSubscriptions } = useUserActiveSubscriptions(
    validChainId,
    address
  );

  if (!address) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect your wallet to view your dashboard
          </p>
        </div>
      </div>
    );
  }

  const addressShort = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const formattedBalance = pyusdBalance ? formatUnits(pyusdBalance, 6) : '0.00';
  const activeCount = activeSubscriptions?.length || 0;

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-lg text-gray-600">{addressShort}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* PyUSD Balance */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="text-sm font-medium text-blue-600 mb-1">
              PyUSD Balance
            </div>
            <div className="text-3xl font-bold text-blue-900">
              ${formattedBalance}
            </div>
            <div className="text-xs text-blue-600 mt-1">Available to spend</div>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="text-sm font-medium text-green-600 mb-1">
              Active Subscriptions
            </div>
            <div className="text-3xl font-bold text-green-900">
              {activeCount}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {activeCount === 1 ? 'subscription' : 'subscriptions'}
            </div>
          </div>

          {/* Network Status */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="text-sm font-medium text-purple-600 mb-1">
              Network
            </div>
            <div className="text-3xl font-bold text-purple-900">
              {validChainId === 31337
                ? 'Localhost'
                : validChainId === 421614
                  ? 'Arbitrum Sepolia'
                  : 'Arbitrum One'}
            </div>
            <div className="text-xs text-purple-600 mt-1">Connected</div>
          </div>
        </div>

        {/* User Subscriptions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <UserSubscriptions />
        </div>
      </div>
    </div>
  );
}
