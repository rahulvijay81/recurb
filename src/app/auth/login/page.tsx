"use client";

import { LoginForm } from "@/components/auth/login-form";
import { CreditCard } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <span>Recurb</span>
        </Link>
      </div>
      
      <div className="border rounded-lg p-6 bg-card">
        <LoginForm />
      </div>
    </>
  );
}