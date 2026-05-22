import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ user_id: session.id }, { friend_id: session.id }],
    },
    orderBy: { created_at: "desc" },
  });

  return NextResponse.json(friendships);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { friend_id } = body;

  if (!friend_id || friend_id === session.id) {
    return NextResponse.json({ error: "Invalid friend_id" }, { status: 400 });
  }

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { user_id: session.id, friend_id },
        { user_id: friend_id, friend_id: session.id },
      ],
    },
  });

  if (existing) {
    return NextResponse.json({ error: "Friendship already exists" }, { status: 409 });
  }

  const friendship = await prisma.friendship.create({
    data: { user_id: session.id, friend_id, status: "pending" },
  });

  await prisma.notification.create({
    data: {
      user_id: friend_id,
      type: "friend_request",
      from_user_id: session.id,
      ref_id: friendship.id,
    },
  });

  return NextResponse.json(friendship, { status: 201 });
}
