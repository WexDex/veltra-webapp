import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ sender_id: session.id }, { receiver_id: session.id }],
    },
    orderBy: { created_at: "desc" },
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
  });

  const seen = new Set<number>();
  const conversations: Array<{
    user: { id: number; name: string };
    lastMessage: { content: string; created_at: string; sender_id: number };
    unreadCount: number;
  }> = [];

  for (const msg of messages) {
    const partnerId = msg.sender_id === session.id ? msg.receiver_id : msg.sender_id;
    const partner = msg.sender_id === session.id ? msg.receiver : msg.sender;

    if (!seen.has(partnerId)) {
      seen.add(partnerId);
      conversations.push({
        user: partner,
        lastMessage: {
          content: msg.content,
          created_at: msg.created_at.toISOString(),
          sender_id: msg.sender_id,
        },
        unreadCount: msg.receiver_id === session.id && !msg.read_at ? 1 : 0,
      });
    } else {
      const conv = conversations.find((c) => c.user.id === partnerId);
      if (conv && msg.receiver_id === session.id && !msg.read_at) {
        conv.unreadCount++;
      }
    }
  }

  return NextResponse.json(conversations);
}
