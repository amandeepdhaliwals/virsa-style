import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get("orderNumber");
  const email = req.nextUrl.searchParams.get("email");

  if (!orderNumber || !email) {
    return NextResponse.json({ error: "Order number and email are required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      user: { select: { email: true } },
      items: true,
      address: true,
    },
  });

  if (!order || order.user.email !== email) {
    return NextResponse.json({ error: "Order not found. Check your order number and email." }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    total: order.total,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    trackingId: order.trackingId,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.image,
      price: item.price,
    })),
    address: {
      name: order.address.name,
      city: order.address.city,
      state: order.address.state,
      pincode: order.address.pincode,
    },
  });
}
