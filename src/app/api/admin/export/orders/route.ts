import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { user: true, items: true, address: true },
    orderBy: { createdAt: "desc" },
  });

  // Build CSV
  const headers = ["Order Number", "Date", "Customer", "Email", "Phone", "Items", "Subtotal", "Shipping", "Discount", "Total", "Status", "Payment Status", "Payment Method", "Tracking ID", "City", "State", "Country", "Pincode"];

  const rows = orders.map((o) => [
    o.orderNumber,
    new Date(o.createdAt).toLocaleDateString("en-IN"),
    o.user.name,
    o.user.email,
    o.user.phone || "",
    o.items.map((i) => `${i.name} x${i.quantity}`).join("; "),
    o.subtotal,
    o.shipping,
    o.discount,
    o.total,
    o.status,
    o.paymentStatus,
    o.paymentMethod || "",
    o.trackingId || "",
    o.address.city,
    o.address.state,
    (o.address as { country?: string }).country || "India",
    o.address.pincode,
  ]);

  const csv = [headers, ...rows].map((row) =>
    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
