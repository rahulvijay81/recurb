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
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: "1",
      title: "Subscription Renewal",
      message: "Netflix subscription renews in 3 days",
      type: "warning",
      read: false,
      createdAt: new Date(),
    },
    {
      id: "2", 
      title: "Payment Failed",
      message: "Spotify payment failed - update card",
      type: "error",
      read: false,
      createdAt: new Date(),
    },
  ],
  unreadCount: 2,
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: state.unreadCount - 1,
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),
}));