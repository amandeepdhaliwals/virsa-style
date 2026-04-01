import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  sendEmail,
  orderShippedEmail,
  orderDeliveredEmail,
  orderCancelledEmail,
} from "@/lib/email";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { status, paymentStatus, trackingId } = await req.json();
    const data: Record<string, string> = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;
    if (trackingId !== undefined) data.trackingId = trackingId;

    // Get previous status before update
    const prevOrder = await prisma.order.findUnique({
      where: { id: params.id },
      select: { status: true },
    });

    const order = await prisma.order.update({
      where: { id: params.id },
      data,
      include: {
        user: { select: { name: true, email: true } },
        items: true,
        address: true,
      },
    });

    // Send emails based on status change
    const prevStatus = prevOrder?.status;
    const newStatus = status || prevStatus;

    if (newStatus !== prevStatus && order.user.email) {
      if (newStatus === "SHIPPED") {
        sendEmail({
          to: order.user.email,
          subject: `Your Order ${order.orderNumber} Has Shipped! 🚚`,
          html: orderShippedEmail({
            customerName: order.user.name,
            orderNumber: order.orderNumber,
            trackingId: order.trackingId || trackingId || "Will be updated soon",
          }),
        });
      }

      if (newStatus === "DELIVERED") {
        sendEmail({
          to: order.user.email,
          subject: `Order ${order.orderNumber} Delivered! 🎉`,
          html: orderDeliveredEmail({
            customerName: order.user.name,
            orderNumber: order.orderNumber,
          }),
        });
      }

      if (newStatus === "CANCELLED") {
        sendEmail({
          to: order.user.email,
          subject: `Order ${order.orderNumber} Cancelled`,
          html: orderCancelledEmail({
            customerName: order.user.name,
            orderNumber: order.orderNumber,
            total: order.total,
          }),
        });
      }
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
