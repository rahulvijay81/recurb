"use client";

import { Button } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface LoadingButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export function LoadingButton({ 
  isLoading, 
  loadingText, 
  children, 
  disabled,
  ...props 
}: LoadingButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}