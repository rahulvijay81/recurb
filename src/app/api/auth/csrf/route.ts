import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/utils/csrf";

export async function GET() {
  const token = generateCsrfToken();
  const response = NextResponse.json({ token });
  response.cookies.set("csrf-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return response;
}
