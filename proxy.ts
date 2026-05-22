import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("veltra_session")?.value ?? null;
  const session = token ? await verifyToken(token) : null;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (pathname.startsWith("/chat") || pathname.startsWith("/notifications")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/chat/:path*", "/notifications/:path*", "/notifications"],
};
