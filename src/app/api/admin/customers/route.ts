import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      emailVerified: true,
      adminNotes: true,
      blocked: true,
      createdAt: true,
      _count: { select: { orders: true, reviews: true, wishlist: true } },
      orders: {
        select: { total: true, status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const data = customers.map((c) => ({
    ...c,
    totalSpent: c.orders.reduce((sum, o) => o.status !== "CANCELLED" ? sum + o.total : sum, 0),
    orderCount: c._count.orders,
    orders: undefined,
  }));

  return NextResponse.json(data);
}
