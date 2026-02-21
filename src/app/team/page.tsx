"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { redirect } from "next/navigation";
import { TeamManagement } from "@/components/settings/team-management";
import { AuditLogs } from "@/components/team/audit-logs";
import { WebhookConfig } from "@/components/team/webhook-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, History, Webhook } from "lucide-react";

export default function TeamPage() {
      return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground">
          Manage your team members, audit logs, and integrations.
        </p>
      </div>
      
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Team Members
          </TabsTrigger>
          <TabsTrigger value="audit">
            <History className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <TeamManagement />
        </TabsContent>
        
        <TabsContent value="audit">
          <AuditLogs />
        </TabsContent>
        
        <TabsContent value="webhooks">
          <WebhookConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
}