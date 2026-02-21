import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDatabase();
    
    let userCount = 0;
    let subscriptionCount = 0;
    let organizationCount = 0;

    try {
      const users = await db.query("SELECT COUNT(*) as count FROM users");
      userCount = users[0]?.count || 0;
    } catch {}

    try {
      const subscriptions = await db.query("SELECT COUNT(*) as count FROM subscriptions");
      subscriptionCount = subscriptions[0]?.count || 0;
    } catch {}

    try {
      const organizations = await db.query("SELECT COUNT(*) as count FROM organizations");
      organizationCount = organizations[0]?.count || 0;
    } catch {}
    
    const dbStatus = {
      connected: true,
      type: process.env.DB_TYPE || "sqlite",
      tables: {
        users: userCount,
        subscriptions: subscriptionCount,
        organizations: organizationCount,
      },
    };

    return NextResponse.json({ data: dbStatus });
  } catch (error) {
    return NextResponse.json(
      { data: { connected: false, type: process.env.DB_TYPE || "sqlite", tables: { users: 0, subscriptions: 0, organizations: 0 } } }
    );
  }
}
