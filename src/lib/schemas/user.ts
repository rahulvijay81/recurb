import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  teamId: z.string().optional(),
  role: z.enum(["owner", "admin", "member", "viewer"]).optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().default("USD"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Name is required"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  company: z.string().optional(),
  currency: z.string().default("USD"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const teamMemberSchema = z.object({
  id: z.string(),
  email: z.string().email("Please enter a valid email address"),
  name: z.string().optional(),
  role: z.enum(["owner", "admin", "member", "viewer"]),
  invitedAt: z.date().optional(),
  joinedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;