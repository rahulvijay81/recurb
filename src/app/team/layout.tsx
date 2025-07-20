"use client";

import { useAuthStore } from "@/hooks/store/use-auth-store";
import { MainLayout } from "@/components/common/main-layout";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { canAccessFeature } = useAuthStore();

  useEffect(() => {
    if (!canAccessFeature("team_management")) {
      redirect("/dashboard");
    }
  }, [canAccessFeature]);

  if (!canAccessFeature("team_management")) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}