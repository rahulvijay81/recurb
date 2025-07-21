"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Subscription } from "@/lib/schemas/subscription";
import { calculateMRR, calculateYRR, getCategorySpend, getUpcomingRenewals } from "@/lib/utils/financial";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { formatDate } from "@/lib/utils/date";

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
    <div className="grid gap-4 md:grid-cols-2">
      {canAccessFeature("monthly_breakdowns") && (
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingRenewals.slice(0, 5).map((sub) => (
                <div key={sub.id} className="flex justify-between items-center">
                  <span className="text-sm">{sub.name}</span>
                  <Badge variant="outline">
                    {formatDate(sub.nextBillingDate)}
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