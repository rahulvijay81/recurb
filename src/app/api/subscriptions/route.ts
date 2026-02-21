import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { csrfProtection } from "@/lib/utils/csrf";

export async function GET(request: NextRequest) {
  try {
    const user = await requirePermission(PERMISSIONS.SUBSCRIPTIONS_READ);
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    const db = await getDatabase();
    const subscriptions = await db.query(
      `SELECT id, name, amount, currency, billing_cycle, category, vendor, tags, next_billing_date, auto_renew, notes, invoice_url, user_id, organization_id, created_at, updated_at FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [user.id, limit, offset]
    );

    const [{ total }] = await db.query(
      `SELECT COUNT(*) as total FROM subscriptions WHERE user_id = ?`,
      [user.id]
    );

    return NextResponse.json({ 
      data: subscriptions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  const csrfResponse = csrfProtection(request);
  if (csrfResponse) return csrfResponse;

  try {
    const user = await requirePermission(PERMISSIONS.SUBSCRIPTIONS_CREATE);

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
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
}
