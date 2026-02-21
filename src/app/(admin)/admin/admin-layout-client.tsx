"use client";

import { useState } from "react";
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
import { Info, Database, Users, Settings, Menu, X, Home } from "lucide-react";
import Link from "next/link";
import { UserDropdown } from "@/components/common/user-dropdown";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const navigation = [
    { name: "Overview", href: "/admin", icon: Home, active: pathname === "/admin" },
    { name: "System Info", href: "/admin/system", icon: Info, active: pathname === "/admin/system" },
    { name: "Database", href: "/admin/database", icon: Database, active: pathname === "/admin/database" },
    { name: "Users", href: "/admin/users", icon: Users, active: pathname === "/admin/users" },
    { name: "Features", href: "/admin/features", icon: Settings, active: pathname === "/admin/features" },
  ];
  
  return (
    <SidebarProvider>
      <Sidebar className="hidden lg:flex">
        <SidebarHeader className="p-4 border-b">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">A</span>
            </div>
            <span>Admin Panel</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="px-3 py-3">
          <SidebarMenu className="space-y-1">
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={item.active} className="h-10 px-3 rounded-md font-medium">
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-3 border-t">
          <UserDropdown variant="sidebar" />
        </SidebarFooter>
      </Sidebar>
      
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b h-14 flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="mr-2">
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span>Admin Panel</span>
        </Link>
      </div>
      
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full p-4">
              <div className="flex h-10 items-center justify-between mb-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg">
                  <span>Admin Panel</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      item.active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
      
      <SidebarInset className="lg:ml-0">
        <div className="lg:hidden h-14" />
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">Back to App</Link>
            </Button>
            <UserDropdown variant="header" />
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          <p>Recurb Admin Panel © {new Date().getFullYear()}</p>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
