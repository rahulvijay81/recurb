"use client";

import { create } from "zustand";
import { AuditLog } from "@/lib/schemas/audit";

interface AuditState {
  logs: AuditLog[];
  isLoading: boolean;
  
  // Actions
  addLog: (log: Omit<AuditLog, "id" | "timestamp">) => void;
  setLogs: (logs: AuditLog[]) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  logs: [],
  isLoading: false,
  
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
  
  setLogs: (logs) => set({ logs }),
  setLoading: (isLoading) => set({ isLoading }),
}));