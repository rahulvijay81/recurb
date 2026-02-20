"use client";

import { CalendarView } from "@/components/subscriptions/calendar-view";
import { useSubscriptionStore } from "@/hooks/store/use-subscription-store";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, AlertCircle, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";
import Link from "next/link";

export default function CalendarPage() {
  const { subscriptions, setSubscriptions, setLoading, loading } = useSubscriptionStore();
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
          {
            id: "4",
            name: "GitHub Pro",
            amount: 4.00,
            currency: "USD",
            billingCycle: "monthly" as const,
            nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            autoRenew: true,
            category: "Software",
            tags: ["development", "tools"],
            vendor: "GitHub Inc.",
          },
          {
            id: "5",
            name: "Figma Professional",
            amount: 12.00,
            currency: "USD",
            billingCycle: "monthly" as const,
            nextBillingDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
            autoRenew: true,
            category: "Software",
            tags: ["design", "collaboration"],
            vendor: "Figma Inc.",
          },
        ];
        setSubscriptions(mockSubscriptions);
      } finally {
        setLoading(false);
      }
    };
    
    loadSubscriptions();
  }, [setSubscriptions, setLoading]);

  const upcomingRenewals = useMemo(() => {
    const now = new Date();
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return subscriptions
      .filter(sub => {
        const renewalDate = new Date(sub.nextBillingDate);
        return renewalDate >= now && renewalDate <= next7Days;
      })
      .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
  }, [subscriptions]);

  const monthlyTotal = useMemo(() => {
    const now = new Date();
    return subscriptions
      .filter(sub => {
        const renewalDate = new Date(sub.nextBillingDate);
        return renewalDate.getMonth() === now.getMonth() && 
               renewalDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, sub) => sum + sub.amount, 0);
  }, [subscriptions]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="h-96 bg-muted rounded-lg animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded-lg animate-pulse" />
            <div className="h-48 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Renewal Calendar</h1>
          <p className="text-muted-foreground">
            Track your subscription renewals and never miss a payment
          </p>
        </div>
        <Button asChild>
          <Link href="/subscriptions/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Link>
        </Button>
      </div>

      {/* Mobile Stats */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <div className="text-xl font-bold">${monthlyTotal.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Next 7 Days</span>
            </div>
            <div className="text-xl font-bold">{upcomingRenewals.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <CalendarView subscriptions={subscriptions} />
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {subscriptions.filter(sub => {
                  const renewalDate = new Date(sub.nextBillingDate);
                  const now = new Date();
                  return renewalDate.getMonth() === now.getMonth() && 
                         renewalDate.getFullYear() === now.getFullYear();
                }).length} renewals scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Next 7 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingRenewals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No renewals in the next 7 days</p>
              ) : (
                <div className="space-y-3">
                  {upcomingRenewals.map(sub => {
                    const daysUntil = Math.ceil(
                      (new Date(sub.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <div key={sub.id} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{sub.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">${sub.amount}</p>
                          <Badge variant="outline" className="text-xs">
                            {sub.category}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Upcoming Renewals */}
      <div className="lg:hidden">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Upcoming Renewals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingRenewals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No renewals in the next 7 days</p>
            ) : (
              <div className="space-y-3">
                {upcomingRenewals.slice(0, 3).map(sub => {
                  const daysUntil = Math.ceil(
                    (new Date(sub.nextBillingDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  
                  return (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{sub.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${sub.amount}</p>
                        <Badge variant="outline" className="text-xs">
                          {sub.category}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                {upcomingRenewals.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{upcomingRenewals.length - 3} more renewals
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}