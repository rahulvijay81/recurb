import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'User settings and preferences',
};

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p>Manage your account settings and preferences</p>
      {/* Settings components will be added in task 14.1 */}
    </div>
  );
}