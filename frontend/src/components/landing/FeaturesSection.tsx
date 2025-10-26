export function FeaturesSection() {
  const features = [
    {
      icon: '🪙',
      title: 'PyUSD Holding Rewards',
      description:
        'Earn at least 4% APY automatically from PayPal USD while your subscription runs. Stable collateral, no volatility.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '🧠',
      title: 'Morpho Vault Optimization',
      description:
        'Funds route through Morpho vaults to amplify returns via decentralized lending markets without sacrificing self-custody.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '🤝',
      title: 'Loyalty Incentives',
      description:
        'Complete a plan to claim the accrued interest, or cancel early and let your provider keep the yield as a churn deterrent.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: '🏢',
      title: 'Provider Growth Suite',
      description:
        'Onboard with a business profile, set pricing, and track earnings from a dedicated dashboard built for subscription teams.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: '�',
      title: 'Curated Marketplace',
      description:
        'Browse multi-provider offers—from streaming to SaaS—inside a single marketplace with WalletConnect and RainbowKit flows.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: '🎮',
      title: 'Guided Sandbox Demo',
      description:
        'Test the experience risk-free on Arbitrum Sepolia with auto-provisioned wallets, preloaded providers, and time-warp controls.',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why Pay2Earn?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A DeFi-native subscription model designed for users, providers, and builders
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
            >
              {/* Icon with Gradient Background */}
              <div className="relative mb-6">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 rounded-2xl transform group-hover:scale-110 transition-transform duration-300`}
                />
                <div className="relative text-5xl p-4">{feature.icon}</div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
