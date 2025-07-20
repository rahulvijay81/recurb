import { z } from "zod";

export const subscriptionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Subscription name is required"),
  amount: z.number().min(0, "Amount must be a positive number"),
  currency: z.string().default("USD"),
  billingCycle: z.enum(["monthly", "quarterly", "yearly", "custom"]),
  nextBillingDate: z.date(),
  autoRenew: z.boolean().default(true),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  vendor: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  userId: z.string().optional(),
  invoiceUrls: z.array(z.string()).optional(),
});

export const subscriptionFormSchema = subscriptionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
}).extend({
  nextBillingDate: z.string().min(1, "Next billing date is required"),
  amount: z.string().min(1, "Amount is required").transform(val => parseFloat(val)),
  tags: z.string().optional().transform(val => val ? val.split(",").map(tag => tag.trim()) : []),
});

export const csvImportSchema = z.array(
  z.object({
    name: z.string().min(1, "Subscription name is required"),
    amount: z.string().transform(val => parseFloat(val)),
    currency: z.string().default("USD"),
    billingCycle: z.enum(["monthly", "quarterly", "yearly", "custom"]),
    nextBillingDate: z.string().transform(val => new Date(val)),
    autoRenew: z.string().transform(val => val.toLowerCase() === "true"),
    category: z.string().optional(),
    tags: z.string().optional().transform(val => val ? val.split(",").map(tag => tag.trim()) : []),
    notes: z.string().optional(),
    vendor: z.string().optional(),
  })
);

export type Subscription = z.infer<typeof subscriptionSchema>;
export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;
export type CsvImportRow = z.infer<typeof csvImportSchema>[number];