export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Subscribe with PyUSD',
      description:
        'Choose a service and pay for a yearly subscription using PyUSD. Your funds are securely held in a smart contract.',
      icon: '💰',
    },
    {
      number: '02',
      title: 'Interest Accrues Automatically',
      description:
        'PyUSD naturally earns interest. We calculate 4.5% APY on your subscription amount throughout the year.',
      icon: '📈',
    },
    {
      number: '03',
      title: 'Complete Year = Earn Rewards',
      description:
        'After 1 year, claim your full subscription amount back PLUS the 4.5% interest. Cancel early? Get your principal back, but forfeit the interest.',
      icon: '🎉',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to start earning rewards on your subscriptions
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 opacity-30" />
              )}

              {/* Step Card */}
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-5xl mb-6 mt-4">{step.icon}</div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Example Calculation */}
        <div className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            💡 Example: Spotify Premium Subscription
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                Traditional Model
              </div>
              <div className="space-y-2 text-gray-600">
                <div>Pay: $120/year</div>
                <div>Get back: $0</div>
                <div className="pt-2 border-t border-gray-200 font-bold text-red-600">
                  Total Cost: -$120
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-500">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                Our Model (Complete Year)
              </div>
              <div className="space-y-2 text-gray-600">
                <div>Pay: $120/year</div>
                <div>Get back: $120 + $5.40</div>
                <div className="pt-2 border-t border-gray-200 font-bold text-green-600">
                  Total Cost: -$114.60 🎉
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
