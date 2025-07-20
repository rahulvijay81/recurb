"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { useSubscriptionStore } from "@/hooks/store/use-subscription-store";
import { redirect } from "next/navigation";
import { ExpenseChart } from "@/components/analytics/expense-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart3, CalendarDays, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const { canAccessFeature } = useAuthStore();
  const { subscriptions, isLoading, setSubscriptions, setLoading } = useSubscriptionStore();
  
  // Check if user has access to analytics feature
  useEffect(() => {
    if (!canAccessFeature("trends")) {
      redirect("/settings/plans");
    }
  }, [canAccessFeature]);
  
  // Simulate fetching subscriptions if not already loaded
  useEffect(() => {
    if (subscriptions.length === 0 && !isLoading) {
      const fetchSubscriptions = async () => {
        setLoading(true);
        try {
          // In a real app, this would be an API call
          // For demo purposes, we'll use mock data
          const mockSubscriptions = [
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
        } catch (error) {
          console.error("Error fetching subscriptions:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSubscriptions();
    }
  }, [isLoading, setLoading, setSubscriptions, subscriptions.length]);
  
  // Calculate category distribution
  const categoryData = subscriptions.reduce((acc, sub) => {
    const category = sub.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += sub.amount;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate billing cycle distribution
  const billingCycleData = subscriptions.reduce((acc, sub) => {
    if (!acc[sub.billingCycle]) {
      acc[sub.billingCycle] = 0;
    }
    acc[sub.billingCycle] += 1;
    return acc;
  }, {} as Record<string, number>);
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Visualize and analyze your subscription expenses.
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories">
            <PieChart className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ExpenseChart 
            title="6-Month Expense Forecast" 
            description="Projected subscription expenses for the next 6 months"
          />
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoryData).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span>{category}</span>
                      </div>
                      <span className="font-medium">${amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions by Billing Cycle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(billingCycleData).map(([cycle, count]) => (
                    <div key={cycle} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="capitalize">{cycle}</span>
                      </div>
                      <span className="font-medium">{count} subscriptions</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Detailed breakdown of expenses by category
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>Category analysis charts will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Expense Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track how your subscription expenses change over time
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>Trend analysis charts will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Billing Calendar</CardTitle>
              <p className="text-sm text-muted-foreground">
                View your subscription billing dates on a calendar
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>Calendar view will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}