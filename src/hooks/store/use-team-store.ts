"use client";

import { create } from "zustand";
import { TeamMember } from "@/lib/schemas/user";

interface TeamState {
  members: TeamMember[];
  isLoading: boolean;
  
  // Actions
  setMembers: (members: TeamMember[]) => void;
  addMember: (member: TeamMember) => void;
  updateMember: (id: string, updates: Partial<TeamMember>) => void;
  removeMember: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  members: [
    {
      id: "1",
      email: "owner@example.com",
      name: "John Doe",
      role: "owner" as const,
      joinedAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      email: "admin@example.com",
      name: "Jane Smith",
      role: "admin" as const,
      joinedAt: new Date("2024-01-15"),
    },
    {
      id: "3",
      email: "member@example.com",
      role: "member" as const,
      invitedAt: new Date("2024-02-01"),
    },
  ],
  isLoading: false,
  
  setMembers: (members) => set({ members }),
  
  addMember: (member) => set((state) => ({
    members: [...state.members, member]
  })),
  
  updateMember: (id, updates) => set((state) => ({
    members: state.members.map(member => 
      member.id === id ? { ...member, ...updates } : member
    )
  })),
  
  removeMember: (id) => set((state) => ({
    members: state.members.filter(member => member.id !== id)
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
}));