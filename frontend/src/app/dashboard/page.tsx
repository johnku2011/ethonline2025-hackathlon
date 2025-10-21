import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Manage your subscriptions
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              🚧 Coming soon - Connect your wallet to view subscriptions
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

