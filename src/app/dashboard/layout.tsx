import { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Subscription Tracker</h1>
        </div>
        
        <nav className="space-y-1">
          <Link 
            href="/dashboard" 
            className="block px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link 
            href="/dashboard/subscriptions" 
            className="block px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Subscriptions
          </Link>
          <Link 
            href="/dashboard/analytics" 
            className="block px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Analytics
          </Link>
          <Link 
            href="/dashboard/calendar" 
            className="block px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Calendar
          </Link>
          <Link 
            href="/dashboard/invoices" 
            className="block px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Invoices
          </Link>
          <Link 
            href="/dashboard/settings" 
            className="block px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Settings
          </Link>
          <Link 
            href="/dashboard/team" 
            className="block px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Team
          </Link>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}