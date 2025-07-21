"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface InvoiceUploadProps {
  subscriptionId?: string;
  onUpload?: (files: string[]) => void;
  existingFiles?: string[];
}

export function InvoiceUpload({ subscriptionId, onUpload, existingFiles = [] }: InvoiceUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<string[]>(existingFiles);
  const [fileToRemove, setFileToRemove] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    setUploading(true);
    const newFiles: string[] = [];

    try {
      for (const file of Array.from(selectedFiles)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 10MB)`);
          continue;
        }

        if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          toast.error(`File ${file.name} is not supported (PDF, JPG, PNG, WebP only)`);
          continue;
        }

        // Simulate file upload - in real app, upload to cloud storage
        const fileUrl = `uploads/${Date.now()}-${file.name}`;
        newFiles.push(fileUrl);
      }

      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onUpload?.(updatedFiles);
      toast.success(`${newFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileUrl: string) => {
    const updatedFiles = files.filter(f => f !== fileUrl);
    setFiles(updatedFiles);
    onUpload?.(updatedFiles);
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Invoice Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="invoice-upload">Upload Invoices (PDF, JPG, PNG)</Label>
            <Input
              id="invoice-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileUpload}
              disabled={uploading}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Max 10MB per file. Multiple files supported.
            </p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files</Label>
              {files.map((fileUrl, index) => {
                const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                return (
                  <div key={fileUrl} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <span className="text-sm">{fileName}</span>
                      <Badge variant="secondary" className="text-xs">
                        {fileName.endsWith('.pdf') ? 'PDF' : 'Image'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFileToRemove(fileUrl)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {uploading && (
            <div className="text-sm text-muted-foreground">
              Uploading files...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    
    <AlertDialog open={!!fileToRemove} onOpenChange={(open) => !open && setFileToRemove(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove File</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this file? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={() => {
              if (fileToRemove) {
                removeFile(fileToRemove);
                setFileToRemove(null);
              }
            }}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}