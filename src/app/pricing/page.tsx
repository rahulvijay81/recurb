import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Subscription Tracker pricing plans',
};

export default function PricingPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Choose Your Plan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Basic Plan */}
        <div className="border rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-2">Basic</h2>
          <p className="text-gray-600 mb-4">For individuals</p>
          <div className="text-3xl font-bold mb-6">$5<span className="text-lg font-normal">/month</span></div>
          <ul className="mb-8 flex-1">
            <li className="mb-2">✓ Subscription Management</li>
            <li className="mb-2">✓ CSV Import/Export</li>
            <li className="mb-2">✓ Basic Analytics</li>
          </ul>
          <Link 
            href="/auth" 
            className="w-full py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
        
        {/* Pro Plan */}
        <div className="border rounded-lg p-6 flex flex-col border-blue-500 shadow-md">
          <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm w-fit mb-4">POPULAR</div>
          <h2 className="text-2xl font-bold mb-2">Pro</h2>
          <p className="text-gray-600 mb-4">For professionals</p>
          <div className="text-3xl font-bold mb-6">$12<span className="text-lg font-normal">/month</span></div>
          <ul className="mb-8 flex-1">
            <li className="mb-2">✓ All Basic features</li>
            <li className="mb-2">✓ Advanced Analytics</li>
            <li className="mb-2">✓ Invoice Management</li>
            <li className="mb-2">✓ Calendar View</li>
            <li className="mb-2">✓ Custom Reminders</li>
          </ul>
          <Link 
            href="/auth" 
            className="w-full py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
        
        {/* Team Plan */}
        <div className="border rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-2">Team</h2>
          <p className="text-gray-600 mb-4">For organizations</p>
          <div className="text-3xl font-bold mb-6">$29<span className="text-lg font-normal">/month</span></div>
          <ul className="mb-8 flex-1">
            <li className="mb-2">✓ All Pro features</li>
            <li className="mb-2">✓ Team Collaboration</li>
            <li className="mb-2">✓ Role-based Access</li>
            <li className="mb-2">✓ Slack/Discord Integration</li>
            <li className="mb-2">✓ Activity Logging</li>
          </ul>
          <Link 
            href="/auth" 
            className="w-full py-2 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}