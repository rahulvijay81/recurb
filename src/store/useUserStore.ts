import { create } from 'zustand';
import { UserType } from '@/lib/types';

interface UserState {
  user: UserType | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserType | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearUser: () => set({ user: null, error: null }),
}));