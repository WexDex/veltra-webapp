import { NextResponse } from "next/server";
import { clearCookieOptions } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(clearCookieOptions());
  return response;
}
