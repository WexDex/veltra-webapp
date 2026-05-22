import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [users, friendships] = await Promise.all([
    prisma.user.findMany({
      where: { id: { not: session.id } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.friendship.findMany({
      where: {
        OR: [{ user_id: session.id }, { friend_id: session.id }],
      },
    }),
  ]);

  const usersWithFriendship = users.map((user) => {
    const friendship = friendships.find(
      (f) => f.user_id === user.id || f.friend_id === user.id
    );
    if (!friendship) return user;

    return {
      ...user,
      friendshipId: friendship.id,
      friendshipStatus: friendship.status as "pending" | "accepted" | "declined",
      friendshipInitiator: friendship.user_id === session.id,
    };
  });

  return NextResponse.json(usersWithFriendship);
}
