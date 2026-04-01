import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail, orderCancelledEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { orderId, reason } = await req.json();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: user.id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!["PENDING", "CONFIRMED"].includes(order.status)) {
    return NextResponse.json(
      { error: `Cannot cancel order with status "${order.status}". Only pending or confirmed orders can be cancelled.` },
      { status: 400 }
    );
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
      notes: order.notes ? `${order.notes}\n\nCancellation reason: ${reason || "Not specified"}` : `Cancellation reason: ${reason || "Not specified"}`,
    },
  });

  // Send cancellation email to customer
  sendEmail({
    to: user.email,
    subject: `Order ${order.orderNumber} Cancelled — ਵਿਰਸਾ Style`,
    html: orderCancelledEmail({
      customerName: user.name,
      orderNumber: order.orderNumber,
      total: order.total,
      reason: reason || undefined,
    }),
  });

  // Notify admin
  if (process.env.ADMIN_EMAIL) {
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `❌ Order Cancelled — ${order.orderNumber}`,
      html: `<p>Order <strong>${order.orderNumber}</strong> cancelled by ${user.name} (${user.email}). Reason: ${reason || "Not specified"}. Total: ₹${order.total.toLocaleString("en-IN")}</p>`,
    });
  }

  return NextResponse.json({ status: updated.status, message: "Order cancelled successfully" });
}
