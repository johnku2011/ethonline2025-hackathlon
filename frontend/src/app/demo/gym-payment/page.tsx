'use client';

import { GymHeader } from '@/components/demo/GymHeader';

export default function GymPaymentPage() {
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
          {/* Plan cards will be added here */}
          <div className="text-center text-gray-500 py-12">
            計劃卡片即將推出...
          </div>
        </div>
      </section>
    </div>
  );
}

