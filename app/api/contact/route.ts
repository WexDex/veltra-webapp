import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.message) {
    return NextResponse.json({ error: "name and message are required" }, { status: 400 });
  }

  const contact = await prisma.contact.create({
    data: { name: body.name, message: body.message },
  });

  const admins = await prisma.user.findMany({ where: { role: "admin" }, select: { id: true } });
  if (admins.length > 0) {
    await prisma.notification.createMany({
      data: admins.map((a) => ({
        user_id: a.id,
        type: "new_contact",
        ref_id: contact.id,
      })),
    });
  }

  return NextResponse.json(contact, { status: 201 });
}
