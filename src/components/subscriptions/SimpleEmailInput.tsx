"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { DetectedSubscription } from "@/lib/utils/email-subscription-detector";
import { AtSign, Plus } from "lucide-react";

interface SimpleEmailInputProps {
  onSubscriptionsDetected: (subscriptions: DetectedSubscription[]) => void;
}

export function SimpleEmailInput({ onSubscriptionsDetected }: SimpleEmailInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedSubs, setDetectedSubs] = useState<DetectedSubscription[]>([]);
  const { canAccessFeature } = useAuthStore();

  if (!canAccessFeature("auto_email_detection")) {
    return null;
  }

  const handleDetect = async () => {
    if (!email.trim() || !email.includes('@')) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/auto-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: [email] }),
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
    setEmail("");
    setDetectedSubs([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="whitespace-nowrap">
          <AtSign className="h-4 w-4 mr-2" />
          Email lookup
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Find subscriptions by email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Enter an email address to check for known subscription services:</p>
          </div>
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="user@netflix.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDetect()}
            />
            <Button 
              onClick={handleDetect} 
              disabled={isLoading || !email.trim() || !email.includes('@')}
              className="w-full"
            >
              {isLoading ? "Checking..." : "Check for subscriptions"}
            </Button>
          </div>
          
          {detectedSubs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Found {detectedSubs.length} service{detectedSubs.length !== 1 ? 's' : ''}:</h4>
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
                Add to my subscriptions
              </Button>
            </div>
          )}
          
          {email.trim() && email.includes('@') && detectedSubs.length === 0 && !isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No known subscriptions for this email domain.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}