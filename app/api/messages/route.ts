import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const withId = request.nextUrl.searchParams.get("with");
  if (!withId) return NextResponse.json({ error: "?with=[userId] is required" }, { status: 400 });

  const otherId = parseInt(withId);
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { sender_id: session.id, receiver_id: otherId },
        { sender_id: otherId, receiver_id: session.id },
      ],
    },
    orderBy: { created_at: "asc" },
  });

  return NextResponse.json(messages);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.receiver_id || !body?.content) {
    return NextResponse.json({ error: "receiver_id and content are required" }, { status: 400 });
  }

  const receiverId = parseInt(body.receiver_id);

  const message = await prisma.message.create({
    data: {
      sender_id: session.id,
      receiver_id: receiverId,
      content: body.content,
    },
  });

  // Only create a notification if there isn't already an unread one from this sender
  const existing = await prisma.notification.findFirst({
    where: {
      user_id: receiverId,
      type: "new_message",
      from_user_id: session.id,
      read: false,
    },
  });
  if (!existing) {
    await prisma.notification.create({
      data: {
        user_id: receiverId,
        type: "new_message",
        from_user_id: session.id,
        ref_id: message.id,
      },
    });
  }

  return NextResponse.json(message, { status: 201 });
}
