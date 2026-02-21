import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { compare } from "bcryptjs";
import { rateLimit } from "@/lib/utils/rate-limit";
import { csrfProtection } from "@/lib/utils/csrf";

const limiter = rateLimit(5, 60000);

export async function POST(request: NextRequest) {
  const rateLimitResponse = limiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  const csrfResponse = csrfProtection(request);
  if (csrfResponse) return csrfResponse;
  try {
    const { email, password, rememberMe } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const db = await getDatabase();
    const users = await db.query(
      `SELECT id, email, name, role, password_hash, organization_id FROM users WHERE email = ?`,
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = users[0];
    const isValid = await compare(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createToken({
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organization_id,
    });

    const response = NextResponse.json({
      data: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: rememberMe ? 2592000 : 86400,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
