import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>

          {/* Description */}
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Try our sandbox demo or connect your wallet to start earning rewards
            on your subscriptions today.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/demo">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100"
              >
                🎮 Try Sandbox Demo
              </Button>
            </Link>
            <Link href="/provider">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              >
                Become a Provider
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-sm text-blue-100">
              Built for ETHGlobal Hackathon • Open Source • Audited Smart
              Contracts
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
