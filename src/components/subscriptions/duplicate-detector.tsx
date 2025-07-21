"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { Subscription } from "@/lib/schemas/subscription";
import { detectDuplicates } from "@/lib/utils/financial";

interface DuplicateDetectorProps {
  subscriptions: Subscription[];
  onMerge?: (duplicates: Subscription[]) => void;
}

export function DuplicateDetector({ subscriptions, onMerge }: DuplicateDetectorProps) {
  const duplicateGroups = detectDuplicates(subscriptions);

  if (duplicateGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-500" />
            Duplicate Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No duplicate subscriptions found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Potential Duplicates Found
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {duplicateGroups.map((group, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Similar Subscriptions</h4>
                <Badge variant="destructive">{group.length} items</Badge>
              </div>
              
              <div className="space-y-2">
                {group.map(sub => (
                  <div key={sub.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{sub.name}</span>
                      {sub.vendor && <span className="text-sm text-muted-foreground ml-2">({sub.vendor})</span>}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${sub.amount}</div>
                      <div className="text-sm text-muted-foreground">{sub.billingCycle}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {onMerge && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => onMerge(group)}
                >
                  Review & Merge
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}