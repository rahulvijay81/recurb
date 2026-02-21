"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscriptionFormSchema, type SubscriptionFormValues } from "@/lib/schemas/subscription";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { LoadingButton } from "@/components/common/loading-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { useSubscriptionStore } from "@/hooks/store/use-subscription-store";
import { InvoiceUpload } from "@/components/subscriptions/invoice-upload";
import { ReminderSettings } from "@/components/notifications/reminder-settings";
import { TagsSelect } from "@/components/subscriptions/tags-select";
import { toast } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";

interface SubscriptionFormProps {
  initialData?: Partial<SubscriptionFormValues & { id?: string }>;
  isEditing?: boolean;
}

export function SubscriptionForm({ initialData, isEditing = false }: SubscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const { addSubscription, updateSubscription } = useSubscriptionStore();
  const router = useRouter();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const result = await response.json();
          setCategories(result.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);
  
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      amount: initialData?.amount?.toString() || "",
      currency: initialData?.currency || "USD",
      billingCycle: initialData?.billingCycle || "monthly",
      nextBillingDate: initialData?.nextBillingDate || format(new Date(), "yyyy-MM-dd"),
      autoRenew: initialData?.autoRenew ?? true,
      category: initialData?.category || "",
      tags: initialData?.tags || [],
      notes: initialData?.notes || "",
      vendor: initialData?.vendor || "",
    },
  });
  
  const onSubmit = async (data: SubscriptionFormValues) => {
    setIsSubmitting(true);
    
    try {
      const subscription = {
        name: data.name,
        amount: parseFloat(data.amount),
        currency: data.currency,
        billing_cycle: data.billingCycle,
        next_billing_date: data.nextBillingDate,
        auto_renew: data.autoRenew,
        category: data.category,
        tags: Array.isArray(data.tags) ? data.tags : [],
        notes: data.notes,
        vendor: data.vendor,
      };
      
      if (isEditing && initialData?.id) {
        await updateSubscription(initialData.id, subscription);
        toast.success("Subscription updated successfully");
      } else {
        await addSubscription(subscription);
        toast.success("Subscription added successfully");
      }
      
      router.push("/subscriptions");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save subscription");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FormLabel>Subscription Name</FormLabel>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the name of your subscription service</p>
                  </TooltipContent>
                </Tooltip>
                <FormControl>
                  <Input placeholder="Netflix, Spotify, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel>Amount</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cost per billing cycle</p>
                    </TooltipContent>
                  </Tooltip>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Cycle</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="nextBillingDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Next Billing Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vendor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <FormControl>
                  <Input placeholder="Company or service provider" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {(
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagsSelect
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="autoRenew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FormLabel className="text-base">Auto-Renewal</FormLabel>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enable to track automatic renewals and get reminders</p>
                    </TooltipContent>
                  </Tooltip>
                  <FormDescription>
                    This subscription will automatically renew
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional information about this subscription"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {(
          <InvoiceUpload />
        )}
        
        {(
          <ReminderSettings />
        )}
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/subscriptions")}
          >
            Cancel
          </Button>
          <LoadingButton 
            type="submit" 
            isLoading={isSubmitting}
            loadingText={isEditing ? "Updating..." : "Creating..."}
          >
            {isEditing ? "Update" : "Create"} Subscription
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}