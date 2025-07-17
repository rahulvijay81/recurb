import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscriptions',
  description: 'Manage your subscriptions',
};

export default function SubscriptionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
      <p>Manage your subscriptions here</p>
      {/* Subscription management components will be added in task 3.2 */}
    </div>
  );
}