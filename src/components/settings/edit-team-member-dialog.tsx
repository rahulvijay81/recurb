"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeamStore } from "@/hooks/store/use-team-store";
import { editTeamMemberSchema, EditTeamMemberFormValues } from "@/lib/schemas/team";
import { TeamMember } from "@/lib/schemas/user";
import { toast } from "@/lib/utils/toast";
import { FormDialog } from "@/components/common/form-dialog";

interface EditTeamMemberDialogProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTeamMemberDialog({ member, open, onOpenChange }: EditTeamMemberDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { updateMember } = useTeamStore();

  const form = useForm<EditTeamMemberFormValues>({
    resolver: zodResolver(editTeamMemberSchema),
    defaultValues: {
      role: "member",
    },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        role: member.role === "owner" ? "admin" : member.role,
      });
    }
  }, [member, form]);

  const onSubmit = async (values: EditTeamMemberFormValues) => {
    if (!member) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateMember(member.id, { role: values.role as "admin" | "member" });
      toast.success("Team member updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update team member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
  };

  if (!member) return null;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Team Member"
      description={`Update the role and permissions for ${member.name || member.email}.`}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText="Update Member"
      loadingText="Updating..."
    >
      <Form {...form}>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Member</label>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
              <div>
                <p className="font-medium">{member.name || member.email}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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