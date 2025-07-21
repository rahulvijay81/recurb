"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="));
    
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  }, [router]);
  
  return null;
}