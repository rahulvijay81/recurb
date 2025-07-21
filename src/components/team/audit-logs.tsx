"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import { AuditLogEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils/date";

interface AuditLogsProps {
  logs: AuditLogEntry[];
}

export function AuditLogs({ logs }: AuditLogsProps) {
  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No audit logs available.
              </p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {log.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{log.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{log.resourceType}</span>
                    {log.resourceId && (
                      <span className="text-muted-foreground"> #{log.resourceId}</span>
                    )}
                  </div>
                  
                  {log.details && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {log.details}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}