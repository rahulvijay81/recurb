"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubscriptionStore } from "@/hooks/store/use-subscription-store";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { Subscription } from "@/lib/schemas/subscription";
import { format } from "date-fns";
import { 
  CreditCard, 
  DollarSign, 
  CalendarClock, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { subscriptions, isLoading, setSubscriptions, setLoading } = useSubscriptionStore();
  const { canAccessFeature } = useAuthStore();
  const [stats, setStats] = useState({
    totalActive: 0,
    totalMonthly: 0,
    totalYearly: 0,
    upcomingRenewals: [] as Subscription[],
  });
  
  // Simulate fetching subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use mock data
        const mockSubscriptions: Subscription[] = [
          {
            id: "1",
            name: "Netflix",
            amount: 15.99,
            currency: "USD",
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
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
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
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
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            autoRenew: true,
            category: "Software",
            tags: ["design", "productivity"],
            vendor: "Adobe Inc.",
          },
          {
            id: "4",
            name: "AWS",
            amount: 150.00,
            currency: "USD",
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
            autoRenew: true,
            category: "Cloud Services",
            tags: ["hosting", "infrastructure"],
            vendor: "Amazon Web Services",
          },
          {
            id: "5",
            name: "Microsoft 365",
            amount: 99.99,
            currency: "USD",
            billingCycle: "yearly",
            nextBillingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
            autoRenew: true,
            category: "Software",
            tags: ["productivity", "office"],
            vendor: "Microsoft",
          },
        ];
        
        setSubscriptions(mockSubscriptions);
        
        // Calculate stats
        const totalMonthly = mockSubscriptions
          .filter(sub => sub.billingCycle === "monthly")
          .reduce((sum, sub) => sum + sub.amount, 0);
          
        const totalYearly = mockSubscriptions
          .filter(sub => sub.billingCycle === "yearly")
          .reduce((sum, sub) => sum + (sub.amount / 12), 0);
          
        const upcomingRenewals = mockSubscriptions
          .filter(sub => {
            const daysUntilRenewal = Math.ceil(
              (sub.nextBillingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            return daysUntilRenewal <= 7;
          })
          .sort((a, b) => a.nextBillingDate.getTime() - b.nextBillingDate.getTime());
        
        setStats({
          totalActive: mockSubscriptions.length,
          totalMonthly,
          totalYearly: totalYearly,
          upcomingRenewals,
        });
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, [setLoading, setSubscriptions]);
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your subscription expenses and upcoming renewals.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActive}</div>
            <p className="text-xs text-muted-foreground">
              Subscriptions being tracked
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalMonthly.toFixed(2)}
              <span className="text-xs text-muted-foreground ml-1">/ month</span>
            </div>
            <div className="flex items-center pt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
              <p className="text-xs text-emerald-500">+2.5% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Yearly Projection</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((stats.totalMonthly + stats.totalYearly) * 12).toFixed(2)}
              <span className="text-xs text-muted-foreground ml-1">/ year</span>
            </div>
            <div className="flex items-center pt-1">
              <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              <p className="text-xs text-red-500">Save $120 with annual plans</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Renewals</CardTitle>
            <CardDescription>Subscriptions renewing in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.upcomingRenewals.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingRenewals.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <p className="font-medium">{sub.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(sub.nextBillingDate, "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${sub.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{sub.billingCycle}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarClock className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No upcoming renewals in the next 7 days</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and features</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild className="w-full justify-start">
              <Link href="/subscriptions/new">
                <CreditCard className="mr-2 h-4 w-4" />
                Add New Subscription
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/subscriptions">
                <CreditCard className="mr-2 h-4 w-4" />
                View All Subscriptions
              </Link>
            </Button>
            
            {canAccessFeature("csv_import_export") && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/subscriptions/import">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Import Subscriptions
                </Link>
              </Button>
            )}
            
            {canAccessFeature("analytics") && (
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/analytics">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}