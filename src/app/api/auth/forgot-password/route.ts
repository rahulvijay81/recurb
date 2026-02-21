import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { randomBytes } from "crypto";
import { rateLimit } from "@/lib/utils/rate-limit";
import { csrfProtection } from "@/lib/utils/csrf";

const limiter = rateLimit(3, 60000);

export async function POST(request: NextRequest) {
  const rateLimitResponse = limiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  const csrfResponse = csrfProtection(request);
  if (csrfResponse) return csrfResponse;
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const db = await getDatabase();
    const users = await db.query(`SELECT id FROM users WHERE email = ?`, [email]);

    if (users.length === 0) {
      return NextResponse.json({ message: "If email exists, reset link sent" }, { status: 200 });
    }

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await db.execute(
      `INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`,
      [users[0].id, token, expiresAt, token, expiresAt]
    );

    // TODO: Send email with reset link
    console.log(`Reset link: ${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`);

    return NextResponse.json({ message: "If email exists, reset link sent" }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
