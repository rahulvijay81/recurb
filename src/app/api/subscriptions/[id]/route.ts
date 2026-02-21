import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDatabase();
    const subscriptions = await db.query(
      `SELECT id, name, amount, currency, billing_cycle, category, vendor, tags, next_billing_date, auto_renew, notes, invoice_url, user_id, organization_id, created_at, updated_at FROM subscriptions WHERE id = ? AND user_id = ?`,
      [id, user.id]
    );

    if (subscriptions.length === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ data: subscriptions[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, amount, currency, billing_cycle, category, vendor, tags, next_billing_date, auto_renew, notes, invoice_url } = body;

    const db = await getDatabase();
    await db.execute(
      `UPDATE subscriptions 
       SET name = ?, amount = ?, currency = ?, billing_cycle = ?, category = ?, vendor = ?, tags = ?, 
           next_billing_date = ?, auto_renew = ?, notes = ?, invoice_url = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [name, amount, currency, billing_cycle, category, vendor, tags ? JSON.stringify(tags) : null, next_billing_date, auto_renew, notes, invoice_url, id, user.id]
    );

    const updated = await db.query(
      `SELECT id, name, amount, currency, billing_cycle, category, vendor, tags, next_billing_date, auto_renew, notes, invoice_url, user_id, organization_id, created_at, updated_at FROM subscriptions WHERE id = ? AND user_id = ?`,
      [id, user.id]
    );

    if (updated.length === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated[0] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDatabase();
    const result = await db.execute(
      `DELETE FROM subscriptions WHERE id = ? AND user_id = ?`,
      [id, user.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 });
  }
}
