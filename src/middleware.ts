import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

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
    await jwtVerify(token, secret);
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