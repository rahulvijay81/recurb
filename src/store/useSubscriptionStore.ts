import { create } from 'zustand';
import { SubscriptionType } from '@/lib/types';

interface SubscriptionState {
  subscriptions: SubscriptionType[];
  isLoading: boolean;
  error: string | null;
  setSubscriptions: (subscriptions: SubscriptionType[]) => void;
  addSubscription: (subscription: SubscriptionType) => void;
  updateSubscription: (id: string, updatedSubscription: Partial<SubscriptionType>) => void;
  deleteSubscription: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscriptions: [],
  isLoading: false,
  error: null,
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  addSubscription: (subscription) => 
    set((state) => ({ 
      subscriptions: [...state.subscriptions, subscription] 
    })),
  updateSubscription: (id, updatedSubscription) => 
    set((state) => ({ 
      subscriptions: state.subscriptions.map(sub => 
        sub.id === id ? { ...sub, ...updatedSubscription } : sub
      ) 
    })),
  deleteSubscription: (id) => 
    set((state) => ({ 
      subscriptions: state.subscriptions.filter(sub => sub.id !== id) 
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));