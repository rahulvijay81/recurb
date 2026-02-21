"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationSettings } from "@/components/notifications/notification-settings";
import { ChangePassword } from "@/components/settings/change-password";
import { Bell } from "lucide-react";


export default function SettingsPage() {
  const { user } = useAuth();
  
  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and subscription preferences.
        </p>
      </div>
      
      <div className="space-y-6">
        <ChangePassword />
        
        <div className="space-y-2 mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">
            Configure how you receive notifications.
          </p>
        </div>
        <NotificationSettings />
      </div>
    </div>
  );
}