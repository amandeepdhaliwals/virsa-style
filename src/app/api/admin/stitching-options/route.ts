import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user && (session.user as { role?: string }).role === "admin";
}

export async function GET() {
  const options = await prisma.stitchingOption.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(options);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, category, name, price, isDefault } = await req.json();

  if (!category || !name) {
    return NextResponse.json({ error: "Category and name required" }, { status: 400 });
  }

  const option = await prisma.stitchingOption.create({
    data: {
      productId: productId || null,
      category,
      name,
      price: price || 0,
      isDefault: isDefault || false,
    },
  });

  return NextResponse.json(option, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  await prisma.stitchingOption.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
