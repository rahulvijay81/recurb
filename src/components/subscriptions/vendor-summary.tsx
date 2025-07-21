"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Subscription } from "@/lib/schemas/subscription";
import { getVendorSummaries } from "@/lib/utils/financial";

interface VendorSummaryProps {
  subscriptions: Subscription[];
}

export function VendorSummary({ subscriptions }: VendorSummaryProps) {
  const vendorSummaries = getVendorSummaries(subscriptions);
  const totalSpend = vendorSummaries.reduce((sum, vendor) => sum + vendor.totalAmount, 0);

  const sortedVendors = vendorSummaries
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedVendors.map((vendor) => {
            const percentage = totalSpend > 0 ? (vendor.totalAmount / totalSpend) * 100 : 0;
            
            return (
              <div key={vendor.vendor} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{vendor.vendor}</span>
                    <Badge variant="secondary" className="text-xs">
                      {vendor.subscriptionCount} subscription{vendor.subscriptionCount !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${vendor.totalAmount.toFixed(2)}/mo</div>
                    <div className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
          
          {vendorSummaries.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No vendor data available. Add vendor information to your subscriptions.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}