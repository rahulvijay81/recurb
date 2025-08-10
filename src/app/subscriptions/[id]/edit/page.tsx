"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/hooks/store/use-subscription-store";
import { SubscriptionForm } from "@/components/subscriptions/subscription-form";
import { Subscription } from "@/lib/schemas/subscription";

export default function EditSubscriptionPage() {
  const params = useParams();
  const router = useRouter();
  const { subscriptions, isLoading } = useSubscriptionStore();
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const subscriptionId = params.id as string;

  useEffect(() => {
    if (!isLoading && subscriptions.length > 0) {
      const found = subscriptions.find(sub => sub.id === subscriptionId);
      if (found) {
        setSubscription(found);
      } else {
        router.push("/subscriptions");
      }
    }
  }, [subscriptionId, subscriptions, isLoading, router]);

  if (isLoading || !subscription) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Subscription</h1>
        <p className="text-muted-foreground">
          Update the details for your recurring expense.
        </p>
      </div>
      
      <div className="border rounded-md p-6">
        <SubscriptionForm 
          initialData={{
            name: subscription.name,
            amount: subscription.amount,
            currency: subscription.currency,
            billingCycle: subscription.billingCycle,
            nextBillingDate: subscription.nextBillingDate.toISOString().split('T')[0],
            autoRenew: subscription.autoRenew,
            category: subscription.category,
            tags: subscription.tags,
            notes: subscription.notes,
            vendor: subscription.vendor,
          }}
          isEditing={true}
        />
      </div>
    </div>
  );
}