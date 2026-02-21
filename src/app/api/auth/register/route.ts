import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { hash } from "bcryptjs";
import { rateLimit } from "@/lib/utils/rate-limit";
import { csrfProtection } from "@/lib/utils/csrf";

const limiter = rateLimit(3, 60000);

export async function POST(request: NextRequest) {
  const rateLimitResponse = limiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  const csrfResponse = csrfProtection(request);
  if (csrfResponse) return csrfResponse;
  try {
    const { email, password, name, company, currency } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name required" }, { status: 400 });
    }

    const db = await getDatabase();
    
    const existing = await db.query(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const orgResult = await db.execute(
      `INSERT INTO organizations (name, subscription_plan, currency) VALUES (?, ?, ?)`,
      [company || 'My Organization', 'free', currency || 'USD']
    );

    const passwordHash = await hash(password, 10);
    
    const result = await db.execute(
      `INSERT INTO users (email, password_hash, name, role, organization_id) VALUES (?, ?, ?, ?, ?)`,
      [email, passwordHash, name, "user", orgResult.insertId]
    );

    const token = await createToken({
      id: result.insertId!.toString(),
      email,
      name,
      role: "user",
    });

    const response = NextResponse.json({
      data: {
        id: result.insertId!.toString(),
        email,
        name,
        role: "user",
      },
    }, { status: 201 });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
