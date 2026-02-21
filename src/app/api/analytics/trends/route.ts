import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const subscriptions = await db.query(
      `SELECT amount, billing_cycle FROM subscriptions WHERE user_id = ? LIMIT 1000`,
      [user.id]
    );

    const monthlyTotals: Record<string, number> = {};
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toISOString().slice(0, 7);
      monthlyTotals[key] = 0;
    }

    for (const sub of subscriptions) {
      const amount = parseFloat(sub.amount);
      let monthlyAmount = 0;

      if (sub.billing_cycle === "monthly") {
        monthlyAmount = amount;
      } else if (sub.billing_cycle === "yearly") {
        monthlyAmount = amount / 12;
      } else if (sub.billing_cycle === "quarterly") {
        monthlyAmount = amount / 3;
      }

      for (const month in monthlyTotals) {
        monthlyTotals[month] += monthlyAmount;
      }
    }

    const trends = Object.entries(monthlyTotals).map(([month, amount]) => ({
      month,
      amount: Math.round(amount * 100) / 100,
    }));

    return NextResponse.json({ data: trends });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}
