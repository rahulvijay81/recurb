export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* MRR Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700">Monthly Recurring Revenue</h2>
          <p className="text-3xl font-bold mt-2">$0.00</p>
        </div>
        
        {/* YRR Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700">Yearly Recurring Revenue</h2>
          <p className="text-3xl font-bold mt-2">$0.00</p>
        </div>
        
        {/* Active Subscriptions Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-700">Active Subscriptions</h2>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
      
      {/* Recent Subscriptions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Subscriptions</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 text-center text-gray-500">
            No subscriptions found. Add your first subscription to get started.
          </div>
        </div>
      </div>
      
      {/* Upcoming Renewals */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Renewals</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 text-center text-gray-500">
            No upcoming renewals found.
          </div>
        </div>
      </div>
    </div>
  );
}