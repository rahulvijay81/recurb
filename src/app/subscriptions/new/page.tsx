"use client";

import { SubscriptionForm } from "@/components/subscriptions/subscription-form";

export default function NewSubscriptionPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add Subscription</h1>
        <p className="text-muted-foreground">
          Create a new subscription to track your recurring expenses.
        </p>
      </div>
      
      <div className="border rounded-md p-6">
        <SubscriptionForm />
      </div>
    </div>
  );
}