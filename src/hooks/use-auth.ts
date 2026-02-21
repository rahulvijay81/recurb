"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { User } from "@/lib/schemas/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(authClient.getUser());
    setIsLoading(false);
  }, []);

  const updateUser = (newUser: User | null) => {
    authClient.setUser(newUser);
    setUser(newUser);
  };

  return {
    user,
    isLoading,
    isAuthenticated: authClient.isAuthenticated(),
    setUser: updateUser,
    logout: authClient.logout.bind(authClient),
    canEdit: authClient.canEdit,
    canDelete: authClient.canDelete,
    canManageTeam: authClient.canManageTeam,
    updateProfile: authClient.updateProfile.bind(authClient),
  };
}
