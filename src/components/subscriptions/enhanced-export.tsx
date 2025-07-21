"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, FileText, Database } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Subscription } from "@/lib/schemas/subscription";
import { exportToCSV, exportToJSON, downloadFile } from "@/lib/utils/export";

interface EnhancedExportProps {
  subscriptions: Subscription[];
}

export function EnhancedExport({ subscriptions }: EnhancedExportProps) {
  const [options, setOptions] = useState({
    includeAnalytics: true,
    includeInvoices: false,
    includeNotes: true,
    dateRange: 'all' as 'all' | '30days' | '90days' | 'year'
  });

  const handleExport = (format: 'csv' | 'json') => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (format === 'csv') {
        const content = exportToCSV(subscriptions, options.includeAnalytics);
        downloadFile(content, `subscriptions-${timestamp}.csv`, 'text/csv');
      } else {
        const content = exportToJSON(subscriptions, options.includeAnalytics);
        downloadFile(content, `subscriptions-${timestamp}.json`, 'application/json');
      }
      
      toast.success(`Export completed successfully`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Enhanced Export
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Export Options</Label>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-analytics"
                  checked={options.includeAnalytics}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeAnalytics: !!checked }))
                  }
                />
                <Label htmlFor="include-analytics">Include Analytics Data</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-invoices"
                  checked={options.includeInvoices}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeInvoices: !!checked }))
                  }
                />
                <Label htmlFor="include-invoices">Include Invoice Links</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-notes"
                  checked={options.includeNotes}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeNotes: !!checked }))
                  }
                />
                <Label htmlFor="include-notes">Include Notes & Comments</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleExport('csv')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export CSV
            </Button>
            
            <Button
              onClick={() => handleExport('json')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Export JSON
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>• CSV format includes all subscription data and optional analytics</p>
            <p>• JSON format includes structured data with metadata</p>
            <p>• {subscriptions.length} subscription(s) will be exported</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}