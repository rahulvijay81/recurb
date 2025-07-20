"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, BarChart3, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  
  // Check if user is already logged in
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="));
    
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <CreditCard className="h-6 w-6" />
            <span>Recurb</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Take control of your recurring expenses
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Recurb helps you track, manage, and optimize your subscriptions in one place.
              Never miss a renewal or overpay again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Get started for free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#pricing">
                  View pricing
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful features for every plan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From basic tracking to advanced analytics, Recurb has the tools you need to manage your subscriptions.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Subscription Management</h3>
                <p className="text-muted-foreground">
                  Track all your subscriptions in one place with renewal reminders, auto-renewal flags, and categorization.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Visualize your spending patterns, identify trends, and forecast future expenses with interactive charts.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Share subscription management with your team, add comments, and track changes with detailed audit logs.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing section */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that fits your needs. All plans include core subscription tracking features.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Basic plan */}
              <div className="bg-card p-6 rounded-lg border flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Basic</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">Free</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    For individuals just getting started
                  </p>
                </div>
                
                <ul className="space-y-3 flex-1 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Manual CRUD operations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">CSV import/export</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Auto-renewal flags</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Tags & categories</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">MRR/YRR display</span>
                  </li>
                </ul>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/register">Get started</Link>
                </Button>
              </div>
              
              {/* Pro plan */}
              <div className="bg-card p-6 rounded-lg border border-primary flex flex-col relative">
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Pro</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$9.99</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    For power users who need more insights
                  </p>
                </div>
                
                <ul className="space-y-3 flex-1 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Everything in Basic</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Monthly breakdowns</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Trends & forecasting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Duplicate detection</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Invoice upload & linkage</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Calendar view</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Vendor summaries</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Custom reminders</span>
                  </li>
                </ul>
                
                <Button asChild className="w-full">
                  <Link href="/auth/register">Start free trial</Link>
                </Button>
              </div>
              
              {/* Team plan */}
              <div className="bg-card p-6 rounded-lg border flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl font-bold">Team</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-bold">$19.99</span>
                    <span className="ml-1 text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    For teams who manage subscriptions together
                  </p>
                </div>
                
                <ul className="space-y-3 flex-1 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Team management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Shared notes & comments</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Audit logs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    <span className="text-sm">Slack/Discord webhooks</span>
                  </li>
                </ul>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/register">Contact sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 font-semibold mb-4 md:mb-0">
              <CreditCard className="h-5 w-5" />
              <span>Recurb</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Recurb. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}