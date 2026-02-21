import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDatabase();
    
    const users = await db.query(
      "SELECT id, email, name, role, created_at as createdAt, updated_at as updatedAt FROM users ORDER BY created_at DESC"
    );

    return NextResponse.json({ data: users });
  } catch (error) {
    return NextResponse.json({ data: [] });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, role } = await request.json();
    
    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    await db.execute(
      "UPDATE users SET role = ?, updated_at = ? WHERE id = ?",
      [role, new Date().toISOString(), userId]
    );

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    await db.execute("DELETE FROM users WHERE id = ?", [userId]);

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
