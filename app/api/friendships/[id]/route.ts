import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { status } = body as { status: "accepted" | "declined" };

  const friendship = await prisma.friendship.findUnique({ where: { id: parseInt(id) } });
  if (!friendship) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (friendship.friend_id !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.friendship.update({
    where: { id: parseInt(id) },
    data: { status },
  });

  if (status === "accepted") {
    await prisma.notification.create({
      data: {
        user_id: friendship.user_id,
        type: "friend_accepted",
        from_user_id: session.id,
        ref_id: friendship.id,
      },
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const friendship = await prisma.friendship.findUnique({ where: { id: parseInt(id) } });
  if (!friendship) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (friendship.user_id !== session.id && friendship.friend_id !== session.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.friendship.delete({ where: { id: parseInt(id) } });
  return new NextResponse(null, { status: 204 });
}
