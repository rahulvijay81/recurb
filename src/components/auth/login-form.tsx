"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/store/use-auth-store";
import Link from "next/link";
import { SignJWT } from "jose";

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock user data based on email
      const mockUsers = {
        "basic@example.com": {
          id: "user_basic",
          email: "basic@example.com",
          name: "Basic User",
          plan: "basic",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        "pro@example.com": {
          id: "user_pro",
          email: "pro@example.com",
          name: "Pro User",
          plan: "pro",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        "team@example.com": {
          id: "user_team",
          email: "team@example.com",
          name: "Team User",
          plan: "team",
          teamId: "team_1",
          role: "owner",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      const user = mockUsers[data.email as keyof typeof mockUsers];
      
      if (user) {
        // Set user in auth store
        setUser(user);
        
        // Create a proper JWT token for the middleware
        const secret = new TextEncoder().encode("fallback_secret_for_development_only");
        const token = await new SignJWT({ 
          id: user.id, 
          email: user.email, 
          plan: user.plan 
        })
          .setProtectedHeader({ alg: "HS256" })
          .setExpirationTime("24h")
          .sign(secret);
        
        // Set the JWT cookie
        document.cookie = `auth-token=${token}; path=/; max-age=86400`;
        
        toast.success("Login successful");
        router.push("/dashboard");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
        
        <div className="mt-6 border-t pt-4">
          <p className="text-muted-foreground mb-2">Demo accounts:</p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="border rounded-md p-2">
              <p><strong>Basic Plan:</strong> basic@example.com</p>
              <p><strong>Password:</strong> password</p>
            </div>
            <div className="border rounded-md p-2">
              <p><strong>Pro Plan:</strong> pro@example.com</p>
              <p><strong>Password:</strong> password</p>
            </div>
            <div className="border rounded-md p-2">
              <p><strong>Team Plan:</strong> team@example.com</p>
              <p><strong>Password:</strong> password</p>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}