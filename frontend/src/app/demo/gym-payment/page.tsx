'use client';

import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { GymHeader } from '@/components/demo/GymHeader';
import { GymPlanCard } from '@/components/demo/GymPlanCard';
import { PaymentModal } from '@/components/demo/PaymentModal';
import { PoweredByBadge } from '@/components/demo/PoweredByBadge';
import {
  useSubscriptionManager,
  usePyUSDBalance,
  useAllPlans,
  useUserActiveSubscriptions,
} from '@/hooks/useSubscriptionManager';
import type { NetworkId } from '@/lib/contracts';
import { handleSubscriptionError, isAlreadySubscribedError } from '@/utils/subscriptionErrors';

export default function GymPaymentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const { address } = useAccount();
  const chainId = useChainId();

  // Network validation: Ensure chainId is one of the supported networks
  // If chainId is undefined or not supported, default to localhost for development
  const validChainId = (
    chainId === 31337 || chainId === 421614 || chainId === 42161
      ? chainId
      : 31337
  ) as NetworkId;

  const { approvePyUSD, subscribeMonthly, mintPyUSD, cancelSubscription } =
    useSubscriptionManager(validChainId);
  const { data: balance } = usePyUSDBalance(validChainId, address);
  const { plans, isLoading: isLoadingPlans } = useAllPlans(validChainId);
  
  // Check user's active subscriptions
  const { data: activeSubscriptions, refetch: refetchSubscriptions } = 
    useUserActiveSubscriptions(validChainId, address);

  // Find the Gym Membership plan specifically (Plan ID 5 in demo data)
  // Fallback to first plan if Gym Membership not found
  const recommendedPlan =
    plans.find((plan) => plan.name === 'Gym Membership') || plans[0] || null;
  
  // Check if user has any active subscription
  const hasActiveSubscription = activeSubscriptions && 
    Array.isArray(activeSubscriptions) && 
    activeSubscriptions.length > 0;
  
  // Check if user is subscribed to the recommended plan
  const isSubscribedToThisPlan = hasActiveSubscription && 
    recommendedPlan &&
    activeSubscriptions?.includes(recommendedPlan.planId);

  const handleSelectPlan = () => {
    if (!address) {
      alert('Please connect your wallet first!');
      return;
    }
    if (!recommendedPlan) {
      alert('No subscription plan available. Please try again later.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleMintPyUSD = async () => {
    if (!address) {
      alert('Please connect your wallet first!');
      return;
    }
    try {
      setIsMinting(true);
      // Mint 1000 PyUSD for testing
      const amount = BigInt(1000 * 1e6); // PyUSD has 6 decimals
      await mintPyUSD(address, amount);
      alert(
        'Successfully minted 1000 PyUSD! Please wait a few seconds for the balance to update.'
      );
    } catch (error: unknown) {
      console.error('Mint error:', error);
      const errorMessage =
        (error as Error)?.message || String(error) || 'Unknown error';
      alert(`Failed to mint PyUSD: ${errorMessage}`);
    } finally {
      setIsMinting(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!recommendedPlan || !activeSubscriptions || activeSubscriptions.length === 0) {
      return;
    }

    // Get the first active subscription plan ID
    const activePlanId = activeSubscriptions[0];

    const confirmed = confirm(
      '⚠️ Confirm Cancellation?\n\n' +
      'After cancellation, you will lose your membership benefits.\n' +
      'If you have any unused annual fee deposits, they will be automatically refunded.\n\n' +
      'Are you sure you want to continue?'
    );

    if (!confirmed) return;

    try {
      setIsProcessing(true);
      await cancelSubscription(activePlanId);
      alert('✅ Subscription cancelled successfully!');
      // Refresh subscription data
      refetchSubscriptions();
    } catch (error: unknown) {
      console.error('Cancel subscription error:', error);
      const errorMessage = handleSubscriptionError(error);
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!recommendedPlan) return;

    try {
      setIsProcessing(true);
      const amount = recommendedPlan.monthlyRate;
      const priceInPyUSD = formatUnits(amount, 6);

      // Network mismatch warning
      if (chainId && chainId !== validChainId) {
        alert(
          `⚠️ Network Mismatch Detected!\n\n` +
            `Your wallet is connected to chain ID: ${chainId}\n` +
            `But the app is using chain ID: ${validChainId}\n\n` +
            `Please switch your wallet to the correct network:\n` +
            `• Localhost (31337) for local development\n` +
            `• Arbitrum Sepolia (421614) for testnet\n` +
            `• Arbitrum One (42161) for mainnet`
        );
        setIsProcessing(false);
        return;
      }

      // Check PyUSD balance
      if (!balance || balance < amount) {
        const currentBalance = balance ? formatUnits(balance, 6) : '0';
        alert(
          `❌ Insufficient PyUSD Balance!\n\n` +
            `You need: ${priceInPyUSD} PYUSD\n` +
            `You have: ${currentBalance} PYUSD\n\n` +
            `💡 Click the "Get 1000 Test PyUSD" button above to mint test tokens!`
        );
        setIsProcessing(false);
        return;
      }

      console.log(
        'Subscribe Monthly - Plan ID:',
        recommendedPlan.planId.toString()
      );
      console.log('Plan Name:', recommendedPlan.name);
      console.log('Amount needed:', priceInPyUSD, 'PYUSD');
      console.log('Current balance:', formatUnits(balance, 6), 'PYUSD');

      // First approve PyUSD spending
      console.log('Step 1: Approving PyUSD spending...');
      await approvePyUSD(amount);
      console.log('✅ Approval successful!');

      // Then subscribe using the real planId from contract
      console.log('Step 2: Subscribing to plan...');
      await subscribeMonthly(recommendedPlan.planId, false);
      console.log('✅ Subscription successful!');

      alert('🎉 Subscription successful! Welcome to FitLife Gym!');
      setIsModalOpen(false);
      
      // Refresh subscription data to show updated status
      refetchSubscriptions();
    } catch (error: unknown) {
      console.error('Payment error:', error);

      // Use Strategy Pattern for error handling
      const errorMessage = handleSubscriptionError(error);
      alert(errorMessage);
      
      // If it's an "Already subscribed" error, refresh subscription data
      if (isAlreadySubscribedError(error)) {
        refetchSubscriptions();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GymHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              Start Your Fitness Journey
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Choose the membership plan that fits you best and start training
              today. All plans include professional coaching and
              state-of-the-art equipment.
            </p>

            {/* PyUSD Balance Card - Only show when wallet is connected */}
            {address && (
              <div className="mb-8 inline-block">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-left">
                      <p className="text-sm text-orange-100 mb-1">
                        Your Test PyUSD Balance
                      </p>
                      <p className="text-3xl font-bold">
                        {balance ? (Number(balance) / 1e6).toFixed(2) : '0.00'}{' '}
                        PYUSD
                      </p>
                    </div>
                    <button
                      onClick={handleMintPyUSD}
                      disabled={isMinting}
                      className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isMinting ? 'Minting...' : '🪙 Get 1000 Test PyUSD'}
                    </button>
                  </div>
                  <p className="text-xs text-orange-100 mt-3 text-center">
                    💡 Need PyUSD for testing? Click the button to mint 1000
                    test tokens!
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏋️</span>
                <span>Professional Equipment</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">👨‍🏫</span>
                <span>Expert Trainers</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span>Personalized Training</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Plan Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Recommended Membership Plan
            </h3>
            <p className="text-gray-600">
              Secure payment with PyUSD • Start your fitness journey today
            </p>
          </div>

          {/* Loading State */}
          {isLoadingPlans && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              <p className="mt-4 text-gray-600">Loading plan...</p>
            </div>
          )}

          {/* No Plan Available */}
          {!isLoadingPlans && !recommendedPlan && (
            <div className="text-center py-12 bg-gray-100 rounded-xl">
              <p className="text-gray-600 text-lg">
                No subscription plan available at the moment. Please try again
                later.
              </p>
            </div>
          )}

          {/* Recommended Plan Card */}
          {!isLoadingPlans && recommendedPlan && (
            <div className="max-w-md mx-auto">
              {hasActiveSubscription && !isSubscribedToThisPlan && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm text-center">
                    ⚠️ You already have an active subscription. To switch plans, please cancel your current subscription first.
                  </p>
                </div>
              )}
              
              <GymPlanCard
                name={recommendedPlan.name}
                price={formatUnits(recommendedPlan.monthlyRate, 6)}
                period="month"
                features={[
                  'Unlimited gym access',
                  'Professional equipment training',
                  'Group fitness classes',
                  'Personal training sessions',
                  'Shower & locker facilities',
                  '24/7 access',
                  'Free WiFi & parking',
                ]}
                isPopular={true}
                onSelect={handleSelectPlan}
                isLoading={isProcessing}
                isSubscribed={isSubscribedToThisPlan}
                onCancel={handleCancelSubscription}
              />
            </div>
          )}
        </div>
      </section>

      {/* Payment Modal */}
      {recommendedPlan && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          planName={recommendedPlan.name}
          planPrice={formatUnits(recommendedPlan.monthlyRate, 6)}
          onConfirm={handleConfirmPayment}
          isProcessing={isProcessing}
          balance={balance}
        />
      )}

      {/* Powered By Badge */}
      <PoweredByBadge />
    </div>
  );
}
