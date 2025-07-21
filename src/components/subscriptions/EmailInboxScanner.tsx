"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { DetectedSubscription } from "@/lib/utils/email-subscription-detector";
import { EMAIL_PROVIDERS } from "@/lib/utils/email-providers";
import { Mail, Plus, ExternalLink } from "lucide-react";

interface EmailInboxScannerProps {
  onSubscriptionsDetected: (subscriptions: DetectedSubscription[]) => void;
}

export function EmailInboxScanner({ onSubscriptionsDetected }: EmailInboxScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedSubs, setDetectedSubs] = useState<DetectedSubscription[]>([]);
  const [scannedCount, setScannedCount] = useState(0);
  const { canAccessFeature } = useAuthStore();

  if (!canAccessFeature("auto_email_detection")) {
    return null;
  }

  const handleProviderAuth = (provider: string) => {
    const providerConfig = EMAIL_PROVIDERS[provider];
    const clientId = provider === "gmail" 
      ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID 
      : process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID;
    
    const params = new URLSearchParams({
      client_id: clientId || "",
      response_type: "code",
      scope: providerConfig.scopes.join(" "),
      redirect_uri: `${window.location.origin}/api/auth/callback/${provider}`,
      access_type: "offline",
      prompt: "consent"
    });

    window.open(`${providerConfig.authUrl}?${params}`, "_blank", "width=500,height=600");
  };

  const handleScanEmails = async (provider: string, accessToken: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions/email-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, accessToken }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setDetectedSubs(result.data);
        setScannedCount(result.scannedEmails);
      }
    } catch (error) {
      console.error('Email scan failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSelected = () => {
    onSubscriptionsDetected(detectedSubs);
    setIsOpen(false);
    setDetectedSubs([]);
    setScannedCount(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="h-4 w-4 mr-2" />
          Scan inbox
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Scan email inbox for subscriptions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Connect your email account to automatically detect subscription services:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>We'll scan for billing emails from popular services</li>
              <li>Only subscription-related emails are analyzed</li>
              <li>Your email data is not stored</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(EMAIL_PROVIDERS).map(([key, provider]) => (
              <Button
                key={key}
                variant="outline"
                onClick={() => handleProviderAuth(key)}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Connect {provider.name}
              </Button>
            ))}
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="text-sm text-muted-foreground">Scanning your emails...</div>
            </div>
          )}
          
          {detectedSubs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Found {detectedSubs.length} subscription{detectedSubs.length !== 1 ? 's' : ''}</h4>
                <Badge variant="outline" className="text-xs">
                  Scanned {scannedCount} emails
                </Badge>
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
          
          {scannedCount > 0 && detectedSubs.length === 0 && !isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              <p className="text-sm">No subscriptions detected in {scannedCount} emails.</p>
              <p className="text-xs mt-1">Try a different email account or check your billing folder.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}