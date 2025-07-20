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
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Header } from "@/components/common/header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, plan, logout, canAccessFeature } = useAuthStore();
  
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
      plan: "basic",
    },
    {
      name: "Subscriptions",
      href: "/subscriptions",
      icon: Repeat,
      active: pathname.startsWith("/subscriptions"),
      plan: "basic",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: TrendingUp,
      active: pathname.startsWith("/analytics"),
      plan: "pro",
    },
    {
      name: "Team",
      href: "/team",
      icon: Users,
      active: pathname.startsWith("/team"),
      plan: "team",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname.startsWith("/settings"),
      plan: "basic",
    },
  ];
  
  return (
    <SidebarProvider>
      <Sidebar className="hidden lg:flex">
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
            <span>Recurb</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarMenu>
            {navigation.map((item) => {
              const isAccessible = item.plan === "basic" || canAccessFeature(item.plan === "team" ? "team_management" : item.plan);
              if (!isAccessible) return null;
              
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2">
                <div className="flex items-center gap-2 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{user?.name || user?.email}</span>
                    <span className="text-xs text-muted-foreground capitalize">{plan} Plan</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/plans" className="cursor-pointer">
                  <Repeat className="mr-2 h-4 w-4" />
                  Subscription
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  const isAccessible = item.plan === "basic" || canAccessFeature(item.plan === "team" ? "team_management" : item.plan);
                  
                  if (!isAccessible) return null;
                  
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
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{user?.name || user?.email}</span>
                    <span className="text-xs text-muted-foreground capitalize">{plan} Plan</span>
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
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}