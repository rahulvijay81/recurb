"use client";

import { create } from "zustand";
import { Note } from "@/lib/schemas/note";

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setNotes: (notes: Note[]) => void;
  fetchNotes: (subscriptionId?: string) => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  getNotesBySubscription: (subscriptionId: string) => Note[];
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,
  
  setNotes: (notes) => set({ notes, error: null }),
  
  fetchNotes: async (subscriptionId) => {
    try {
      set({ isLoading: true, error: null });
      const url = subscriptionId 
        ? `/api/notes?subscriptionId=${subscriptionId}` 
        : '/api/notes';
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch notes' }));
        throw new Error(errorData.error || 'Failed to fetch notes');
      }
      
      const result = await response.json();
      const notes = result.data || [];
      set({ notes, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
    }
  },
  
  addNote: async (note) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to add note' }));
        throw new Error(errorData.error || 'Failed to add note');
      }
      
      const result = await response.json();
      const newNote = result.data || note;
      
      set((state) => ({
        notes: [...state.notes, newNote],
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  
  getNotesBySubscription: (subscriptionId) => {
    return get().notes.filter(note => note.subscriptionId === subscriptionId);
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
}));