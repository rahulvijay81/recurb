"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbConfig {
  [key: string]: {
    label: string;
    href?: string;
  };
}

const breadcrumbConfig: BreadcrumbConfig = {
  dashboard: { label: "Dashboard", href: "/dashboard" },
  subscriptions: { label: "Subscriptions", href: "/subscriptions" },
  analytics: { label: "Analytics", href: "/analytics" },
  calendar: { label: "Calendar", href: "/calendar" },
  team: { label: "Team", href: "/team" },
  settings: { label: "Settings", href: "/settings" },
  auth: { label: "Authentication" },
  login: { label: "Login" },
  register: { label: "Register" },
  new: { label: "Add New" },
  edit: { label: "Edit" },
  import: { label: "Import" },
  profile: { label: "Profile" },
  plans: { label: "Subscription Plans" },
};

function formatDynamicSegment(segment: string): string {
  // Handle dynamic route segments like [id]
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return "Details";
  }
  return segment;
}

export function PageBreadcrumb() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on auth pages or root
  if (pathname === "/" || pathname.startsWith("/auth")) {
    return null;
  }
  
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // Generate breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;
    
    // Check if it's a dynamic segment (UUID pattern or number)
    const isDynamic = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^\d+$/.test(segment);
    
    let label: string;
    if (isDynamic) {
      label = "Details";
    } else {
      const config = breadcrumbConfig[segment];
      label = config ? config.label : formatDynamicSegment(segment);
    }
    
    return {
      label,
      href: isLast ? undefined : href,
      isLast,
      isDynamic,
    };
  });
  
  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {breadcrumbItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage className="font-medium">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href!} className="hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}