"use client";

import { useAuthStore } from "@/hooks/store/use-auth-store";
import { MainLayout } from "@/components/common/main-layout";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { canAccessFeature } = useAuthStore();

  useEffect(() => {
    if (!canAccessFeature("trends")) {
      redirect("/settings/plans");
    }
  }, [canAccessFeature]);

  if (!canAccessFeature("trends")) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}