"use client";

import { TeamManagement } from "@/components/settings/team-management";

export default function TeamPage() {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        <p className="text-muted-foreground">
          Manage your team members and their permissions.
        </p>
      </div>
      
      <TeamManagement />
    </div>
  );
}