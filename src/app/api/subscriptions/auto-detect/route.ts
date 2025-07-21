import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { detectSubscriptionsFromEmails } from "@/lib/utils/email-subscription-detector";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_development_only");
    const { payload } = await jwtVerify(token, secret);
    const userPlan = payload.plan as string;

    // Feature gating: only Pro and Team plans
    if (!["pro", "team"].includes(userPlan)) {
      return NextResponse.json({ error: "Feature not available for your plan" }, { status: 403 });
    }

    const { emails } = await request.json();
    
    if (!Array.isArray(emails)) {
      return NextResponse.json({ error: "Invalid email list" }, { status: 400 });
    }

    const detectedSubscriptions = detectSubscriptionsFromEmails(emails);
    
    return NextResponse.json({ 
      data: detectedSubscriptions,
      count: detectedSubscriptions.length 
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to detect subscriptions" }, { status: 500 });
  }
}