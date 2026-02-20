"use client";

import { User as UserIcon, Repeat, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import Link from "next/link";

interface UserDropdownProps {
  variant?: "header" | "sidebar";
  showPlan?: boolean;
}

export function UserDropdown({ variant = "header", showPlan = false }: UserDropdownProps) {
  const { user, logout } = useAuthStore();

  const triggerContent = variant === "sidebar" ? (
    <div className="flex items-center gap-2 w-full">
      <Avatar className="h-8 w-8">
        <AvatarImage src="" />
        <AvatarFallback>
          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-left min-w-0 flex-1">
        <span className="text-sm font-medium truncate">{user?.name || user?.email}</span>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2 p-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src="" />
        <AvatarFallback>
          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium hidden sm:block">
        {user?.name || user?.email}
      </span>
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={variant === "sidebar" ? "w-full justify-start p-2" : "flex items-center gap-2 p-2"}>
          {triggerContent}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={variant === "sidebar" ? "start" : "end"} className="w-56">
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
  );
}