"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Subscription } from "@/lib/schemas/subscription";
import { ExpenseChart } from "@/components/analytics/expense-chart";
import { TrendsChart } from "@/components/analytics/trends-chart";
import { ForecastingChart } from "@/components/analytics/forecasting-chart";
import { VendorSummary } from "@/components/subscriptions/vendor-summary";
import { EnhancedExport } from "@/components/subscriptions/enhanced-export";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart3, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/subscriptions');
        if (res.status === 403) {
          setHasAccess(false);
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        const mapped = (result.data || []).map((sub: any) => ({
          id: sub.id?.toString(),
          name: sub.name,
          amount: sub.amount,
          currency: sub.currency,
          billingCycle: sub.billing_cycle,
          category: sub.category,
          vendor: sub.vendor,
          tags: sub.tags ? JSON.parse(sub.tags) : [],
          nextBillingDate: sub.next_billing_date ? new Date(sub.next_billing_date) : new Date(),
          autoRenew: Boolean(sub.auto_renew),
          notes: sub.notes,
          invoiceUrl: sub.invoice_url,
          userId: sub.user_id?.toString(),
          organizationId: sub.organization_id,
          createdAt: new Date(sub.created_at),
          updatedAt: new Date(sub.updated_at),
        }));
        setSubscriptions(mapped);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (!hasAccess) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-lg font-medium">Access Denied</p>
              <p className="text-sm text-muted-foreground mt-2">You don't have permission to view analytics.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ForecastingChart subscriptions={subscriptions} />
          
          <div className="grid md:grid-cols-2 gap-6">
            <VendorSummary subscriptions={subscriptions} />
            <EnhancedExport subscriptions={subscriptions} />
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
          <TrendsChart subscriptions={subscriptions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}