import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Subscription Tracker</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Track and manage all your subscriptions in one place. Get insights, reminders, and take control of your recurring expenses.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/auth" 
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
        <Link 
          href="/pricing" 
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          View Plans
        </Link>
      </div>
    </div>
  );
}