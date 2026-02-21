"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarInset 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import { 
  Home, 
  Repeat, 
  TrendingUp, 
  Settings, 
  Menu, 
  X,
  LogOut,
  User as UserIcon,
  Users,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/common/header";
import { UserDropdown } from "@/components/common/user-dropdown";
import { UserAvatar } from "@/components/common/user-avatar";
import { PageBreadcrumb } from "@/components/common/page-breadcrumb";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  // Close mobile menu when path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      active: pathname === "/dashboard",
      feature: "manual_crud",
    },
    {
      name: "Subscriptions",
      href: "/subscriptions",
      icon: Repeat,
      active: pathname.startsWith("/subscriptions"),
      feature: "manual_crud",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: TrendingUp,
      active: pathname.startsWith("/analytics"),
      feature: "trends",
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: Calendar,
      active: pathname.startsWith("/calendar"),
      feature: "calendar",
    },
    {
      name: "Team",
      href: "/team",
      icon: Users,
      active: pathname.startsWith("/team"),
      feature: "team_management",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
      feature: "manual_crud",
    },
  ];
  
  return (
    <SidebarProvider>
      <Sidebar className="hidden lg:flex">
        <SidebarHeader className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">R</span>
            </div>
            <span>Recurb</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-3 py-3">
          <SidebarMenu className="space-y-1">
            {navigation.map((item) => {
                            return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={item.active} className="h-10 px-3 rounded-md font-medium">
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-3 border-t">
          <UserDropdown variant="sidebar" showPlan />
        </SidebarFooter>
      </Sidebar>
      
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b h-14 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mr-2"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span>Recurb</span>
        </Link>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full p-4">
              <div className="flex h-10 items-center justify-between mb-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
                  <span>Recurb</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 space-y-1">
                {navigation.map((item) => {
                                    return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        item.active
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 p-2">
                  <UserAvatar user={user || undefined} />
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{user?.name || user?.email}</span>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/settings/profile"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings/plans"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Repeat className="h-4 w-4" />
                    Subscription
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <SidebarInset className="lg:ml-0">
        <div className="lg:hidden h-14" />
        <Header />
        <main className="flex-1 p-4">
          <PageBreadcrumb />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}