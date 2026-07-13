import { NextResponse, type NextRequest } from "next/server";
import { isValidAdminSession, SESSION_COOKIE_NAME } from "@/lib/admin-session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authenticated = await isValidAdminSession(req.cookies.get(SESSION_COOKIE_NAME)?.value);

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
