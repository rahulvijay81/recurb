import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const categories = await db.query(
      `SELECT id, name, description, color, icon, organization_id, created_at, updated_at 
       FROM categories 
       WHERE organization_id = ? 
       ORDER BY name ASC`,
      [user.organizationId || 1]
    );

    return NextResponse.json({ data: categories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, color, icon } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const result = await db.execute(
      `INSERT INTO categories (name, description, color, icon, organization_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [name, description || null, color || null, icon || null, user.organizationId || 1]
    );

    const newCategory = await db.query(
      `SELECT id, name, description, color, icon, organization_id, created_at, updated_at 
       FROM categories WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json({ data: newCategory[0] }, { status: 201 });
  } catch (error: any) {
    if (error?.message?.includes('UNIQUE')) {
      return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
