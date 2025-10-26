'use client';

export function GymHeader() {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full p-3">
              <span className="text-4xl">💪</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">FitLife Gym</h1>
              <p className="text-orange-100 text-sm">
                Transform Your Body, Transform Your Life
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <a href="#" className="hover:text-orange-100 transition">
              About Us
            </a>
            <a href="#" className="hover:text-orange-100 transition">
              Classes
            </a>
            <a href="#" className="hover:text-orange-100 transition">
              Facilities
            </a>
            <a href="#" className="hover:text-orange-100 transition">
              Contact
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

