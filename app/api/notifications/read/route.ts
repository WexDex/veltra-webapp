import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { id?: number } = {};
  try {
    body = await request.json();
  } catch {
    // empty body = mark all
  }

  if (body.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, user_id: session.id },
      data: { read: true },
    });
  } else {
    await prisma.notification.updateMany({
      where: { user_id: session.id, read: false },
      data: { read: true },
    });
  }

  return NextResponse.json({ ok: true });
}
