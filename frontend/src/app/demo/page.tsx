import { Button } from '@/components/ui/Button';

export default function DemoPage() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎮 Sandbox Demo
          </h1>
          <p className="text-xl text-gray-600">
            Try our platform risk-free on Arbitrum Sepolia testnet
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-12 text-center border-2 border-blue-200">
          <div className="mb-8">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Demo Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              The sandbox demo will be available once we deploy the smart
              contracts to Arbitrum Sepolia testnet.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">
              What you'll be able to do:
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Get a pre-funded demo wallet with testnet PyUSD</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Browse real providers on testnet</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Subscribe to services with testnet tokens</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Fast-forward time to see year completion</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✅</span>
                <span>Test cancellation and reward claiming</span>
              </li>
            </ul>
          </div>

          <Button disabled className="opacity-50 cursor-not-allowed">
            Demo Not Available Yet
          </Button>
        </div>
      </div>
    </div>
  );
}
