import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail, fabricReceivedEmail, stitchingDoneEmail, orderShippedEmail } from "@/lib/email";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const role = (session.user as { role?: string }).role;

  if (role === "admin") {
    // Get previous status
    const prevOrder = await prisma.customStitchingOrder.findUnique({
      where: { id: params.id },
      select: { status: true, customerName: true, customerEmail: true, orderNumber: true },
    });

    const order = await prisma.customStitchingOrder.update({
      where: { id: params.id },
      data: body,
    });

    // Send emails on status change
    if (body.status && body.status !== prevOrder?.status && prevOrder?.customerEmail) {
      const email = prevOrder.customerEmail;
      const name = prevOrder.customerName;
      const orderNum = prevOrder.orderNumber;

      if (body.status === "FABRIC_RECEIVED") {
        sendEmail({
          to: email,
          subject: `We Received Your Fabric! — ${orderNum}`,
          html: fabricReceivedEmail({ customerName: name, orderNumber: orderNum }),
        });
      }

      if (body.status === "STITCHING_DONE") {
        sendEmail({
          to: email,
          subject: `Your Outfit is Ready! — ${orderNum}`,
          html: stitchingDoneEmail({ customerName: name, orderNumber: orderNum }),
        });
      }

      if (body.status === "SHIPPED_BACK") {
        sendEmail({
          to: email,
          subject: `Your Stitched Outfit is Shipped! — ${orderNum}`,
          html: orderShippedEmail({
            customerName: name,
            orderNumber: orderNum,
            trackingId: body.returnTrackingNumber || order.returnTrackingNumber || "Will be updated",
          }),
        });
      }
    }

    return NextResponse.json(order);
  }

  // Customer can only update fabric tracking
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const order = await prisma.customStitchingOrder.findFirst({
    where: { id: params.id, userId: user.id },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const updated = await prisma.customStitchingOrder.update({
    where: { id: params.id },
    data: {
      fabricCourierName: body.fabricCourierName || order.fabricCourierName,
      fabricTrackingNumber: body.fabricTrackingNumber || order.fabricTrackingNumber,
      status: body.fabricTrackingNumber ? "FABRIC_SHIPPED" : order.status,
    },
  });

  return NextResponse.json(updated);
}
