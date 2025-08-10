"use client";

import { create } from "zustand";
import { User } from "@/lib/schemas/user";
import { Plan } from "@/lib/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  plan: Plan;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  updateProfile: (data: { name: string; email: string; company?: string; phone?: string; timezone?: string; currency?: string }) => Promise<void>;
  logout: () => void;
  
  // Feature access based on plan
  canAccessFeature: (feature: string) => boolean;
  // Role-based permissions
  canEdit: () => boolean;
  canDelete: () => boolean;
  canManageTeam: () => boolean;
}

const PLAN_FEATURES = {
  free: [
    "manual_crud",
    "tags_categories",
    "subscription_limit_5",
  ],
  basic: [
    "manual_crud",
    "csv_import_export",
    "auto_renewal_flags",
    "tags_categories",
    "mrr_yrr",
  ],
  pro: [
    "manual_crud",
    "csv_import_export",
    "auto_renewal_flags",
    "tags_categories",
    "mrr_yrr",
    "monthly_breakdowns",
    "trends",
    "forecasting",
    "duplicate_detection",
    "invoice_upload",
    "calendar",
    "vendor_summaries",
    "enhanced_exports",
    "custom_reminders",
    "auto_email_detection",
  ],
  team: [
    "manual_crud",
    "csv_import_export",
    "auto_renewal_flags",
    "tags_categories",
    "mrr_yrr",
    "monthly_breakdowns",
    "trends",
    "forecasting",
    "duplicate_detection",
    "invoice_upload",
    "calendar",
    "vendor_summaries",
    "enhanced_exports",
    "custom_reminders",
    "auto_email_detection",
    "team_management",
    "shared_notes",
    "audit_logs",
    "webhooks",
  ],
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  plan: "free",
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    plan: user?.plan || "free",
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  updateProfile: async (data) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...data };
      set({ user: updatedUser });
    }
  },
  
  logout: () => {
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    set({ 
      user: null, 
      isAuthenticated: false,
      plan: "free",
    });
    window.location.href = "/auth/login";
  },
  
  canAccessFeature: (feature) => {
    const { plan } = get();
    return PLAN_FEATURES[plan].includes(feature);
  },
  
  canEdit: () => {
    const { user } = get();
    return user?.role !== "viewer";
  },
  
  canDelete: () => {
    const { user } = get();
    return user?.role !== "viewer";
  },
  
  canManageTeam: () => {
    const { user } = get();
    return user?.role === "owner" || user?.role === "admin";
  },
}));