"use client";

import { create } from "zustand";
import { TeamMember } from "@/lib/schemas/user";
import { logActivity } from "@/lib/utils/audit";

interface TeamState {
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMembers: (members: TeamMember[]) => void;
  fetchMembers: () => Promise<void>;
  addMember: (member: TeamMember) => Promise<void>;
  updateMember: (id: string, updates: Partial<TeamMember>) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  members: [],
  isLoading: false,
  error: null,
  
  setMembers: (members) => set({ members, error: null }),
  
  fetchMembers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/team/members');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch team members' }));
        throw new Error(errorData.error || 'Failed to fetch team members');
      }
      
      const result = await response.json();
      const members = result.data || [];
      set({ members, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
    }
  },
  
  addMember: async (member) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/team/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add team member' }));
        throw new Error(errorData.error || 'Failed to add team member');
      }
      
      const result = await response.json();
      const newMember = result.data || member;
      
      logActivity("invite", "team_member", newMember.id, `Invited team member: ${member.email}`);
      set((state) => ({
        members: [...state.members, newMember],
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  
  updateMember: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/team/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update team member' }));
        throw new Error(errorData.error || 'Failed to update team member');
      }
      
      const member = get().members.find(m => m.id === id);
      if (member && updates.role) {
        logActivity("change_role", "team_member", id, `Changed role for ${member.email} to ${updates.role}`);
      }
      
      set((state) => ({
        members: state.members.map(member => 
          member.id === id ? { ...member, ...updates } : member
        ),
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  
  removeMember: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/team/members/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to remove team member' }));
        throw new Error(errorData.error || 'Failed to remove team member');
      }
      
      const member = get().members.find(m => m.id === id);
      if (member) {
        logActivity("remove_member", "team_member", id, `Removed team member: ${member.email}`);
      }
      
      set((state) => ({
        members: state.members.filter(member => member.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
}));