"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail } from "lucide-react";
import { toast } from "sonner";

interface ReminderSettingsProps {
  subscriptionId?: string;
  onSave?: (settings: ReminderConfig) => void;
}

interface ReminderConfig {
  enabled: boolean;
  emailReminders: boolean;
  daysBefore: number;
  frequency: 'once' | 'daily' | 'weekly';
  customMessage?: string;
}

export function ReminderSettings({ subscriptionId, onSave }: ReminderSettingsProps) {
  const [config, setConfig] = useState<ReminderConfig>({
    enabled: true,
    emailReminders: true,
    daysBefore: 7,
    frequency: 'once',
    customMessage: ''
  });

  const handleSave = () => {
    onSave?.(config);
    toast.success("Reminder settings saved");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Reminder Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get notified before renewals
              </p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => setConfig(prev => ({ ...prev, enabled }))}
            />
          </div>

          {config.enabled && (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Reminders
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications
                  </p>
                </div>
                <Switch
                  checked={config.emailReminders}
                  onCheckedChange={(emailReminders) => setConfig(prev => ({ ...prev, emailReminders }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="days-before">Days Before Renewal</Label>
                <Input
                  id="days-before"
                  type="number"
                  min="1"
                  max="365"
                  value={config.daysBefore}
                  onChange={(e) => setConfig(prev => ({ ...prev, daysBefore: parseInt(e.target.value) || 7 }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Reminder Frequency</Label>
                <Select
                  value={config.frequency}
                  onValueChange={(frequency: 'once' | 'daily' | 'weekly') => 
                    setConfig(prev => ({ ...prev, frequency }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-message">Custom Message (Optional)</Label>
                <Input
                  id="custom-message"
                  placeholder="Add a custom reminder message..."
                  value={config.customMessage}
                  onChange={(e) => setConfig(prev => ({ ...prev, customMessage: e.target.value }))}
                />
              </div>
            </>
          )}

          <Button onClick={handleSave} className="w-full">
            Save Reminder Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}