import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalProducts, totalEmployees, totalUsers, recentContacts] = await Promise.all([
    prisma.product.count(),
    prisma.employee.count(),
    prisma.user.count(),
    prisma.contact.findMany({ orderBy: { created_at: "desc" }, take: 5 }),
  ]);

  return NextResponse.json({ totalProducts, totalEmployees, totalUsers, recentContacts });
}
