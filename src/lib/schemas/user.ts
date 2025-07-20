import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  plan: z.enum(["basic", "pro", "team"]).default("basic"),
  createdAt: z.date(),
  updatedAt: z.date(),
  teamId: z.string().optional(),
  role: z.enum(["owner", "admin", "member"]).optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().default("USD"),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Name is required"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const teamMemberSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["owner", "admin", "member"]),
  invitedAt: z.date().optional(),
  joinedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;