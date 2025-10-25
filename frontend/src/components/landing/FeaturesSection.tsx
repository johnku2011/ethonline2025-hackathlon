export function FeaturesSection() {
  const features = [
    {
      icon: '💸',
      title: 'Earn While Subscribed',
      description:
        'Your subscription payment earns 4.5% APY through PyUSD. Complete the year and the rewards are yours.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '🔒',
      title: '100% Principal Back',
      description:
        'Cancel anytime and get your full subscription amount back. You only forfeit the interest rewards.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: '🏪',
      title: 'Multi-Provider Platform',
      description:
        'Any business can register and offer subscriptions. Browse from multiple providers in one place.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: '⚡',
      title: 'Built on Arbitrum',
      description:
        'Fast and cheap transactions on Layer 2. No need to worry about high gas fees.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: '🔐',
      title: 'Smart Contract Security',
      description:
        'Your funds are secured by audited smart contracts. Transparent and trustless by design.',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: '💰',
      title: 'Powered by PyUSD',
      description:
        'Use PayPal USD stablecoin for stability and natural interest accrual. No volatility risk.',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A revolutionary subscription model that benefits everyone
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
