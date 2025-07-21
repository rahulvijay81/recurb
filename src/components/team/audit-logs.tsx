"use client";

import { useAuditStore } from "@/hooks/store/use-audit-store";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuditLogs() {
  const { logs } = useAuditStore();
  const { canAccessFeature } = useAuthStore();

  if (!canAccessFeature("audit_logs")) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Logs</CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No audit logs yet.</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex justify-between items-start p-4 border rounded-lg bg-muted/20">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{log.userName}</span>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded capitalize">
                      {log.action}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {log.resourceType.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {log.timestamp.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}