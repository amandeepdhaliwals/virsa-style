import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { orderNumber: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;

  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: { user: true, items: true, address: true },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // Customers can only see their own invoices
  if (role !== "admin" && order.user.email !== session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${order.orderNumber} — ਵਿਰਸਾ Style</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; color: #2D2D2D; font-size: 13px; }
    .invoice { max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #C48B9F; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: 600; }
    .logo span { color: #C48B9F; font-style: italic; font-size: 22px; margin-left: 5px; }
    .tagline { font-size: 9px; color: #999; letter-spacing: 3px; text-transform: uppercase; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { font-size: 28px; color: #C48B9F; font-weight: normal; letter-spacing: 5px; text-transform: uppercase; }
    .invoice-title p { font-size: 12px; color: #666; margin-top: 4px; }
    .meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .meta-box { width: 48%; }
    .meta-box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #C48B9F; margin-bottom: 8px; }
    .meta-box p { font-size: 13px; color: #4A4A4A; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { background: #F8E8EE; color: #2D2D2D; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; padding: 12px 15px; text-align: left; }
    td { padding: 12px 15px; border-bottom: 1px solid #F2D1D1; font-size: 13px; }
    td.right, th.right { text-align: right; }
    .totals { width: 300px; margin-left: auto; }
    .totals tr td { border: none; padding: 6px 15px; }
    .totals .total-row { font-size: 16px; font-weight: bold; border-top: 2px solid #C48B9F; padding-top: 12px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 11px; }
    .badge { display: inline-block; padding: 2px 8px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; }
    .badge-paid { background: #d4edda; color: #155724; }
    .badge-pending { background: #fff3cd; color: #856404; }
    .badge-cod { background: #e2e3e5; color: #383d41; }
    .stitch-note { font-size: 11px; color: #C48B9F; margin-top: 3px; }
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } .invoice { padding: 20px; } }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div>
        <div class="logo">ਵਿਰਸਾ <span>Style</span></div>
        <div class="tagline">Tradition Meets Elegance</div>
        <p style="font-size: 11px; color: #666; margin-top: 10px;">
          Shop No. 26, Ganpati Square<br>
          Front of DMart, Barnala, Punjab — 148101<br>
          Ph: +91 8289012150 | hello@virsastyle.com
        </p>
      </div>
      <div class="invoice-title">
        <h1>Invoice</h1>
        <p><strong>${order.orderNumber}</strong></p>
        <p>Date: ${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        <p style="margin-top: 8px;">
          <span class="badge ${order.paymentStatus === "PAID" ? "badge-paid" : order.paymentStatus === "COD" ? "badge-cod" : "badge-pending"}">
            ${order.paymentStatus}
          </span>
        </p>
      </div>
    </div>

    <div class="meta">
      <div class="meta-box">
        <h3>Bill To</h3>
        <p>
          <strong>${order.user.name}</strong><br>
          ${order.user.email}<br>
          ${order.user.phone || ""}
        </p>
      </div>
      <div class="meta-box">
        <h3>Ship To</h3>
        <p>
          <strong>${order.address.name}</strong><br>
          ${order.address.line1}${order.address.line2 ? ", " + order.address.line2 : ""}<br>
          ${order.address.city}, ${order.address.state} — ${order.address.pincode}<br>
          Ph: ${order.address.phone}
        </p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Item</th>
          <th>Details</th>
          <th class="right">Qty</th>
          <th class="right">Price</th>
          <th class="right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((item, i) => `
          <tr>
            <td>${i + 1}</td>
            <td><strong>${item.name}</strong>${item.wantStitching ? '<div class="stitch-note">✂ With Stitching</div>' : ""}</td>
            <td>${[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" | ") || "—"}</td>
            <td class="right">${item.quantity}</td>
            <td class="right">₹${item.price.toLocaleString("en-IN")}</td>
            <td class="right">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <table class="totals">
      <tr>
        <td>Subtotal</td>
        <td class="right">₹${order.subtotal.toLocaleString("en-IN")}</td>
      </tr>
      <tr>
        <td>Shipping</td>
        <td class="right">${order.shipping === 0 ? "Free" : "₹" + order.shipping.toLocaleString("en-IN")}</td>
      </tr>
      ${order.discount > 0 ? `
      <tr>
        <td>Discount</td>
        <td class="right" style="color: green;">-₹${order.discount.toLocaleString("en-IN")}</td>
      </tr>` : ""}
      <tr class="total-row">
        <td><strong>Total</strong></td>
        <td class="right"><strong>₹${order.total.toLocaleString("en-IN")}</strong></td>
      </tr>
    </table>

    <p style="font-size: 11px; color: #666; margin-top: 20px;">
      <strong>Payment Method:</strong> ${order.paymentMethod || "N/A"}<br>
      ${order.trackingId ? `<strong>Tracking ID:</strong> ${order.trackingId}<br>` : ""}
      ${order.notes ? `<strong>Notes:</strong> ${order.notes}` : ""}
    </p>

    <div class="footer">
      <p>Thank you for shopping with ਵਿਰਸਾ Style!</p>
      <p style="margin-top: 5px;">This is a computer-generated invoice. No signature required.</p>
      <p style="margin-top: 5px;">Questions? WhatsApp us at +91 8289012150</p>
    </div>
  </div>

  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
