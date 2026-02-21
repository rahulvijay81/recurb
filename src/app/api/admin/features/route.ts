import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDatabase();
    
    const features = await db.query(
      "SELECT key, enabled, description FROM feature_flags ORDER BY key"
    );

    return NextResponse.json({ data: features });
  } catch (error) {
    return NextResponse.json({ data: [] });
  }
}

export async function PATCH(request: Request) {
  try {
    const { key, enabled } = await request.json();
    
    if (!key || typeof enabled !== "boolean") {
      return NextResponse.json(
        { error: "key and enabled are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    await db.execute(
      "UPDATE feature_flags SET enabled = ?, updatedAt = ? WHERE key = ?",
      [enabled ? 1 : 0, new Date().toISOString(), key]
    );

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update feature flag" },
      { status: 500 }
    );
  }
}
