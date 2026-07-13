import { jwtVerify } from "jose";

// Must match SESSION_COOKIE_NAME in ../server/src/lib/auth.ts exactly.
export const SESSION_COOKIE_NAME = "casastruct_admin_session";

/**
 * Verifies the admin session JWT's signature. Shared by `proxy.ts` (gates
 * page rendering) and the `/api/revalidate` route (gates cache-busting) so
 * both trust the exact same check. Uses `jose` (not the server's
 * `jsonwebtoken`) because this runs in the Next.js runtime — same secret,
 * same HS256 algorithm, fully interoperable.
 */
export async function isValidAdminSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET ?? ""));
    return true;
  } catch {
    return false;
  }
}
