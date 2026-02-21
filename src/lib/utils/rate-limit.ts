import { NextRequest, NextResponse } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export function rateLimit(limit: number = 5, windowMs: number = 60000) {
  return (req: NextRequest): NextResponse | null => {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const key = `${ip}:${req.nextUrl.pathname}`;
    const now = Date.now();
    const record = store.get(key);

    if (!record || now > record.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      return null;
    }

    if (record.count >= limit) {
      return NextResponse.json(
        { error: "Too many requests, please try again later" },
        { status: 429 }
      );
    }

    record.count++;
    return null;
  };
}
