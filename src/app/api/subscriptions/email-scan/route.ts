import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { fetchGmailMessages, fetchOutlookMessages } from "@/lib/utils/email-providers";
import { detectSubscriptionsFromEmailContent } from "@/lib/utils/email-subscription-detector";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_development_only");
    await jwtVerify(token, secret);

    const { provider, accessToken } = await request.json();
    
    if (!provider || !accessToken) {
      return NextResponse.json({ error: "Provider and access token required" }, { status: 400 });
    }

    let messages;
    try {
      if (provider === "gmail") {
        messages = await fetchGmailMessages(accessToken);
      } else if (provider === "outlook") {
        messages = await fetchOutlookMessages(accessToken);
      } else {
        return NextResponse.json({ error: "Unsupported email provider" }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
    }

    const detectedSubscriptions = detectSubscriptionsFromEmailContent(messages);
    
    return NextResponse.json({ 
      data: detectedSubscriptions,
      count: detectedSubscriptions.length,
      scannedEmails: messages.length
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to scan emails" }, { status: 500 });
  }
}