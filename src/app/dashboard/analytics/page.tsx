import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Subscription analytics and insights',
};

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <p>View your subscription analytics and insights</p>
      {/* Analytics components will be added in task 4.2 */}
    </div>
  );
}