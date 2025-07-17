import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication page for Subscription Tracker',
};

export default function AuthPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Authentication</h1>
      <p>Sign in to manage your subscriptions</p>
      {/* Authentication components will be added in task 2.1 */}
    </div>
  );
}