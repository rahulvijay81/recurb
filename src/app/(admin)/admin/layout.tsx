import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { AdminLayoutClient } from "./admin-layout-client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    if (payload.role !== "owner" && payload.role !== "admin") {
      redirect("/dashboard");
    }
  } catch {
    redirect("/auth/login");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
