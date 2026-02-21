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
        return <MainLayout>{children}</MainLayout>;
}