"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/hooks/store/use-subscription-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Calendar, DollarSign, Building, Tag } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { SharedNotes } from "@/components/team/shared-notes";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { formatDate } from "@/lib/utils/date";
import { Subscription } from "@/lib/schemas/subscription";

export default function SubscriptionDetailsPage() {
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

  if (isLoading) {
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

  if (!subscription) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Subscription not found</p>
            <Button asChild className="mt-4">
              <Link href="/subscriptions">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Subscriptions
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/subscriptions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{subscription.name}</h1>
            <p className="text-muted-foreground">
              Subscription details and information
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/subscriptions/${subscription.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">
                ${subscription.amount.toFixed(2)} {subscription.currency}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Billing Cycle</p>
              <p className="capitalize">{subscription.billingCycle}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Next Billing Date</p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(subscription.nextBillingDate)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Auto-Renewal</p>
              <Badge variant={subscription.autoRenew ? "default" : "outline"} className={subscription.autoRenew ? "bg-green-500" : ""}>
                {subscription.autoRenew ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscription.vendor && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendor</p>
                <p>{subscription.vendor}</p>
              </div>
            )}
            {subscription.category && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <Badge variant="outline">{subscription.category}</Badge>
              </div>
            )}
            {subscription.tags && subscription.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {subscription.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {subscription.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{subscription.notes}</p>
            </CardContent>
          </Card>
        )}
        
        {(
          <div className="md:col-span-2">
            <SharedNotes subscriptionId={subscription.id!} />
          </div>
        )}
      </div>
    </div>
  );
}