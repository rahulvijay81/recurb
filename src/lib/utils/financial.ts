import { Subscription } from "@/lib/schemas/subscription";

export function calculateMRR(subscriptions: Subscription[]): number {
  return subscriptions.reduce((total, sub) => {
    switch (sub.billingCycle) {
      case "monthly": return total + sub.amount;
      case "quarterly": return total + (sub.amount / 3);
      case "yearly": return total + (sub.amount / 12);
      default: return total;
    }
  }, 0);
}

export function calculateYRR(subscriptions: Subscription[]): number {
  return calculateMRR(subscriptions) * 12;
}

export function getCategorySpend(subscriptions: Subscription[]): Record<string, number> {
  return subscriptions.reduce((acc, sub) => {
    const category = sub.category || "Uncategorized";
    const monthlyAmount = sub.billingCycle === "monthly" ? sub.amount :
                         sub.billingCycle === "quarterly" ? sub.amount / 3 :
                         sub.billingCycle === "yearly" ? sub.amount / 12 : 0;
    acc[category] = (acc[category] || 0) + monthlyAmount;
    return acc;
  }, {} as Record<string, number>);
}

export function getUpcomingRenewals(subscriptions: Subscription[], days = 30): Subscription[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);
  
  return subscriptions.filter(sub => 
    sub.autoRenew && new Date(sub.nextBillingDate) <= cutoff
  ).sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());
}

export function detectDuplicates(subscriptions: Subscription[]): Subscription[][] {
  const groups: Record<string, Subscription[]> = {};
  
  subscriptions.forEach(sub => {
    const key = `${sub.name.toLowerCase()}-${sub.vendor?.toLowerCase() || ''}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(sub);
  });
  
  return Object.values(groups).filter(group => group.length > 1);
}

export function getVendorSummaries(subscriptions: Subscription[]) {
  const vendors: Record<string, { count: number; total: number }> = {};
  
  subscriptions.forEach(sub => {
    const vendor = sub.vendor || "Unknown";
    const monthlyAmount = sub.billingCycle === "monthly" ? sub.amount :
                         sub.billingCycle === "quarterly" ? sub.amount / 3 :
                         sub.billingCycle === "yearly" ? sub.amount / 12 : 0;
    
    if (!vendors[vendor]) vendors[vendor] = { count: 0, total: 0 };
    vendors[vendor].count++;
    vendors[vendor].total += monthlyAmount;
  });
  
  return Object.entries(vendors).map(([vendor, data]) => ({
    vendor,
    subscriptionCount: data.count,
    totalAmount: data.total
  }));
}