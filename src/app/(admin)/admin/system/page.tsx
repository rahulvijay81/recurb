"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SystemInfo {
  platform: string;
  arch: string;
  nodeVersion: string;
  uptime: number;
  totalMemory: number;
  freeMemory: number;
  cpus: number;
  hostname: string;
  dbType: string;
}

export default function SystemPage() {
  const [info, setInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    fetch("/api/admin/system")
      .then((res) => res.json())
      .then((data) => setInfo(data.data));
  }, []);

  if (!info) return <div>Loading...</div>;

  const formatBytes = (bytes: number) => {
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Information</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Server</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform:</span>
              <span className="font-medium">{info.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Architecture:</span>
              <span className="font-medium">{info.arch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hostname:</span>
              <span className="font-medium">{info.hostname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-medium">{formatUptime(info.uptime)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">CPUs:</span>
              <span className="font-medium">{info.cpus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Memory:</span>
              <span className="font-medium">{formatBytes(info.totalMemory)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Free Memory:</span>
              <span className="font-medium">{formatBytes(info.freeMemory)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Node Version:</span>
              <span className="font-medium">{info.nodeVersion}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium uppercase">{info.dbType}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
