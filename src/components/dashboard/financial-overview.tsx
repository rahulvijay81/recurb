"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/lib/schemas/subscription";
import { calculateMRR, calculateYRR, getCategorySpend, getUpcomingRenewals } from "@/lib/utils/financial";
import { useAuthStore } from "@/hooks/store/use-auth-store";

interface FinancialOverviewProps {
  subscriptions: Subscription[];
}

export function FinancialOverview({ subscriptions }: FinancialOverviewProps) {
  const { canAccessFeature } = useAuthStore();
  const mrr = calculateMRR(subscriptions);
  const yrr = calculateYRR(subscriptions);
  const upcomingRenewals = getUpcomingRenewals(subscriptions);
  const categorySpend = getCategorySpend(subscriptions);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Recurring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${mrr.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Yearly Recurring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${yrr.toFixed(2)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscriptions.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingRenewals.length}</div>
        </CardContent>
      </Card>

      {canAccessFeature("monthly_breakdowns") && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(categorySpend).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm">{category}</span>
                  <Badge variant="secondary">${amount.toFixed(2)}/mo</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {upcomingRenewals.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingRenewals.slice(0, 5).map((sub) => (
                <div key={sub.id} className="flex justify-between items-center">
                  <span className="text-sm">{sub.name}</span>
                  <Badge variant="outline">
                    {new Date(sub.nextBillingDate).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}