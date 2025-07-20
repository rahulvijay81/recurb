"use client";

import { create } from "zustand";
import { Subscription } from "@/lib/schemas/subscription";

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  categoryFilter: string | null;
  tagFilter: string | null;
  vendorFilter: string | null;
  searchQuery: string;
  
  // Actions
  setSubscriptions: (subscriptions: Subscription[]) => void;
  addSubscription: (subscription: Subscription) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter actions
  setCategoryFilter: (category: string | null) => void;
  setTagFilter: (tag: string | null) => void;
  setVendorFilter: (vendor: string | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  
  // Getters
  getFilteredSubscriptions: () => Subscription[];
  getSubscriptionById: (id: string) => Subscription | undefined;
  getCategories: () => string[];
  getTags: () => string[];
  getVendors: () => string[];
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  isLoading: false,
  error: null,
  categoryFilter: null,
  tagFilter: null,
  vendorFilter: null,
  searchQuery: "",
  
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  
  addSubscription: (subscription) => set((state) => ({
    subscriptions: [...state.subscriptions, subscription],
  })),
  
  updateSubscription: (id, updatedSubscription) => set((state) => ({
    subscriptions: state.subscriptions.map((sub) =>
      sub.id === id ? { ...sub, ...updatedSubscription } : sub
    ),
  })),
  
  deleteSubscription: (id) => set((state) => ({
    subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  
  setTagFilter: (tag) => set({ tagFilter: tag }),
  
  setVendorFilter: (vendor) => set({ vendorFilter: vendor }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  clearFilters: () => set({
    categoryFilter: null,
    tagFilter: null,
    vendorFilter: null,
    searchQuery: "",
  }),
  
  getFilteredSubscriptions: () => {
    const { 
      subscriptions, 
      categoryFilter, 
      tagFilter, 
      vendorFilter, 
      searchQuery 
    } = get();
    
    return subscriptions.filter((sub) => {
      // Apply category filter
      if (categoryFilter && sub.category !== categoryFilter) {
        return false;
      }
      
      // Apply tag filter
      if (tagFilter && !sub.tags?.includes(tagFilter)) {
        return false;
      }
      
      // Apply vendor filter
      if (vendorFilter && sub.vendor !== vendorFilter) {
        return false;
      }
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          sub.name.toLowerCase().includes(query) ||
          sub.vendor?.toLowerCase().includes(query) ||
          sub.notes?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  },
  
  getSubscriptionById: (id) => {
    return get().subscriptions.find((sub) => sub.id === id);
  },
  
  getCategories: () => {
    const categories = get().subscriptions
      .map((sub) => sub.category)
      .filter((category): category is string => !!category);
    
    return [...new Set(categories)];
  },
  
  getTags: () => {
    const tags = get().subscriptions
      .flatMap((sub) => sub.tags || [])
      .filter((tag) => !!tag);
    
    return [...new Set(tags)];
  },
  
  getVendors: () => {
    const vendors = get().subscriptions
      .map((sub) => sub.vendor)
      .filter((vendor): vendor is string => !!vendor);
    
    return [...new Set(vendors)];
  },
}));