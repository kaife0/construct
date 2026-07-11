import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Must match SESSION_COOKIE_NAME in ../server/src/lib/auth.ts exactly.
const SESSION_COOKIE_NAME = "casastruct_admin_session";

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    // Verifies the JWT signature before any admin UI is ever sent down — the
    // same secret the server signs with (JWT_SECRET must match in both .env
    // files). A forged or expired cookie fails here.
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET ?? ""));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authenticated = await hasValidSession(req);

  if (pathname === "/admin/login") {
    if (authenticated) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!authenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
