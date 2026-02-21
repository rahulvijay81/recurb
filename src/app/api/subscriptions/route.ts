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
    const subscriptions = await db.query(
      `SELECT id, name, amount, currency, billing_cycle, category, vendor, tags, next_billing_date, auto_renew, notes, invoice_url, user_id, organization_id, created_at, updated_at FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ data: subscriptions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, amount, currency, billing_cycle, category, vendor, tags, next_billing_date, auto_renew, notes, invoice_url } = body;

    const params = [
      name, 
      Number(amount), 
      currency || 'USD', 
      billing_cycle, 
      category || null, 
      vendor || null, 
      tags && Array.isArray(tags) && tags.length > 0 ? JSON.stringify(tags) : null, 
      next_billing_date, 
      auto_renew ? 1 : 0, 
      notes || null, 
      invoice_url || null, 
      Number(user.organizationId) || 1, 
      Number(user.id)
    ];

    const db = await getDatabase();
    const result = await db.execute(
      `INSERT INTO subscriptions (name, amount, currency, billing_cycle, category, vendor, tags, next_billing_date, auto_renew, notes, invoice_url, organization_id, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params
    );

    const newSubscription = await db.query(
      `SELECT id, name, amount, currency, billing_cycle, category, vendor, tags, next_billing_date, auto_renew, notes, invoice_url, user_id, organization_id, created_at, updated_at FROM subscriptions WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json({ data: newSubscription[0] }, { status: 201 });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
  }
}
