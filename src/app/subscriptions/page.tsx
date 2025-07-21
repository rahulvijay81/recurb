"use client";

import { useState, useEffect } from "react";
import { useSubscriptionStore } from "@/hooks/store/use-subscription-store";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { toast } from "@/lib/utils/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  CreditCard,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmailInboxScanner } from "@/components/subscriptions/EmailInboxScanner";
import { SimpleEmailInput } from "@/components/subscriptions/SimpleEmailInput";

export default function SubscriptionsPage() {
  const {
    subscriptions,
    isLoading,
    setSubscriptions,
    setLoading,
    setCategoryFilter,
    setTagFilter,
    setVendorFilter,
    setSearchQuery,
    clearFilters,
    getFilteredSubscriptions,
    getCategories,
    getTags,
    getVendors,
    deleteSubscription,
  } = useSubscriptionStore();
  
  const { canAccessFeature } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null);
  
  // Simulate fetching subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use mock data
        const mockSubscriptions = [
          {
            id: "1",
            name: "Netflix",
            amount: 15.99,
            currency: "USD",
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            autoRenew: true,
            category: "Entertainment",
            tags: ["streaming", "video"],
            vendor: "Netflix Inc.",
          },
          {
            id: "2",
            name: "Spotify",
            amount: 9.99,
            currency: "USD",
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
            autoRenew: true,
            category: "Entertainment",
            tags: ["streaming", "music"],
            vendor: "Spotify AB",
          },
          {
            id: "3",
            name: "Adobe Creative Cloud",
            amount: 52.99,
            currency: "USD",
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            autoRenew: true,
            category: "Software",
            tags: ["design", "productivity"],
            vendor: "Adobe Inc.",
          },
          {
            id: "4",
            name: "AWS",
            amount: 150.00,
            currency: "USD",
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
            autoRenew: true,
            category: "Cloud Services",
            tags: ["hosting", "infrastructure"],
            vendor: "Amazon Web Services",
          },
          {
            id: "5",
            name: "Microsoft 365",
            amount: 99.99,
            currency: "USD",
            billingCycle: "yearly",
            nextBillingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
            autoRenew: true,
            category: "Software",
            tags: ["productivity", "office"],
            vendor: "Microsoft",
          },
        ];
        
        setSubscriptions(mockSubscriptions);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, [setLoading, setSubscriptions]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };
  
  const filteredSubscriptions = getFilteredSubscriptions();
  const categories = getCategories();
  const vendors = getVendors();
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading subscriptions...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground">
          Manage and track all your recurring expenses.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search subscriptions..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <p className="text-xs font-medium mb-1">Category</p>
                <Select onValueChange={(value) => setCategoryFilter(value === "all" ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <p className="text-xs font-medium mb-1">Vendor</p>
                <Select onValueChange={(value) => setVendorFilter(value === "all" ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor} value={vendor}>
                        {vendor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => clearFilters()}>
                Clear filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button asChild>
            <Link href="/subscriptions/new">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Link>
          </Button>
          
          {canAccessFeature("auto_email_detection") && (
            <>
              <SimpleEmailInput 
                onSubscriptionsDetected={(detected: any[]) => {
                  const newSubs = detected.map(d => ({
                    id: Math.random().toString(36).substr(2, 9),
                    name: d.name,
                    amount: d.amount,
                    currency: "USD",
                    billingCycle: d.billingCycle,
                    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    autoRenew: true,
                    category: d.category,
                    vendor: d.vendor,
                    tags: [],
                  }));
                  setSubscriptions([...subscriptions, ...newSubs]);
                  toast.success(`Added ${detected.length} subscription${detected.length !== 1 ? 's' : ''}`);
                }}
              />
              <EmailInboxScanner 
                onSubscriptionsDetected={(detected: any[]) => {
                  const newSubs = detected.map(d => ({
                    id: Math.random().toString(36).substr(2, 9),
                    name: d.name,
                    amount: d.amount,
                    currency: "USD",
                    billingCycle: d.billingCycle,
                    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    autoRenew: true,
                    category: d.category,
                    vendor: d.vendor,
                    tags: [],
                  }));
                  setSubscriptions([...subscriptions, ...newSubs]);
                  toast.success(`Added ${detected.length} subscription${detected.length !== 1 ? 's' : ''}`);
                }}
              />
            </>
          )}
          
          {canAccessFeature("csv_import_export") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/subscriptions/import">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscriptions/export">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden md:table-cell">Billing Cycle</TableHead>
              <TableHead className="hidden md:table-cell">Next Billing</TableHead>
              <TableHead className="hidden lg:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Auto-Renew</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length > 0 ? (
              filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{subscription.name}</span>
                      <span className="text-xs text-muted-foreground md:hidden">
                        {subscription.billingCycle} · {format(subscription.nextBillingDate, "MMM dd, yyyy")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    ${subscription.amount.toFixed(2)}
                    <span className="text-xs text-muted-foreground">
                      {subscription.currency}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="capitalize">{subscription.billingCycle}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(subscription.nextBillingDate, "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {subscription.category && (
                      <Badge variant="outline">{subscription.category}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {subscription.autoRenew ? (
                      <Badge variant="default" className="bg-green-500">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/subscriptions/${subscription.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/subscriptions/${subscription.id}/edit`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => setSubscriptionToDelete(subscription.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <CreditCard className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No subscriptions found</p>
                    <Button asChild className="mt-4">
                      <Link href="/subscriptions/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subscription
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!subscriptionToDelete} onOpenChange={(open) => !open && setSubscriptionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this subscription? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (subscriptionToDelete) {
                  const subscription = subscriptions.find(s => s.id === subscriptionToDelete);
                  deleteSubscription(subscriptionToDelete);
                  toast.success(`${subscription?.name || 'Subscription'} has been deleted`);
                  setSubscriptionToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}