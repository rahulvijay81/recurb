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
      `SELECT id, name, amount, currency, billing_cycle, category, vendor, tags, next_billing_date, auto_renew, notes, invoice_url, user_id, organization_id, created_at, updated_at 
       FROM subscriptions 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user.id]
    );

    const totalActive = subscriptions.length;
    
    const totalMonthly = subscriptions
      .filter((sub: any) => sub.billing_cycle === "monthly")
      .reduce((sum: number, sub: any) => sum + Number(sub.amount), 0);
      
    const totalYearly = subscriptions
      .filter((sub: any) => sub.billing_cycle === "yearly")
      .reduce((sum: number, sub: any) => sum + (Number(sub.amount) / 12), 0);
    
    const now = Date.now();
    const upcomingRenewals = subscriptions
      .filter((sub: any) => {
        if (!sub.next_billing_date) return false;
        const daysUntilRenewal = Math.ceil(
          (new Date(sub.next_billing_date).getTime() - now) / (1000 * 60 * 60 * 24)
        );
        return daysUntilRenewal <= 7 && daysUntilRenewal >= 0;
      })
      .sort((a: any, b: any) => 
        new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime()
      );

    return NextResponse.json({
      data: {
        totalActive,
        totalMonthly,
        totalYearly,
        upcomingRenewals,
        subscriptions
      }
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
