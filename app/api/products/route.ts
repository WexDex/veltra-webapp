import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const limit = searchParams.get("limit");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category_id: parseInt(category) } : {}),
      ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
    },
    include: { category: true },
    orderBy: { created_at: "desc" },
    ...(limit ? { take: parseInt(limit) } : {}),
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.category_id) {
    return NextResponse.json({ error: "name and category_id are required" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description ?? null,
      image_url: body.image_url ?? null,
      category_id: parseInt(body.category_id),
    },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
