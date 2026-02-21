import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

export function validateCsrfToken(req: NextRequest): boolean {
  const tokenFromHeader = req.headers.get("x-csrf-token");
  const tokenFromCookie = req.cookies.get("csrf-token")?.value;
  return tokenFromHeader === tokenFromCookie && !!tokenFromHeader;
}

export function csrfProtection(req: NextRequest): NextResponse | null {
  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
    if (!validateCsrfToken(req)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }
  }
  return null;
}
