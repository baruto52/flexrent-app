import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  return NextResponse.next();

}

export const config = {
  matcher: [
    "/favorites/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/create/:path*",
    "/bookings/:path*",
  ],
};