'use client';

import { useEffect, useState } from 'react';

export function StatsSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      value: '$0',
      label: 'Total Value Locked',
      description: 'Coming soon after deployment',
      icon: '💎',
    },
    {
      value: '0',
      label: 'Active Subscriptions',
      description: 'Be the first to subscribe',
      icon: '📊',
    },
    {
      value: '0',
      label: 'Total Providers',
      description: 'Join as a provider',
      icon: '🏢',
    },
    {
      value: '$0',
      label: 'Interest Distributed',
      description: 'Rewards paid to users',
      icon: '🎁',
    },
  ];

  if (!mounted) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Platform Statistics
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Live metrics populate once the Arbitrum Sepolia sandbox spins up
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{stat.icon}</div>

              {/* Value */}
              <div className="text-4xl font-bold mb-2">{stat.value}</div>

              {/* Label */}
              <div className="text-lg font-semibold mb-2">{stat.label}</div>

              {/* Description */}
              <div className="text-sm text-blue-100">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-12 text-center">
          <p className="text-blue-100 text-sm">
            💡 Production deployment will surface real PyUSD and Morpho yield
            totals across user and provider dashboards
          </p>
        </div>
      </div>
    </section>
  );
}
