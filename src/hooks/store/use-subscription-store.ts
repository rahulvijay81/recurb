"use client";

import { create } from "zustand";
import { Subscription } from "@/lib/schemas/subscription";
import { logActivity } from "@/lib/utils/audit";

// Memoization cache for expensive operations
let categoriesCache: string[] | null = null;
let tagsCache: string[] | null = null;
let vendorsCache: string[] | null = null;
let lastSubscriptionsHash: string | null = null;

function hashSubscriptions(subscriptions: Subscription[]): string {
  return JSON.stringify(subscriptions.map(s => ({ id: s.id, category: s.category, tags: s.tags, vendor: s.vendor })));
}

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
  subscriptions: [
    {
      id: "sub-1",
      name: "Netflix",
      amount: 15.99,
      currency: "USD",
      billingCycle: "monthly" as const,
      nextBillingDate: new Date("2024-02-15"),
      autoRenew: true,
      category: "Entertainment",
      tags: ["streaming", "video"],
      vendor: "Netflix Inc.",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      userId: "user-1",
    },
    {
      id: "sub-2",
      name: "Slack",
      amount: 8.00,
      currency: "USD",
      billingCycle: "monthly" as const,
      nextBillingDate: new Date("2024-02-20"),
      autoRenew: true,
      category: "Productivity",
      tags: ["communication", "team"],
      vendor: "Slack Technologies",
      createdAt: new Date("2024-01-05"),
      updatedAt: new Date("2024-01-05"),
      userId: "user-1",
    },
  ],
  isLoading: false,
  error: null,
  categoryFilter: null,
  tagFilter: null,
  vendorFilter: null,
  searchQuery: "",
  
  setSubscriptions: (subscriptions) => {
    // Clear cache when subscriptions change
    categoriesCache = null;
    tagsCache = null;
    vendorsCache = null;
    lastSubscriptionsHash = null;
    set({ subscriptions });
  },
  
  addSubscription: (subscription) => {
    const subscriptionWithId = {
      ...subscription,
      id: subscription.id || `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    logActivity("create", "subscription", subscriptionWithId.id, `Created subscription: ${subscription.name}`);
    // Clear cache when subscriptions change
    categoriesCache = null;
    tagsCache = null;
    vendorsCache = null;
    lastSubscriptionsHash = null;
    set((state) => ({
      subscriptions: [...state.subscriptions, subscriptionWithId],
    }));
  },
  
  updateSubscription: (id, updatedSubscription) => {
    const subscription = get().subscriptions.find(sub => sub.id === id);
    if (subscription) {
      logActivity("update", "subscription", id, `Updated subscription: ${subscription.name}`);
    }
    // Clear cache when subscriptions change
    categoriesCache = null;
    tagsCache = null;
    vendorsCache = null;
    lastSubscriptionsHash = null;
    set((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, ...updatedSubscription } : sub
      ),
    }));
  },
  
  deleteSubscription: (id) => {
    const subscription = get().subscriptions.find(sub => sub.id === id);
    if (subscription) {
      logActivity("delete", "subscription", id, `Deleted subscription: ${subscription.name}`);
    }
    // Clear cache when subscriptions change
    categoriesCache = null;
    tagsCache = null;
    vendorsCache = null;
    lastSubscriptionsHash = null;
    set((state) => ({
      subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
    }));
  },
  
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
    const subscriptions = get().subscriptions;
    const currentHash = hashSubscriptions(subscriptions);
    
    if (categoriesCache && lastSubscriptionsHash === currentHash) {
      return categoriesCache;
    }
    
    const categories = subscriptions
      .map((sub) => sub.category)
      .filter((category): category is string => !!category);
    
    categoriesCache = [...new Set(categories)];
    lastSubscriptionsHash = currentHash;
    return categoriesCache;
  },
  
  getTags: () => {
    const subscriptions = get().subscriptions;
    const currentHash = hashSubscriptions(subscriptions);
    
    if (tagsCache && lastSubscriptionsHash === currentHash) {
      return tagsCache;
    }
    
    const tags = subscriptions
      .flatMap((sub) => sub.tags || [])
      .filter((tag) => !!tag);
    
    tagsCache = [...new Set(tags)];
    lastSubscriptionsHash = currentHash;
    return tagsCache;
  },
  
  getVendors: () => {
    const subscriptions = get().subscriptions;
    const currentHash = hashSubscriptions(subscriptions);
    
    if (vendorsCache && lastSubscriptionsHash === currentHash) {
      return vendorsCache;
    }
    
    const vendors = subscriptions
      .map((sub) => sub.vendor)
      .filter((vendor): vendor is string => !!vendor);
    
    vendorsCache = [...new Set(vendors)];
    lastSubscriptionsHash = currentHash;
    return vendorsCache;
  },
}));