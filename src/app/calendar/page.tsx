"use client";

import { CalendarView } from "@/components/subscriptions/calendar-view";
import { useSubscriptionStore } from "@/hooks/store/use-subscription-store";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { useEffect } from "react";

export default function CalendarPage() {
  const { subscriptions, setSubscriptions, setLoading } = useSubscriptionStore();
  const { canAccessFeature } = useAuthStore();

  useEffect(() => {
    const loadSubscriptions = async () => {
      setLoading(true);
      try {
        const mockSubscriptions = [
          {
            id: "1",
            name: "Netflix",
            amount: 15.99,
            currency: "USD",
            billingCycle: "monthly" as const,
            nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            autoRenew: true,
            category: "Entertainment",
            tags: ["streaming", "video"],
            vendor: "Netflix Inc.",
          },
          {
            id: "2",
            name: "Spotify",
            amount: 9.99,
            currency: "USD",
            billingCycle: "monthly" as const,
            nextBillingDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
            autoRenew: true,
            category: "Entertainment",
            tags: ["streaming", "music"],
            vendor: "Spotify AB",
          },
          {
            id: "3",
            name: "Adobe Creative Cloud",
            amount: 52.99,
            currency: "USD",
            billingCycle: "monthly" as const,
            nextBillingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            autoRenew: true,
            category: "Software",
            tags: ["design", "productivity"],
            vendor: "Adobe Inc.",
          },
        ];
        setSubscriptions(mockSubscriptions);
      } finally {
        setLoading(false);
      }
    };
    
    loadSubscriptions();
  }, [setSubscriptions, setLoading]);

  if (!canAccessFeature("calendar")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Calendar View</h2>
          <p className="text-muted-foreground">Upgrade to Pro to access the renewal calendar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Renewal Calendar</h1>
        <p className="text-muted-foreground">
          View your subscription renewals in a calendar format
        </p>
      </div>
      
      <CalendarView subscriptions={subscriptions} />
    </div>
  );
}