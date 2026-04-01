import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail, customStitchingOrderEmail, adminCustomStitchingEmail } from "@/lib/email";

function generateOrderNumber() {
  const prefix = "CS";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// GET: Fetch customer's custom stitching orders
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const orders = await prisma.customStitchingOrder.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

// POST: Create new custom stitching order
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const {
    customerName, customerPhone, customerEmail,
    addressLine1, addressLine2, city, state, pincode,
    suitType, neckStyle, sleeveStyle, extras, specialNotes,
    measurements, referenceImages,
    stitchingPrice, returnShipping, paymentMethod,
  } = body;

  // Validation
  if (!customerName || !customerPhone || !addressLine1 || !city || !state || !pincode) {
    return NextResponse.json({ error: "Address details are required" }, { status: 400 });
  }
  if (!suitType || !neckStyle || !sleeveStyle) {
    return NextResponse.json({ error: "Suit type and design details are required" }, { status: 400 });
  }
  if (!measurements) {
    return NextResponse.json({ error: "Measurements are required" }, { status: 400 });
  }

  const totalPaid = (stitchingPrice || 0) + (returnShipping || 100);

  const order = await prisma.customStitchingOrder.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: user.id,
      customerName,
      customerPhone,
      customerEmail: customerEmail || user.email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      suitType,
      neckStyle,
      sleeveStyle,
      extras: extras || [],
      specialNotes,
      measurements: typeof measurements === "string" ? measurements : JSON.stringify(measurements),
      referenceImages: referenceImages || [],
      stitchingPrice: stitchingPrice || 0,
      returnShipping: returnShipping || 100,
      totalPaid,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: "PAID",
    },
  });

  // Send confirmation email to customer
  sendEmail({
    to: order.customerEmail,
    subject: `Custom Stitching Order Placed — ${order.orderNumber} | ਵਿਰਸਾ Style`,
    html: customStitchingOrderEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      suitType: order.suitType,
      totalPaid: order.totalPaid,
    }),
  });

  // Notify admin
  if (process.env.ADMIN_EMAIL) {
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `✂️ New Custom Stitching Order — ${order.orderNumber}`,
      html: adminCustomStitchingEmail({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        suitType: order.suitType,
        totalPaid: order.totalPaid,
      }),
    });
  }

  return NextResponse.json(order, { status: 201 });
}
