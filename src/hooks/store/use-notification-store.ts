"use client";

import { create } from "zustand";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  
  fetchNotifications: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/notifications');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch notifications' }));
        throw new Error(errorData.error || 'Failed to fetch notifications');
      }
      
      const result = await response.json();
      const notifications = result.data || [];
      const unreadCount = notifications.filter((n: Notification) => !n.read).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
    }
  },
  
  markAsRead: async (id) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to mark notification as read' }));
        throw new Error(errorData.error || 'Failed to mark notification as read');
      }
      
      set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message });
    }
  },
  
  markAllAsRead: async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to mark all as read' }));
        throw new Error(errorData.error || 'Failed to mark all as read');
      }
      
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message });
    }
  },
  
  setError: (error) => set({ error }),
}));