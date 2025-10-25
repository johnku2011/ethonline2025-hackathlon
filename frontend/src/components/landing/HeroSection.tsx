'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse" />
            Built on Arbitrum with PyUSD
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Earn While You
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Subscribe
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Subscribe yearly with PyUSD and earn 4.5% APY rewards. Complete the
            year, get your money back plus interest. It's that simple.
          </p>

          {/* Key Stats Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="text-2xl font-bold text-blue-600">4.5% APY</div>
              <div className="text-sm text-gray-600">
                Interest Rewards
              </div>
            </div>
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">
                Refundable
              </div>
            </div>
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="text-2xl font-bold text-purple-600">0 Fees</div>
              <div className="text-sm text-gray-600">
                No Hidden Costs
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/demo">
              <Button size="lg" className="w-full sm:w-auto">
                🎮 Try Sandbox Demo
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse Subscriptions
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-sm text-gray-500">
            <p>Powered by</p>
            <div className="flex justify-center items-center gap-8 mt-4">
              <span className="font-semibold text-gray-700">
                PyUSD
              </span>
              <span className="text-gray-300">•</span>
              <span className="font-semibold text-gray-700">
                Arbitrum
              </span>
              <span className="text-gray-300">•</span>
              <span className="font-semibold text-gray-700">
                Solidity
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 -z-10 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 -z-10 animate-pulse" />
    </section>
  );
}
