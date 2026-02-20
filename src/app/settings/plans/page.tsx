"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function PlansPage() {
  const features = [
    "Unlimited subscriptions",
    "CSV import/export",
    "Auto-renewal flags",
    "Tags & categories",
    "MRR/YRR display",
    "Monthly breakdowns",
    "Trends & forecasting",
    "Duplicate detection",
    "Invoice upload & linkage",
    "Calendar view",
    "Vendor summaries",
    "Custom reminders",
    "Email detection",
    "Team management",
    "Shared notes & comments",
    "Audit logs",
    "Slack/Discord webhooks",
  ];
  
  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Open Source Plan</h1>
        <p className="text-muted-foreground">
          All features are available for free.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Free & Open Source</span>
              <span className="text-lg">$0</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              All features included, no restrictions
            </p>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 p-4 border rounded-md bg-muted/50 max-w-2xl mx-auto">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This is an open-source application. All features are available
          for free with no restrictions. You can self-host and customize as needed.
        </p>
      </div>
    </div>
  );
}