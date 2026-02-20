"use client";

import { create } from "zustand";
import { User } from "@/lib/schemas/user";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  updateProfile: (data: { name: string; email: string; company?: string; phone?: string; timezone?: string; currency?: string }) => Promise<void>;
  logout: () => void;
  
  // Feature access
  canAccessFeature: (feature: string) => boolean;
  // Role-based permissions
  canEdit: () => boolean;
  canDelete: () => boolean;
  canManageTeam: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
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
    });
    window.location.href = "/auth/login";
  },
  
  canAccessFeature: (feature) => {
    return true;
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