import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user && (session.user as { role?: string }).role === "admin";
}

// PUT: Update customer (admin edits name, phone, notes, blocked)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) data.name = body.name;
  if (body.phone !== undefined) data.phone = body.phone || null;
  if (body.adminNotes !== undefined) data.adminNotes = body.adminNotes || null;
  if (body.blocked !== undefined) data.blocked = body.blocked;

  const user = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, phone: true, adminNotes: true, blocked: true },
  });

  return NextResponse.json(user);
}

// DELETE: Delete customer and all their data
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if customer has orders
  const orderCount = await prisma.order.count({ where: { userId: params.id } });

  if (orderCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete customer with ${orderCount} orders. You can block them instead.` },
      { status: 400 }
    );
  }

  // Delete customer (cascade deletes addresses, wishlist, reviews)
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Customer deleted" });
}
