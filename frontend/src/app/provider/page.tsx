import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function ProviderPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Become a Provider
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Register your business and start offering subscriptions
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              🚧 Coming soon - Provider registration will be available after
              contract deployment
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
