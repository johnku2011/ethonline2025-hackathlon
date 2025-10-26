'use client';

export function PoweredByBadge() {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <a
        href="/subscriptions"
        className="flex items-center space-x-3 bg-white rounded-full shadow-lg px-6 py-3 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Powered by</span>
          <div className="flex items-center space-x-1">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              SubPay Protocol
            </span>
          </div>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </a>
    </div>
  );
}

