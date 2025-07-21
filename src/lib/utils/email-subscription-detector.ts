import { Subscription } from "@/lib/schemas/subscription";

// Common subscription services and their patterns
const SUBSCRIPTION_PATTERNS = [
  { name: "Netflix", domains: ["netflix.com"], amount: 15.49, cycle: "monthly" as const },
  { name: "Spotify", domains: ["spotify.com"], amount: 9.99, cycle: "monthly" as const },
  { name: "Adobe Creative Cloud", domains: ["adobe.com"], amount: 52.99, cycle: "monthly" as const },
  { name: "Microsoft 365", domains: ["microsoft.com", "office.com"], amount: 6.99, cycle: "monthly" as const },
  { name: "Google Workspace", domains: ["google.com", "workspace.google.com"], amount: 6.00, cycle: "monthly" as const },
  { name: "Dropbox", domains: ["dropbox.com"], amount: 9.99, cycle: "monthly" as const },
  { name: "Slack", domains: ["slack.com"], amount: 6.67, cycle: "monthly" as const },
  { name: "Zoom", domains: ["zoom.us"], amount: 14.99, cycle: "monthly" as const },
  { name: "GitHub", domains: ["github.com"], amount: 4.00, cycle: "monthly" as const },
  { name: "Figma", domains: ["figma.com"], amount: 12.00, cycle: "monthly" as const },
];

export interface DetectedSubscription {
  name: string;
  vendor: string;
  amount: number;
  billingCycle: "monthly" | "quarterly" | "yearly";
  category: string;
  confidence: number;
}

export function detectSubscriptionsFromEmails(emails: string[]): DetectedSubscription[] {
  const detected: DetectedSubscription[] = [];
  const seenServices = new Set<string>();

  for (const email of emails) {
    const fromDomain = extractDomain(email);
    if (!fromDomain) continue;

    for (const pattern of SUBSCRIPTION_PATTERNS) {
      if (pattern.domains.some(domain => fromDomain.includes(domain)) && !seenServices.has(pattern.name)) {
        detected.push({
          name: pattern.name,
          vendor: pattern.name,
          amount: pattern.amount,
          billingCycle: pattern.cycle,
          category: getCategoryForService(pattern.name),
          confidence: 0.8,
        });
        seenServices.add(pattern.name);
      }
    }
  }

  return detected;
}

function extractDomain(email: string): string | null {
  const match = email.match(/@([^@]+)/);
  return match ? match[1].toLowerCase() : null;
}

function getCategoryForService(serviceName: string): string {
  const categories: Record<string, string> = {
    "Netflix": "Entertainment",
    "Spotify": "Entertainment", 
    "Adobe Creative Cloud": "Software",
    "Microsoft 365": "Software",
    "Google Workspace": "Software",
    "Dropbox": "Storage",
    "Slack": "Communication",
    "Zoom": "Communication",
    "GitHub": "Development",
    "Figma": "Design",
  };
  return categories[serviceName] || "Other";
}