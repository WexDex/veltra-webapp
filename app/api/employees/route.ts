import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function GET() {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const employees = await prisma.employee.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(employees);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.role) {
    return NextResponse.json({ error: "name and role are required" }, { status: 400 });
  }

  const employee = await prisma.employee.create({
    data: { name: body.name, role: body.role, phone: body.phone ?? null },
  });

  return NextResponse.json(employee, { status: 201 });
}
