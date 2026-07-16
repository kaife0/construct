import { jwtVerify } from "jose";

// Must match SESSION_COOKIE_NAME in ../server/src/lib/auth.ts exactly.
export const SESSION_COOKIE_NAME = "casastruct_admin_session";


export async function isValidAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET ?? ""), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}
