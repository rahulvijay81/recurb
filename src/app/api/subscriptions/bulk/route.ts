import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptions } = await request.json();
    
    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      return NextResponse.json({ error: "Invalid subscriptions data" }, { status: 400 });
    }

    const db = await getDatabase();
    const inserted = [];

    for (const sub of subscriptions) {
      const result = await db.execute(
        `INSERT INTO subscriptions (name, amount, currency, billing_cycle, category, tags, next_billing_date, auto_renew, notes, organization_id, user_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [sub.name, sub.amount, sub.currency || 'USD', sub.billing_cycle, sub.category, sub.tags ? JSON.stringify(sub.tags) : null, sub.next_billing_date, sub.auto_renew ?? true, sub.notes, 1, user.id]
      );
      inserted.push(result.insertId);
    }

    return NextResponse.json({ data: { count: inserted.length, ids: inserted } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to import subscriptions" }, { status: 500 });
  }
}
