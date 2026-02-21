import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { hash, compare } from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";
import { csrfProtection } from "@/lib/utils/csrf";

export async function POST(request: NextRequest) {
  const csrfResponse = csrfProtection(request);
  if (csrfResponse) return csrfResponse;
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const db = await getDatabase();
    const users = await db.query(
      "SELECT id, password_hash FROM users WHERE id = ?",
      [user.id]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const dbUser = users[0];
    const isValidPassword = await compare(currentPassword, dbUser.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const hashedPassword = await hash(newPassword, 10);
    await db.execute(
      "UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, user.id]
    );

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}
