"use client";

import { create } from "zustand";
import { Note } from "@/lib/schemas/note";

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  
  // Actions
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  getNotesBySubscription: (subscriptionId: string) => Note[];
  setLoading: (isLoading: boolean) => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: false,
  
  setNotes: (notes) => set({ notes }),
  
  addNote: (note) => set((state) => ({
    notes: [...state.notes, note]
  })),
  
  getNotesBySubscription: (subscriptionId) => {
    return get().notes.filter(note => note.subscriptionId === subscriptionId);
  },
  
  setLoading: (isLoading) => set({ isLoading }),
}));