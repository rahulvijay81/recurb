import { MainLayout } from "@/components/common/main-layout";

export default function SubscriptionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}