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
import { FinancialOverview } from "@/components/dashboard/financial-overview";

import { DuplicateDetector } from "@/components/subscriptions/duplicate-detector";

export default function DashboardPage() {
  const { subscriptions, isLoading, setSubscriptions, setLoading } = useSubscriptionStore();
  const { canAccessFeature } = useAuthStore();
  const [stats, setStats] = useState({
    totalActive: 0,
    totalMonthly: 0,
    totalYearly: 0,
    upcomingRenewals: [] as Subscription[],
  });
  
  // Fetch subscriptions from API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/subscriptions');
        // const data = await response.json();
        // setSubscriptions(data.subscriptions || []);
        
        // Temporary: Use existing subscriptions from store or empty array
        const existingSubscriptions = subscriptions.length > 0 ? subscriptions : [];
        setSubscriptions(existingSubscriptions);
        
        // Calculate stats
        const totalMonthly = existingSubscriptions
          .filter(sub => sub.billingCycle === "monthly")
          .reduce((sum, sub) => sum + sub.amount, 0);
          
        const totalYearly = existingSubscriptions
          .filter(sub => sub.billingCycle === "yearly")
          .reduce((sum, sub) => sum + (sub.amount / 12), 0);
          
        const upcomingRenewals = existingSubscriptions
          .filter(sub => {
            const daysUntilRenewal = Math.ceil(
              (sub.nextBillingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );
            return daysUntilRenewal <= 7;
          })
          .sort((a, b) => a.nextBillingDate.getTime() - b.nextBillingDate.getTime());
        
        setStats({
          totalActive: existingSubscriptions.length,
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
      
      <div className="grid gap-6 mb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingRenewals.length}</div>
              <p className="text-xs text-muted-foreground">
                Due within 7 days
              </p>
            </CardContent>
          </Card>
        </div>
        
        <FinancialOverview subscriptions={subscriptions} />
      </div>
      
      {canAccessFeature("duplicate_detection") && (
        <div className="mb-6">
          <DuplicateDetector subscriptions={subscriptions} />
        </div>
      )}
      
      <Card>
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
          
          {canAccessFeature("monthly_breakdowns") && (
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
  );
}