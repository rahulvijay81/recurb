import { User } from "../schemas/user";
import { Subscription } from "../schemas/subscription";

export type Plan = "free" | "pro" | "team";

export type PlanFeatures = {
  [key in Plan]: string[];
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface SubscriptionStats {
  totalActive: number;
  totalAmount: number;
  monthlyRecurring: number;
  yearlyRecurring: number;
  upcomingRenewals: Subscription[];
  byCategory: Record<string, number>;
}

export interface SubscriptionTrend {
  month: string;
  amount: number;
}

export interface VendorSummary {
  vendor: string;
  subscriptionCount: number;
  totalAmount: number;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  timestamp: Date;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}