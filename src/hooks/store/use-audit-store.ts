"use client";

import { create } from "zustand";
import { AuditLog } from "@/lib/schemas/audit";

interface AuditState {
  logs: AuditLog[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addLog: (log: Omit<AuditLog, "id" | "timestamp">) => void;
  setLogs: (logs: AuditLog[]) => void;
  fetchLogs: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  logs: [],
  isLoading: false,
  error: null,
  
  addLog: (logData) => {
    const log: AuditLog = {
      ...logData,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    
    set((state) => ({
      logs: [log, ...state.logs]
    }));
  },
  
  setLogs: (logs) => set({ logs, error: null }),
  
  fetchLogs: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/audit/logs');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch audit logs' }));
        throw new Error(errorData.error || 'Failed to fetch audit logs');
      }
      
      const result = await response.json();
      const logs = result.data || [];
      set({ logs, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
}));