"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { DetectedSubscription } from "@/lib/utils/email-subscription-detector";
import { Mail, Plus } from "lucide-react";

interface EmailDetectionDialogProps {
  onSubscriptionsDetected: (subscriptions: DetectedSubscription[]) => void;
}

export function EmailDetectionDialog({ onSubscriptionsDetected }: EmailDetectionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedSubs, setDetectedSubs] = useState<DetectedSubscription[]>([]);
  const { canAccessFeature } = useAuthStore();

  if (!canAccessFeature("auto_email_detection")) {
    return null;
  }

  const handleDetect = async () => {
    if (!emailText.trim()) return;

    setIsLoading(true);
    try {
      const emails = emailText.split('\n').filter(line => line.includes('@'));
      
      const response = await fetch('/api/subscriptions/auto-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setDetectedSubs(result.data);
      }
    } catch (error) {
      console.error('Detection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSelected = () => {
    onSubscriptionsDetected(detectedSubs);
    setIsOpen(false);
    setEmailText("");
    setDetectedSubs([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Scan emails
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Auto-detect subscriptions from emails</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Paste your subscription emails below to automatically detect services:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Copy billing emails from Netflix, Spotify, Adobe, etc.</li>
              <li>Paste multiple emails at once</li>
              <li>We'll scan for subscription services and pricing</li>
            </ul>
          </div>
          <Textarea
            placeholder="Example: Paste emails like 'Your Netflix subscription will renew on...' or 'Thank you for your Spotify payment...'"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            rows={6}
          />
          <Button onClick={handleDetect} disabled={isLoading || !emailText.trim()}>
            {isLoading ? "Scanning emails..." : "Scan for subscriptions"}
          </Button>
          
          {detectedSubs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Found {detectedSubs.length} subscription{detectedSubs.length !== 1 ? 's' : ''}:</h4>
                <Badge variant="outline" className="text-xs">Ready to add</Badge>
              </div>
              <div className="space-y-2">
                {detectedSubs.map((sub, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded bg-muted/30">
                    <div>
                      <div className="font-medium">{sub.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${sub.amount}/{sub.billingCycle} • {sub.category}
                      </div>
                    </div>
                    <Badge variant="secondary">{Math.round(sub.confidence * 100)}% match</Badge>
                  </div>
                ))}
              </div>
              <Button onClick={handleAddSelected} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add all to my subscriptions
              </Button>
            </div>
          )}
          
          {emailText.trim() && detectedSubs.length === 0 && !isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No subscriptions detected in this text.</p>
              <p className="text-xs mt-1">Try pasting billing emails or receipts.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}