import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { User } from "../schemas/user";
import { hasPermission, Permission } from "./permissions";

// JWT helpers
export async function createToken(user: Partial<User>) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    organizationId: user.organizationId,
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
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is required");
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

// Auth helpers
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  
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
      organizationId: payload.organizationId as number,
      role: payload.role as string,
    };
  } catch (error) {
    return null;
  }
}

export async function requirePermission(permission: Permission) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user.role, permission)) {
    throw new Error('Unauthorized');
  }
  return user;
}