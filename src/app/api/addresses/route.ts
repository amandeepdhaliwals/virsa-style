import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });

  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as { id: string }).id;
    const { name, phone, line1, line2, city, state, pincode, country, isDefault } = await req.json();

    if (!name || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: { userId, name, phone, line1, line2, city, state, pincode, country: country || "India", isDefault: isDefault || false },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error("Address creation error:", error);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Address ID required" }, { status: 400 });
  }

  const userId = (session.user as { id: string }).id;

  // Verify ownership and not default
  const address = await prisma.address.findFirst({
    where: { id, userId },
  });

  if (!address) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  if (address.isDefault) {
    return NextResponse.json({ error: "Cannot delete default address" }, { status: 400 });
  }

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ message: "Address deleted" });
}
