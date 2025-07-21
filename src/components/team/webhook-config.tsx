"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Webhook, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { WebhookConfig } from "@/lib/types";

interface WebhookConfigProps {
  webhooks?: WebhookConfig[];
  onSave?: (webhooks: WebhookConfig[]) => void;
}

const WEBHOOK_EVENTS = [
  { id: 'subscription.created', label: 'Subscription Created' },
  { id: 'subscription.updated', label: 'Subscription Updated' },
  { id: 'subscription.deleted', label: 'Subscription Deleted' },
  { id: 'renewal.upcoming', label: 'Renewal Upcoming' },
  { id: 'payment.failed', label: 'Payment Failed' },
];

export function WebhookConfig({ webhooks = [], onSave }: WebhookConfigProps) {
  const [configs, setConfigs] = useState<WebhookConfig[]>(webhooks);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
    enabled: true
  });

  const addWebhook = () => {
    if (!newWebhook.name || !newWebhook.url || newWebhook.events.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      ...newWebhook,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedConfigs = [...configs, webhook];
    setConfigs(updatedConfigs);
    onSave?.(updatedConfigs);
    
    setNewWebhook({ name: '', url: '', events: [], enabled: true });
    toast.success("Webhook added successfully");
  };

  const removeWebhook = (id: string) => {
    const updatedConfigs = configs.filter(w => w.id !== id);
    setConfigs(updatedConfigs);
    onSave?.(updatedConfigs);
    toast.success("Webhook removed");
  };

  const toggleWebhook = (id: string, enabled: boolean) => {
    const updatedConfigs = configs.map(w => 
      w.id === id ? { ...w, enabled, updatedAt: new Date() } : w
    );
    setConfigs(updatedConfigs);
    onSave?.(updatedConfigs);
  };

  const handleEventChange = (eventId: string, checked: boolean) => {
    setNewWebhook(prev => ({
      ...prev,
      events: checked 
        ? [...prev.events, eventId]
        : prev.events.filter(e => e !== eventId)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Webhook Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add new webhook */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Add New Webhook</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Name</Label>
                <Input
                  id="webhook-name"
                  placeholder="Slack Notifications"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://hooks.slack.com/..."
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Events to Subscribe</Label>
              <div className="grid grid-cols-2 gap-2">
                {WEBHOOK_EVENTS.map(event => (
                  <div key={event.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={event.id}
                      checked={newWebhook.events.includes(event.id)}
                      onCheckedChange={(checked) => handleEventChange(event.id, !!checked)}
                    />
                    <Label htmlFor={event.id} className="text-sm">
                      {event.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={addWebhook} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>

          {/* Existing webhooks */}
          <div className="space-y-3">
            <h4 className="font-medium">Configured Webhooks</h4>
            
            {configs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No webhooks configured yet.
              </p>
            ) : (
              configs.map(webhook => (
                <div key={webhook.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-medium">{webhook.name}</h5>
                      <p className="text-sm text-muted-foreground">{webhook.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={webhook.enabled}
                        onCheckedChange={(enabled) => toggleWebhook(webhook.id, enabled)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWebhook(webhook.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map(eventId => {
                      const event = WEBHOOK_EVENTS.find(e => e.id === eventId);
                      return (
                        <Badge key={eventId} variant="secondary" className="text-xs">
                          {event?.label || eventId}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}