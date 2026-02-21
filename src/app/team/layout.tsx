"use client";

import { MainLayout } from "@/components/common/main-layout";

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
        return <MainLayout>{children}</MainLayout>;
}