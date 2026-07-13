import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { isValidAdminSession, SESSION_COOKIE_NAME } from "@/lib/admin-session";

/**
 * POST { tags: string[] } — admin-only. Called right after a successful
 * create/update/delete so the public site reflects the change immediately
 * instead of waiting out the ISR revalidate window.
 */
export async function POST(req: NextRequest) {
  const authenticated = await isValidAdminSession(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!authenticated) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const tags: unknown = body?.tags;
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
    return NextResponse.json({ error: "Expected { tags: string[] }." }, { status: 400 });
  }

  for (const tag of tags as string[]) {
    // { expire: 0 } = truly immediate expiration, not stale-while-revalidate.
    // This route is called right after an admin write, so the next visitor
    // must get fresh data on the very next request, not "eventually".
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: true });
}
