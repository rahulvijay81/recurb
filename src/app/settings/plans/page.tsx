"use client";

import { useState } from "react";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PlansPage() {
  const { plan, setUser, user } = useAuthStore();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const router = useRouter();
  
  const handleUpgrade = async (newPlan: string) => {
    if (newPlan === plan) return;
    
    setIsUpgrading(true);
    
    try {
      // In a real app, this would be an API call to upgrade the plan
      // For demo purposes, we'll just update the user in the store
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (user) {
        setUser({
          ...user,
          plan: newPlan as "free" | "basic" | "pro" | "team",
        });
        
        toast.success(`Successfully upgraded to ${newPlan} plan`);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to upgrade plan");
    } finally {
      setIsUpgrading(false);
    }
  };
  
  const plans = [
    {
      name: "Free",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Up to 5 subscriptions",
        "Basic CRUD operations",
        "Tags & categories",
      ],
      current: plan === "free",
    },
    {
      name: "Basic",
      price: "$9/month",
      description: "For individuals managing more subscriptions",
      features: [
        "Unlimited subscriptions",
        "Everything in Free",
        "Auto-renewal flags",
        "CSV import/export",
        "MRR/YRR display",
        "Email support",
      ],
      current: plan === "basic",
    },
    {
      name: "Pro",
      price: "$29.99/month",
      description: "For power users who need insights",
      features: [
        "Everything in Basic",
        "Monthly breakdowns",
        "Trends & forecasting",
        "Duplicate detection",
        "Invoice upload & linkage",
        "Calendar view",
        "Vendor summaries",
        "Custom reminders",
      ],
      current: plan === "pro",
      popular: true,
    },
    {
      name: "Team",
      price: "$49.99/month",
      description: "For teams managing subscriptions together",
      features: [
        "Everything in Pro",
        "Team management",
        "Shared notes & comments",
        "Audit logs",
        "Slack/Discord webhooks",
      ],
      current: plan === "team",
    },
  ];
  
  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
        <p className="text-muted-foreground">
          Choose the plan that fits your needs.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((planOption) => (
          <Card
            key={planOption.name.toLowerCase()}
            className={`relative flex flex-col ${
              planOption.popular ? "border-primary" : ""
            } ${planOption.current ? "bg-muted/50" : ""}`}
          >
            {planOption.popular && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{planOption.name}</span>
                <span className="text-lg">{planOption.price}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {planOption.description}
              </p>
            </CardHeader>
            
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {planOption.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full"
                variant={planOption.current ? "outline" : "default"}
                disabled={planOption.current || isUpgrading}
                onClick={() => handleUpgrade(planOption.name.toLowerCase())}
              >
                {isUpgrading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Upgrading...
                  </>
                ) : planOption.current ? (
                  "Current Plan"
                ) : (
                  <>
                    {plan === "basic" ? "Upgrade" : "Switch"} to {planOption.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 p-4 border rounded-md bg-muted/50">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This is a demo application. In a real application, upgrading would
          involve payment processing and actual subscription management.
        </p>
      </div>
    </div>
  );
}