import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define feature paths and their required plans
const FEATURE_PATHS: Record<string, string[]> = {
  "/dashboard": ["basic", "pro", "team"],
  "/subscriptions": ["basic", "pro", "team"],
  "/analytics": ["pro", "team"],
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
  
  try {
    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_development_only");
    const { payload } = await jwtVerify(token, secret);
    
    // Check if user has access to the requested path
    const userPlan = payload.plan as string || "basic";
    
    // Check feature access for specific paths
    for (const [path, allowedPlans] of Object.entries(FEATURE_PATHS)) {
      if (request.nextUrl.pathname.startsWith(path) && !allowedPlans.includes(userPlan)) {
        // Redirect to upgrade page if user doesn't have access
        return NextResponse.redirect(new URL("/settings/plans", request.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Apply middleware to all routes except public assets
export const config = {
  matcher: [
    "/((?!api/public|_next/static|_next/image|favicon.ico|public/|auth/verify).*)",
  ],
};