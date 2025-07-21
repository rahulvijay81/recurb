"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeamStore } from "@/hooks/store/use-team-store";
import { inviteTeamMemberSchema, InviteTeamMemberFormValues } from "@/lib/schemas/team";
import { toast } from "@/lib/utils/toast";
import { FormDialog } from "@/components/common/form-dialog";

interface InviteTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteTeamMemberDialog({ open, onOpenChange }: InviteTeamMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addMember } = useTeamStore();

  const form = useForm<InviteTeamMemberFormValues>({
    resolver: zodResolver(inviteTeamMemberSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const onSubmit = async (values: InviteTeamMemberFormValues) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMember = {
        id: Math.random().toString(36).substr(2, 9),
        email: values.email,
        role: values.role as "admin" | "member" | "viewer",
        invitedAt: new Date(),
      };
      
      addMember(newMember);
      toast.success("Team member invited successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to invite team member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Invite Team Member"
      description="Send an invitation to a new team member. They'll receive an email with instructions to join."
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText="Send Invitation"
      loadingText="Sending..."
    >
      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="colleague@company.com" 
                    type="email"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </FormDialog>
  );
}