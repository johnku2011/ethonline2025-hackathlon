'use client';

import { useState } from 'react';
import { GymHeader } from '@/components/demo/GymHeader';
import { GymPlanCard } from '@/components/demo/GymPlanCard';

// 定義會員計劃
const GYM_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: '29',
    period: '月',
    features: [
      '無限次使用健身房',
      '基礎器材訓練',
      '淋浴間使用',
      '週一至週五 6AM-10PM',
      '免費 WiFi',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '49',
    period: '月',
    features: [
      'Basic 所有功能',
      '團體課程（瑜伽、飛輪、有氧）',
      '每月 2 次私人教練課程',
      '全天候 24/7 開放',
      '免費停車',
      '蛋白質飲品折扣',
    ],
    isPopular: true,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: '99',
    period: '月',
    features: [
      'Premium 所有功能',
      '無限私人教練課程',
      '專屬 VIP 訓練區',
      '營養師諮詢',
      '按摩服務',
      '免費運動服裝租借',
      '專屬停車位',
    ],
  },
];

export default function GymPaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Payment modal will be implemented in next commit
    console.log('Selected plan:', planId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GymHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              開始您的健身之旅
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              選擇最適合您的會員計劃，立即開始訓練。
              所有計劃都包含專業教練指導和最先進的健身設備。
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🏋️</span>
                <span>專業器材</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">👨‍🏫</span>
                <span>專業教練</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span>個人化訓練</span>
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
              選擇您的會員計劃
            </h3>
            <p className="text-gray-600">
              所有計劃都支援使用 PyUSD 安全付款
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
                isLoading={selectedPlan === plan.id}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

