"use client";

import { CsvImport } from "@/components/subscriptions/csv-import";

export default function ImportPage() {
    // Check if user has access to CSV import feature
    return (
    <div className="p-6">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Import Subscriptions</h1>
        <p className="text-muted-foreground">
          Import your subscriptions from a CSV file.
        </p>
      </div>
      
      <div className="border rounded-md p-6">
        <CsvImport />
      </div>
    </div>
  );
}