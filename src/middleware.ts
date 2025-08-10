import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define feature paths and their required plans
const FEATURE_PATHS: Record<string, string[]> = {
  "/dashboard": ["basic", "pro", "team"],
  "/subscriptions": ["basic", "pro", "team"],
  "/subscriptions/import": ["basic", "pro", "team"],
  "/api/subscriptions/auto-detect": ["pro", "team"],
  "/analytics": ["pro", "team"],
  "/calendar": ["pro", "team"],
  "/team": ["team"],
  "/settings/team": ["team"],
  "/settings/webhooks": ["team"],
  "/settings/audit": ["team"],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  
  // If no token and not on auth pages, redirect to login
  if (!token && !request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  // Allow access to auth pages without token
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }
  
  // Check JWT_SECRET before processing
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET environment variable is required");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const userPlan = payload.plan as string || "basic";
    const currentPath = request.nextUrl.pathname;
    
    // Optimized path matching - check exact matches first, then prefixes
    for (const [path, allowedPlans] of Object.entries(FEATURE_PATHS)) {
      if (currentPath === path || currentPath.startsWith(path + "/")) {
        if (!allowedPlans.includes(userPlan)) {
          return NextResponse.redirect(new URL("/settings/plans", request.url));
        }
        break;
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Apply middleware to all routes except public assets
export const config = {
  matcher: [
    "/((?!api/public|_next/static|_next/image|favicon.ico|public/|auth/verify).*)",
  ],
};