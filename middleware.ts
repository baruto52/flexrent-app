import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  req: NextRequest
) {

  const pathname =
    req.nextUrl.pathname;

  // PWA FILES IMMER ERLAUBEN

  if (
    pathname === "/manifest.json" ||
    pathname === "/sw.js" ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/icon-") ||
    pathname.startsWith("/workbox-")
  ) {

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {

  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};