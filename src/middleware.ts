import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  // Check setup completion for non-setup routes
  if (!request.nextUrl.pathname.startsWith("/setup") && !request.nextUrl.pathname.startsWith("/api/setup")) {
    try {
      const setupCheck = await fetch(new URL('/api/setup', request.url));
      const { complete } = await setupCheck.json();
      if (!complete) {
        return NextResponse.redirect(new URL("/setup", request.url));
      }
    } catch {}
  }

  // Allow setup route without auth
  if (request.nextUrl.pathname.startsWith("/setup")) {
    return NextResponse.next();
  }

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
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Apply middleware to all routes except public assets
export const config = {
  matcher: [
    "/((?!api/public|api/setup|_next/static|_next/image|favicon.ico|public/|auth/verify).*)",
  ],
};