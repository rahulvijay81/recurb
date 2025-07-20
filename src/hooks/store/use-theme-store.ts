"use client";

import { useTheme } from "next-themes";

export function useThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return { theme, toggleTheme };
}