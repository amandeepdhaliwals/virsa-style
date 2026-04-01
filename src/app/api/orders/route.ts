import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, orderConfirmationEmail, adminOrderNotificationEmail } from "@/lib/email";

function generateOrderNumber() {
  const prefix = "VS";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// GET: Fetch orders for logged-in customer
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

// POST: Create a new order
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as { id: string }).id;
    const { addressId, items, paymentMethod, notes } = await req.json();

    if (!addressId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Address and items are required" },
        { status: 400 }
      );
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    // Calculate totals from actual product prices
    let subtotal = 0;
    const orderItems: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      size?: string;
      color?: string;
      image?: string;
    }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      if (!product.inStock) {
        return NextResponse.json(
          { error: `${product.name} is out of stock` },
          { status: 400 }
        );
      }

      // Calculate item price (fabric + stitching if applicable)
      const itemPrice = item.wantStitching
        ? product.price + (item.stitchingPrice || 0)
        : product.price;

      subtotal += itemPrice * item.quantity;

      orderItems.push({
        productId: product.id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        size: item.size || undefined,
        color: item.color || undefined,
        image: product.images[0] || undefined,
        wantStitching: item.wantStitching || false,
        stitchingPrice: item.wantStitching ? (item.stitchingPrice || 0) : undefined,
        customizations: item.customizations || undefined,
        measurements: item.measurements || undefined,
        designReference: item.designReference || undefined,
      });
    }

    // Shipping calculation
    const shipping = subtotal >= 999 ? 0 : 79;
    const total = subtotal + shipping;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        addressId,
        subtotal,
        shipping,
        total,
        paymentMethod: paymentMethod || "COD",
        paymentStatus: paymentMethod === "COD" ? "COD" : "PENDING",
        notes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
        address: true,
      },
    });

    // Send order confirmation email to customer
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      sendEmail({
        to: user.email,
        subject: `Order Confirmed — ${order.orderNumber} | ਵਿਰਸਾ Style`,
        html: orderConfirmationEmail({
          orderNumber: order.orderNumber,
          total: order.total,
          items: order.items,
          customerName: user.name,
        }),
      });
    }

    // Notify admin
    if (process.env.ADMIN_EMAIL) {
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `🛍 New Order ${order.orderNumber} — ₹${order.total.toLocaleString("en-IN")}`,
        html: adminOrderNotificationEmail({
          orderNumber: order.orderNumber,
          total: order.total,
          customerName: user?.name || "Customer",
          customerEmail: user?.email || "",
          itemCount: order.items.length,
        }),
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
