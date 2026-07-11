/**
 * Thin client for the admin auth API. All calls hit relative /api/* paths so
 * they go through next.config.ts's rewrite to the Express server — same
 * origin from the browser's point of view, so the httpOnly session cookie
 * behaves like a normal first-party cookie.
 */

export type AdminSession = { name: string; email: string };

async function parseJsonError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.error ?? `Request failed (${res.status}).`;
  } catch {
    return `Request failed (${res.status}).`;
  }
}

export async function loginRequest(email: string, password: string): Promise<AdminSession> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(await parseJsonError(res));
  return res.json();
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function fetchMe(): Promise<AdminSession | null> {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}
