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
      `SELECT * FROM subscriptions WHERE user_id = ?`,
      [user.id]
    );

    const totalActive = subscriptions.length;
    let monthlyRecurring = 0;
    let yearlyRecurring = 0;
    const byCategory: Record<string, number> = {};
    const upcomingRenewals = [];

    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    for (const sub of subscriptions) {
      const amount = parseFloat(sub.amount);
      
      if (sub.billing_cycle === "monthly") {
        monthlyRecurring += amount;
      } else if (sub.billing_cycle === "yearly") {
        yearlyRecurring += amount / 12;
      } else if (sub.billing_cycle === "quarterly") {
        monthlyRecurring += amount / 3;
      }

      const category = sub.category || "Uncategorized";
      byCategory[category] = (byCategory[category] || 0) + amount;

      if (sub.next_billing_date) {
        const nextBilling = new Date(sub.next_billing_date);
        if (nextBilling >= now && nextBilling <= thirtyDaysFromNow) {
          upcomingRenewals.push(sub);
        }
      }
    }

    const totalAmount = monthlyRecurring + yearlyRecurring;

    return NextResponse.json({
      data: {
        totalActive,
        totalAmount,
        monthlyRecurring,
        yearlyRecurring,
        upcomingRenewals,
        byCategory,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
