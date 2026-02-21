"use client";

import { create } from "zustand";
import { User } from "@/lib/schemas/user";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateProfile: (data: { name: string; email: string; company?: string; phone?: string; timezone?: string; currency?: string }) => Promise<void>;
  logout: () => void;
  
  // Role-based permissions
  canEdit: () => boolean;
  canDelete: () => boolean;
  canManageTeam: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    error: null,
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  updateProfile: async (data) => {
    const { user } = get();
    if (!user) return;
    
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update profile' }));
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      const result = await response.json();
      const updatedUser = result.data || { ...user, ...data };
      set({ user: updatedUser, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
      throw error;
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