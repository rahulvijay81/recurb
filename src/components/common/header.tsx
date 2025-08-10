"use client";

import { Bell, Moon, Sun } from "lucide-react";
import { useThemeToggle } from "@/hooks/store/use-theme-store";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore } from "@/hooks/store/use-notification-store";
import { UserDropdown } from "./user-dropdown";

export function Header() {
  const [themeError, setThemeError] = useState<string | null>(null);
  const [themeState, setThemeState] = useState({ theme: 'light', toggleTheme: () => {} });
  
  useEffect(() => {
    try {
      const themeStore = useThemeToggle();
      setThemeState(themeStore);
    } catch (error) {
      setThemeError('Theme system unavailable');
      console.error('Theme store error:', error);
    }
  }, []);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  return (
    <header className="flex items-center justify-end p-4 border-b bg-background">

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={themeState.toggleTheme}
          disabled={!!themeError}
        >
          {themeState.theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-3 cursor-pointer"
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <UserDropdown variant="header" />
      </div>
    </header>
  );
}