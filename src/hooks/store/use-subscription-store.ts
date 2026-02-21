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
  fetchSubscriptions: () => Promise<void>;
  addSubscription: (subscription: Subscription) => Promise<void>;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
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
  
  setSubscriptions: (subscriptions) => {
    categoriesCache = null;
    tagsCache = null;
    vendorsCache = null;
    lastSubscriptionsHash = null;
    set({ subscriptions, error: null });
  },
  
  fetchSubscriptions: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/subscriptions');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch subscriptions' }));
        throw new Error(errorData.error || 'Failed to fetch subscriptions');
      }
      
      const result = await response.json();
      console.log('Raw API data:', result.data);
      
      const subscriptions = (result.data || []).map((sub: any) => ({
        id: sub.id?.toString(),
        name: sub.name,
        amount: sub.amount,
        currency: sub.currency,
        billingCycle: sub.billing_cycle,
        category: sub.category,
        vendor: sub.vendor,
        tags: sub.tags ? JSON.parse(sub.tags) : [],
        nextBillingDate: sub.next_billing_date ? new Date(sub.next_billing_date) : new Date(),
        autoRenew: Boolean(sub.auto_renew),
        notes: sub.notes,
        invoiceUrl: sub.invoice_url,
        userId: sub.user_id?.toString(),
        organizationId: sub.organization_id,
        createdAt: new Date(sub.created_at),
        updatedAt: new Date(sub.updated_at),
      }));
      
      console.log('Mapped subscriptions:', subscriptions);
      get().setSubscriptions(subscriptions);
      set({ isLoading: false });
    } catch (error) {
      console.error('Fetch subscriptions error:', error);
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
    }
  },
  
  addSubscription: async (subscription) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create subscription' }));
        throw new Error(errorData.error || 'Failed to create subscription');
      }
      
      const result = await response.json();
      const newSubscription = result.data || subscription;
      
      logActivity("create", "subscription", newSubscription.id, `Created subscription: ${subscription.name}`);
      categoriesCache = null;
      tagsCache = null;
      vendorsCache = null;
      lastSubscriptionsHash = null;
      set((state) => ({
        subscriptions: [...state.subscriptions, newSubscription],
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  
  updateSubscription: async (id, updatedSubscription) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSubscription),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update subscription' }));
        throw new Error(errorData.error || 'Failed to update subscription');
      }
      
      const result = await response.json();
      const updated = result.data || updatedSubscription;
      
      const subscription = get().subscriptions.find(sub => sub.id === id);
      if (subscription) {
        logActivity("update", "subscription", id, `Updated subscription: ${subscription.name}`);
      }
      
      categoriesCache = null;
      tagsCache = null;
      vendorsCache = null;
      lastSubscriptionsHash = null;
      set((state) => ({
        subscriptions: state.subscriptions.map((sub) =>
          sub.id === id ? { ...sub, ...updated } : sub
        ),
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  
  deleteSubscription: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete subscription' }));
        throw new Error(errorData.error || 'Failed to delete subscription');
      }
      
      const subscription = get().subscriptions.find(sub => sub.id === id);
      if (subscription) {
        logActivity("delete", "subscription", id, `Deleted subscription: ${subscription.name}`);
      }
      
      categoriesCache = null;
      tagsCache = null;
      vendorsCache = null;
      lastSubscriptionsHash = null;
      set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database connection failed';
      set({ error: message, isLoading: false });
      throw error;
    }
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