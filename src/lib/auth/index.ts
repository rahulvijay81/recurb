import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { User } from "../schemas/user";

// JWT helpers
export async function createToken(user: Partial<User>) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_development_only");
  
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan || "basic",
    teamId: user.teamId,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
  
  return token;
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_development_only");
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

// Auth helpers
export async function getCurrentUser() {
  const token = cookies().get("auth-token")?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const payload = await verifyToken(token);
    
    if (!payload) {
      return null;
    }
    
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      plan: payload.plan as string,
      teamId: payload.teamId as string,
      role: payload.role as string,
    };
  } catch (error) {
    return null;
  }
}

// Feature access control
export function canAccessFeature(user: Partial<User> | null, feature: string): boolean {
  if (!user) return false;
  
  const plan = user.plan || "basic";
  
  const PLAN_FEATURES = {
    basic: [
      "manual_crud",
      "csv_import_export",
      "auto_renewal_flags",
      "tags_categories",
      "mrr_yrr",
    ],
    pro: [
      "manual_crud",
      "csv_import_export",
      "auto_renewal_flags",
      "tags_categories",
      "mrr_yrr",
      "monthly_breakdowns",
      "trends",
      "forecasting",
      "duplicate_detection",
      "invoice_upload",
      "calendar",
      "vendor_summaries",
      "enhanced_exports",
      "custom_reminders",
    ],
    team: [
      "manual_crud",
      "csv_import_export",
      "auto_renewal_flags",
      "tags_categories",
      "mrr_yrr",
      "monthly_breakdowns",
      "trends",
      "forecasting",
      "duplicate_detection",
      "invoice_upload",
      "calendar",
      "vendor_summaries",
      "enhanced_exports",
      "custom_reminders",
      "team_management",
      "shared_notes",
      "audit_logs",
      "webhooks",
    ],
  };
  
  return PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES].includes(feature);
}