"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

interface DatabaseStatus {
  connected: boolean;
  type: string;
  tables: {
    users: number;
    subscriptions: number;
    organizations: number;
  };
}

export default function DatabasePage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);

  useEffect(() => {
    fetch("/api/admin/database")
      .then((res) => res.json())
      .then((data) => setStatus(data.data || data));
  }, []);

  if (!status) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Database Status</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.connected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Database Type:</span>
            <span className="font-medium uppercase">{status.type}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Table Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Users:</span>
            <span className="font-medium">{status.tables?.users || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subscriptions:</span>
            <span className="font-medium">{status.tables?.subscriptions || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Organizations:</span>
            <span className="font-medium">{status.tables?.organizations || 0}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
