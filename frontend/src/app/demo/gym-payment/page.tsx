'use client';

import { useState } from 'react';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { parseUnits } from 'viem';
import { GymHeader } from '@/components/demo/GymHeader';
import { GymPlanCard } from '@/components/demo/GymPlanCard';
import { PaymentModal } from '@/components/demo/PaymentModal';
import { PoweredByBadge } from '@/components/demo/PoweredByBadge';
import { useSubscriptionManager, usePyUSDBalance } from '@/hooks/useSubscriptionManager';
import type { NetworkId } from '@/lib/contracts';

// Define membership plans
const GYM_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '29',
    period: 'month',
    features: [
      'Unlimited gym access',
      'Basic equipment training',
      'Shower facilities',
      'Mon-Fri 6AM-10PM',
      'Free WiFi',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '49',
    period: 'month',
    features: [
      'All Basic features',
      'Group classes (Yoga, Spin, Cardio)',
      '2 personal training sessions/month',
      '24/7 access',
      'Free parking',
      'Protein shake discounts',
    ],
    isPopular: true,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: '99',
    period: 'month',
    features: [
      'All Premium features',
      'Unlimited personal training',
      'Exclusive VIP training area',
      'Nutritionist consultation',
      'Massage services',
      'Free workout gear rental',
      'Reserved parking spot',
    ],
  },
];

export default function GymPaymentPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { address } = useAccount();
  const chainId = useChainId();
  const validChainId = (chainId || 31337) as NetworkId;
  const publicClient = usePublicClient();

  const { approvePyUSD, subscribeMonthly } = useSubscriptionManager(validChainId);
  const { data: balance } = usePyUSDBalance(validChainId, address);

  const selectedPlan = GYM_PLANS.find((p) => p.id === selectedPlanId);

  const handleSelectPlan = (planId: string) => {
    if (!address) {
      alert('Please connect your wallet first!');
      return;
    }
    setSelectedPlanId(planId);
    setIsModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan || !publicClient) return;

    try {
      setIsProcessing(true);
      const amount = parseUnits(selectedPlan.price, 6);

      // Check balance
      if (!balance || balance < amount) {
        alert(
          `Insufficient balance! You need ${selectedPlan.price} PYUSD, but only have ${balance ? (Number(balance) / 1e6).toFixed(2) : '0'} PYUSD.`
        );
        return;
      }

      // Step 1: Approve PyUSD
      console.log('Step 1: Approving PyUSD...');
      const approveHash = await approvePyUSD(amount);
      console.log('Approve transaction sent:', approveHash);

      // Step 2: Wait for approve transaction confirmation
      console.log('Step 2: Waiting for approve confirmation...');
      await publicClient.waitForTransactionReceipt({ hash: approveHash });
      console.log('Approve transaction confirmed!');

      // Step 3: Subscribe to plan
      console.log('Step 3: Subscribing to plan...');
      const subscribeHash = await subscribeMonthly(0n, false);
      console.log('Subscribe transaction sent:', subscribeHash);

      // Step 4: Wait for subscribe transaction confirmation
      console.log('Step 4: Waiting for subscribe confirmation...');
      await publicClient.waitForTransactionReceipt({ hash: subscribeHash });
      console.log('Subscribe transaction confirmed!');

      alert('Subscription successful! Welcome to FitLife Gym!');
      setIsModalOpen(false);
      setSelectedPlanId(null);
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message || 'Unknown error'}`);
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
              Choose the membership plan that fits you best and start training today.
              All plans include professional coaching and state-of-the-art equipment.
            </p>
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

      {/* Plans Section - Will be added in next commit */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Membership Plan
            </h3>
            <p className="text-gray-600">
              All plans support secure payment with PyUSD
            </p>
          </div>
          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GYM_PLANS.map((plan) => (
              <GymPlanCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                period={plan.period}
                features={plan.features}
                isPopular={plan.isPopular}
                onSelect={() => handleSelectPlan(plan.id)}
                isLoading={false}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPlanId(null);
          }}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
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

