"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/utils/toast";

export function ToastDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Toast Notifications</CardTitle>
        <CardDescription>
          Test different types of toast notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button 
            onClick={() => toast.success("Operation completed successfully!")}
            variant="default"
          >
            Success
          </Button>
          <Button 
            onClick={() => toast.error("Something went wrong!")}
            variant="destructive"
          >
            Error
          </Button>
          <Button 
            onClick={() => toast.info("Here's some information")}
            variant="secondary"
          >
            Info
          </Button>
          <Button 
            onClick={() => toast.warning("Please be careful!")}
            variant="outline"
          >
            Warning
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              const loadingToast = toast.loading("Processing...");
              setTimeout(() => {
                toast.dismiss(loadingToast);
                toast.success("Done!");
              }, 2000);
            }}
            variant="outline"
          >
            Loading Toast
          </Button>
          <Button 
            onClick={() => toast.dismiss()}
            variant="ghost"
          >
            Dismiss All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}