import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail, orderConfirmationEmail, orderShippedEmail } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { user: true, items: true },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (type === "confirmation") {
    await sendEmail({
      to: order.user.email,
      subject: `Order Confirmed — ${order.orderNumber} | ਵਿਰਸਾ Style`,
      html: orderConfirmationEmail({
        orderNumber: order.orderNumber,
        total: order.total,
        items: order.items,
        customerName: order.user.name,
      }),
    });
  }

  if (type === "shipped") {
    await sendEmail({
      to: order.user.email,
      subject: `Your Order ${order.orderNumber} Has Shipped! 🚚`,
      html: orderShippedEmail({
        customerName: order.user.name,
        orderNumber: order.orderNumber,
        trackingId: order.trackingId || "Not available",
      }),
    });
  }

  return NextResponse.json({ message: "Email resent" });
}
