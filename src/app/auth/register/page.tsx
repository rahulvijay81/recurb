"use client";

import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <span>Recurb</span>
        </Link>
      </div>
      
      <div className="border rounded-lg p-6 bg-card">
        <RegisterForm />
      </div>
    </>
  );
}