import { Subscription } from "@/lib/schemas/subscription";
import { calculateMRR, getCategorySpend, getVendorSummaries } from "./financial";

export function exportToCSV(subscriptions: Subscription[], includeAnalytics = false) {
  const headers = [
    'Name',
    'Amount',
    'Currency',
    'Billing Cycle',
    'Next Billing Date',
    'Auto Renew',
    'Category',
    'Tags',
    'Vendor',
    'Notes'
  ];

  if (includeAnalytics) {
    headers.push('Monthly Amount', 'Annual Amount');
  }

  const rows = subscriptions.map(sub => {
    const monthlyAmount = sub.billingCycle === 'monthly' ? sub.amount :
                         sub.billingCycle === 'quarterly' ? sub.amount / 3 :
                         sub.billingCycle === 'yearly' ? sub.amount / 12 : 0;
    
    const row = [
      sub.name,
      sub.amount.toString(),
      sub.currency,
      sub.billingCycle,
      new Date(sub.nextBillingDate).toLocaleDateString(),
      sub.autoRenew ? 'Yes' : 'No',
      sub.category || '',
      sub.tags?.join(', ') || '',
      sub.vendor || '',
      sub.notes || ''
    ];

    if (includeAnalytics) {
      row.push(monthlyAmount.toFixed(2), (monthlyAmount * 12).toFixed(2));
    }

    return row;
  });

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}

export function exportToJSON(subscriptions: Subscription[], includeAnalytics = false) {
  const data = {
    subscriptions,
    exportDate: new Date().toISOString(),
    totalSubscriptions: subscriptions.length
  };

  if (includeAnalytics) {
    Object.assign(data, {
      analytics: {
        mrr: calculateMRR(subscriptions),
        yrr: calculateMRR(subscriptions) * 12,
        categoryBreakdown: getCategorySpend(subscriptions),
        vendorSummary: getVendorSummaries(subscriptions)
      }
    });
  }

  return JSON.stringify(data, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}