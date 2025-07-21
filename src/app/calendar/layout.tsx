import { MainLayout } from "@/components/common/main-layout";

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}