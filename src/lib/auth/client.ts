"use client";

import { User } from "@/lib/schemas/user";

const USER_STORAGE_KEY = "recurb_user";

export const authClient = {
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  setUser(user: User | null): void {
    if (typeof window === "undefined") return;
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  clearUser(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  isAuthenticated(): boolean {
    return this.getUser() !== null;
  },

  canEdit(): boolean {
    const user = this.getUser();
    return user?.role !== "viewer";
  },

  canDelete(): boolean {
    const user = this.getUser();
    return user?.role !== "viewer";
  },

  canManageTeam(): boolean {
    const user = this.getUser();
    return user?.role === "owner" || user?.role === "admin";
  },

  async updateProfile(data: { name: string; email: string; company?: string; phone?: string; timezone?: string; currency?: string }): Promise<void> {
    const user = this.getUser();
    if (!user) throw new Error("Not authenticated");

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
    this.setUser(updatedUser);
  },

  logout(): void {
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.clearUser();
    window.location.href = "/auth/login";
  },
};
