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
  logout: () => void;
  
  // Feature access based on plan
  canAccessFeature: (feature: string) => boolean;
}

const PLAN_FEATURES = {
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
    "team_management",
    "shared_notes",
    "audit_logs",
    "webhooks",
  ],
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  plan: "basic",
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    plan: user?.plan || "basic",
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false,
    plan: "basic",
  }),
  
  canAccessFeature: (feature) => {
    const { plan } = get();
    return PLAN_FEATURES[plan].includes(feature);
  },
}));