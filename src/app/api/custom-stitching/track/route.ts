import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Public tracking by order number + email
export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get("orderNumber");
  const email = req.nextUrl.searchParams.get("email");

  if (!orderNumber || !email) {
    return NextResponse.json({ error: "Order number and email required" }, { status: 400 });
  }

  const order = await prisma.customStitchingOrder.findUnique({
    where: { orderNumber },
  });

  if (!order || order.customerEmail !== email) {
    return NextResponse.json({ error: "Order not found. Check your order number and email." }, { status: 404 });
  }

  return NextResponse.json(order);
}
