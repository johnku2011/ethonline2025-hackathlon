'use client';

interface GymPlanCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

export function GymPlanCard({
  name,
  price,
  period,
  features,
  isPopular = false,
  onSelect,
  isLoading = false,
}: GymPlanCardProps) {
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        isPopular ? 'ring-4 ring-orange-500' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
          Most Popular
        </div>
      )}

      <div className="p-8">
        {/* Plan Name */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>

        {/* Price */}
        <div className="mb-6">
          <span className="text-4xl font-bold text-orange-600">${price}</span>
          <span className="text-gray-600 ml-2">/ {period}</span>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">✓</span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Select Button */}
        <button
          onClick={onSelect}
          disabled={isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
            isPopular
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
        >
          {isLoading ? 'Processing...' : 'Select This Plan'}
        </button>
      </div>
    </div>
  );
}
