"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Webhook, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/store/use-auth-store";

interface NotificationConfig {
  email: {
    enabled: boolean;
    renewalReminders: boolean;
    weeklyReports: boolean;
    paymentFailures: boolean;
    daysBefore: number;
  };
  webhooks: {
    enabled: boolean;
    slackUrl: string;
    discordUrl: string;
    renewals: boolean;
    payments: boolean;
  };
  reminders: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
  };
}

export function NotificationSettings() {
    const [config, setConfig] = useState<NotificationConfig>({
    email: {
      enabled: true,
      renewalReminders: true,
      weeklyReports: false,
      paymentFailures: true,
      daysBefore: 7,
    },
    webhooks: {
      enabled: false,
      slackUrl: '',
      discordUrl: '',
      renewals: true,
      payments: true,
    },
    reminders: {
      enabled: true,
      frequency: 'weekly',
      time: '09:00',
    },
  });

  const handleSave = () => {
    toast.success("Notification settings saved");
  };

  const updateEmail = (key: keyof NotificationConfig['email'], value: any) => {
    setConfig(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value }
    }));
  };

  const updateWebhooks = (key: keyof NotificationConfig['webhooks'], value: any) => {
    setConfig(prev => ({
      ...prev,
      webhooks: { ...prev.webhooks, [key]: value }
    }));
  };

  const updateReminders = (key: keyof NotificationConfig['reminders'], value: any) => {
    setConfig(prev => ({
      ...prev,
      reminders: { ...prev.reminders, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={config.email.enabled}
              onCheckedChange={(enabled) => updateEmail('enabled', enabled)}
            />
          </div>

          {config.email.enabled && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Renewal Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get notified before subscriptions renew</p>
                  </div>
                  <Switch
                    checked={config.email.renewalReminders}
                    onCheckedChange={(enabled) => updateEmail('renewalReminders', enabled)}
                  />
                </div>

                {config.email.renewalReminders && (
                  <div className="ml-6 space-y-2">
                    <Label>Days Before Renewal</Label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={config.email.daysBefore}
                      onChange={(e) => updateEmail('daysBefore', parseInt(e.target.value) || 7)}
                      className="w-24"
                    />
                  </div>
                )}

                {(
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly expense summaries</p>
                    </div>
                    <Switch
                      checked={config.email.weeklyReports}
                      onCheckedChange={(enabled) => updateEmail('weeklyReports', enabled)}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Payment Failures</Label>
                    <p className="text-sm text-muted-foreground">Get notified of failed payments</p>
                  </div>
                  <Switch
                    checked={config.email.paymentFailures}
                    onCheckedChange={(enabled) => updateEmail('paymentFailures', enabled)}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Webhook Notifications - Team Plan Only */}
      {(
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhook Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Webhooks</Label>
                <p className="text-sm text-muted-foreground">Send notifications to external services</p>
              </div>
              <Switch
                checked={config.webhooks.enabled}
                onCheckedChange={(enabled) => updateWebhooks('enabled', enabled)}
              />
            </div>

            {config.webhooks.enabled && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Slack Webhook URL</Label>
                    <Input
                      placeholder="https://hooks.slack.com/services/..."
                      value={config.webhooks.slackUrl}
                      onChange={(e) => updateWebhooks('slackUrl', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Discord Webhook URL</Label>
                    <Input
                      placeholder="https://discord.com/api/webhooks/..."
                      value={config.webhooks.discordUrl}
                      onChange={(e) => updateWebhooks('discordUrl', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Webhook Events</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="webhook-renewals"
                          checked={config.webhooks.renewals}
                          onCheckedChange={(enabled) => updateWebhooks('renewals', enabled)}
                        />
                        <Label htmlFor="webhook-renewals">Subscription Renewals</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="webhook-payments"
                          checked={config.webhooks.payments}
                          onCheckedChange={(enabled) => updateWebhooks('payments', enabled)}
                        />
                        <Label htmlFor="webhook-payments">Payment Events</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reminder Schedule */}
      {(
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Reminder Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Scheduled Reminders</Label>
                <p className="text-sm text-muted-foreground">Regular reminders about upcoming renewals</p>
              </div>
              <Switch
                checked={config.reminders.enabled}
                onCheckedChange={(enabled) => updateReminders('enabled', enabled)}
              />
            </div>

            {config.reminders.enabled && (
              <>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select
                      value={config.reminders.frequency}
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly') => updateReminders('frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={config.reminders.time}
                      onChange={(e) => updateReminders('time', e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSave} className="w-full">
        Save Notification Settings
      </Button>
    </div>
  );
}