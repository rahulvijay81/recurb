"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useSubscriptionStore } from "@/hooks/store/use-subscription-store";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { csvImportSchema, type CsvImportRow } from "@/lib/schemas/subscription";
import { z } from "zod";

export function CsvImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const { addSubscription } = useSubscriptionStore();
  const router = useRouter();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setParseErrors([]);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    maxFiles: 1,
  });
  
  const handleImport = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setParseErrors([]);
    
    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            // Validate CSV data
            const parsedData = csvImportSchema.safeParse(results.data);
            
            if (!parsedData.success) {
              // Handle validation errors
              const errors = parsedData.error.errors.map(
                (err) => `Row ${err.path[0] || "unknown"}: ${err.message}`
              );
              setParseErrors(errors);
              toast.error("Invalid CSV format");
              setIsUploading(false);
              return;
            }
            
            // Add subscriptions to store
            parsedData.data.forEach((subscription) => {
              addSubscription({
                id: Math.random().toString(36).substring(2, 9),
                ...subscription,
              });
            });
            
            toast.success(`Successfully imported ${parsedData.data.length} subscriptions`);
            router.push("/subscriptions");
          } catch (error) {
            console.error("Error parsing CSV:", error);
            if (error instanceof z.ZodError) {
              setParseErrors(error.errors.map((err) => err.message));
            } else {
              setParseErrors(["Failed to parse CSV file"]);
            }
            toast.error("Failed to import CSV");
          } finally {
            setIsUploading(false);
          }
        },
        error: (error) => {
          console.error("Papa Parse error:", error);
          setParseErrors([error.message]);
          toast.error("Failed to parse CSV file");
          setIsUploading(false);
        },
      });
    } catch (error) {
      console.error("Import error:", error);
      toast.error("An unexpected error occurred");
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">
            {isDragActive ? "Drop the file here" : "Drag & drop your CSV file here"}
          </h3>
          <p className="text-sm text-muted-foreground">
            or click to browse files (max 1 file)
          </p>
        </div>
      </div>
      
      {file && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                onClick={handleImport}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </>
                ) : (
                  "Import"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {parseErrors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h3 className="font-medium text-destructive">Import Errors</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {parseErrors.map((error, index) => (
              <li key={index} className="text-muted-foreground">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">CSV Format Requirements</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Your CSV file should have the following columns:
        </p>
        <code className="text-xs bg-background p-2 rounded block overflow-x-auto">
          name,amount,currency,billingCycle,nextBillingDate,autoRenew,category,tags,notes,vendor
        </code>
        <p className="text-xs text-muted-foreground mt-2">
          Example: Netflix,15.99,USD,monthly,2023-06-15,true,Entertainment,streaming,My Netflix account,Netflix Inc.
        </p>
      </div>
    </div>
  );
}