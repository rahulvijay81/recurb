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

    const vendorMap: Record<string, { count: number; total: number }> = {};

    for (const sub of subscriptions) {
      const vendor = sub.name;
      const amount = parseFloat(sub.amount);

      if (!vendorMap[vendor]) {
        vendorMap[vendor] = { count: 0, total: 0 };
      }

      vendorMap[vendor].count += 1;
      vendorMap[vendor].total += amount;
    }

    const vendors = Object.entries(vendorMap).map(([vendor, data]) => ({
      vendor,
      subscriptionCount: data.count,
      totalAmount: Math.round(data.total * 100) / 100,
    }));

    vendors.sort((a, b) => b.totalAmount - a.totalAmount);

    return NextResponse.json({ data: vendors });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}
