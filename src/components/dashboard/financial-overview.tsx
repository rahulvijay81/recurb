"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle>Category Breakdown</CardTitle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Monthly spending by category</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(categorySpend).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm">{category}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary">${amount.toFixed(2)}/mo</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Monthly spend in {category}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {upcomingRenewals.length > 0 && (
        <Card>
          <CardHeader>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle>Upcoming Renewals</CardTitle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Subscriptions renewing in the next 30 days</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingRenewals.slice(0, 5).map((sub) => (
                <div key={sub.id} className="flex justify-between items-center">
                  <span className="text-sm">{sub.name}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline">
                        {formatDate(sub.nextBillingDate)}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Next billing: {formatDate(sub.nextBillingDate)}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}