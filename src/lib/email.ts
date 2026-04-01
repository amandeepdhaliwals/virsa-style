import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("📧 Email skipped (SMTP not configured):", { to, subject });
    return;
  }

  try {
    await transporter.sendMail({
      from: `"ਵਿਰਸਾ Style" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("📧 Email sent to:", to);
  } catch (error) {
    console.error("📧 Email failed:", error);
  }
}

// ===== BASE TEMPLATE WRAPPER =====
function emailWrapper(content: string): string {
  return `
    <div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;color:#4A4A4A;background:#ffffff">
      <div style="text-align:center;padding:25px 0;border-bottom:2px solid #C48B9F">
        <span style="font-size:26px;color:#2D2D2D;font-weight:600">ਵਿਰਸਾ</span>
        <span style="font-size:20px;color:#C48B9F;font-style:italic;margin-left:6px">Style</span>
        <p style="font-size:8px;letter-spacing:3px;color:#999;text-transform:uppercase;margin:4px 0 0">Tradition Meets Elegance</p>
      </div>
      <div style="padding:30px 25px">${content}</div>
      <div style="text-align:center;padding:20px;background:#2D2D2D;color:#ffffff50;font-size:10px">
        <p style="margin:0">ਵਿਰਸਾ Style — Shop No. 26, Ganpati Square, Barnala, Punjab</p>
        <p style="margin:4px 0 0">WhatsApp: +91 8289012150 | hello@virsastyle.com</p>
        <p style="margin:8px 0 0">© ${new Date().getFullYear()} ਵਿਰਸਾ Style. All rights reserved.</p>
      </div>
    </div>
  `;
}

// ===== 1. WELCOME EMAIL (after verification) =====
export function welcomeEmail(customerName: string): string {
  return emailWrapper(`
    <h2 style="color:#2D2D2D;font-size:20px;margin:0 0 15px">Welcome to ਵਿਰਸਾ Style! 🎉</h2>
    <p>Hi ${customerName},</p>
    <p>Your email has been verified and your account is ready. Welcome to the ਵਿਰਸਾ Style family!</p>
    <p>Here's what you can do now:</p>
    <ul style="padding-left:20px;line-height:1.8">
      <li><strong>Shop</strong> our premium unstitched suits & footwear</li>
      <li><strong>Customize</strong> your own suit with our expert tailoring</li>
      <li><strong>Send your fabric</strong> for custom stitching</li>
      <li><strong>Track orders</strong> from your account dashboard</li>
    </ul>
    <p style="margin-top:20px">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/shop" style="background:#C48B9F;color:white;padding:12px 30px;text-decoration:none;display:inline-block;font-size:13px;letter-spacing:2px;text-transform:uppercase">Start Shopping</a>
    </p>
    <p style="font-size:12px;color:#999;margin-top:20px">Need help? WhatsApp us anytime at +91 8289012150</p>
  `);
}

// ===== 2. ORDER CONFIRMED =====
export function orderConfirmationEmail(order: {
  orderNumber: string;
  total: number;
  items: { name: string; quantity: number; price: number; size?: string | null; color?: string | null; wantStitching?: boolean }[];
  customerName: string;
}): string {
  const itemsHtml = order.items.map((item) =>
    `<tr>
      <td style="padding:10px;border-bottom:1px solid #f0e8ee">
        ${item.name}
        ${item.size ? ` <span style="color:#999">(${item.size})</span>` : ""}
        ${item.color ? ` <span style="color:#999">- ${item.color}</span>` : ""}
        ${item.wantStitching ? ' <span style="color:#C48B9F;font-size:11px">✂ Stitched</span>' : ""}
      </td>
      <td style="padding:10px;border-bottom:1px solid #f0e8ee;text-align:center">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #f0e8ee;text-align:right">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
    </tr>`
  ).join("");

  return emailWrapper(`
    <h2 style="color:#2D2D2D;font-size:20px;margin:0 0 15px">Order Confirmed! ✅</h2>
    <p>Hi ${order.customerName},</p>
    <p>Thank you for your order. We're preparing it with care.</p>
    <div style="background:#FFF8F0;padding:15px;margin:15px 0;border-left:3px solid #C48B9F">
      <strong>Order Number:</strong> ${order.orderNumber}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:13px;margin:15px 0">
      <thead><tr style="background:#F8E8EE">
        <th style="padding:10px;text-align:left">Item</th>
        <th style="padding:10px;text-align:center">Qty</th>
        <th style="padding:10px;text-align:right">Price</th>
      </tr></thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot><tr>
        <td colspan="2" style="padding:12px;font-weight:bold;text-align:right;border-top:2px solid #C48B9F">Total:</td>
        <td style="padding:12px;font-weight:bold;text-align:right;color:#C48B9F;border-top:2px solid #C48B9F">₹${order.total.toLocaleString("en-IN")}</td>
      </tr></tfoot>
    </table>
    <p>We'll notify you when your order ships.</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/account" style="color:#C48B9F;text-decoration:underline">Track your order →</a></p>
  `);
}

// ===== 3. ORDER SHIPPED =====
export function orderShippedEmail(data: {
  customerName: string;
  orderNumber: string;
  trackingId: string;
}): string {
  return emailWrapper(`
    <h2 style="color:#2D2D2D;font-size:20px;margin:0 0 15px">Your Order is Shipped! 🚚</h2>
    <p>Hi ${data.customerName},</p>
    <p>Great news! Your order <strong>${data.orderNumber}</strong> has been shipped and is on its way to you.</p>
    <div style="background:#F0FFF4;padding:15px;margin:15px 0;border-left:3px solid #48BB78">
      <strong>Tracking ID:</strong> ${data.trackingId}
    </div>
    <p>You can track your shipment using the tracking ID above.</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/track-order" style="background:#C48B9F;color:white;padding:12px 30px;text-decoration:none;display:inline-block;font-size:13px;letter-spacing:2px;text-transform:uppercase">Track Order</a></p>
    <p style="font-size:12px;color:#999;margin-top:15px">Estimated delivery: 3-5 business days (India) | 10-16 days (International)</p>
  `);
}

// ===== 4. ORDER DELIVERED =====
export function orderDeliveredEmail(data: {
  customerName: string;
  orderNumber: string;
}): string {
  return emailWrapper(`
    <h2 style="color:#2D2D2D;font-size:20px;margin:0 0 15px">Order Delivered! 🎉</h2>
    <p>Hi ${data.customerName},</p>
    <p>Your order <strong>${data.orderNumber}</strong> has been delivered. We hope you love your new outfit!</p>
    <p>If everything looks perfect, we'd love to hear from you:</p>
    <p style="margin-top:15px">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account" style="background:#C48B9F;color:white;padding:12px 30px;text-decoration:none;display:inline-block;font-size:13px;letter-spacing:2px;text-transform:uppercase">Leave a Review</a>
    </p>
    <p style="font-size:12px;color:#999;margin-top:15px">
      Any issues? Contact us within 7 days for returns (footwear & unstitched fabric only).
      WhatsApp: +91 8289012150
    </p>
  `);
}

// ===== 5. ORDER CANCELLED =====
export function orderCancelledEmail(data: {
  customerName: string;
  orderNumber: string;
  total: number;
  reason?: string;
}): string {
  return emailWrapper(`
    <h2 style="color:#2D2D2D;font-size:20px;margin:0 0 15px">Order Cancelled</h2>
    <p>Hi ${data.customerName},</p>
    <p>Your order <strong>${data.orderNumber}</strong> has been cancelled.</p>
    ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}
    <div style="background:#FFF5F5;padding:15px;margin:15px 0;border-left:3px solid #E53E3E">
      <strong>Refund:</strong> ₹${data.total.toLocaleString("en-IN")} will be refunded to your original payment method within 5-7 business days.
    </div>
    <p>If you didn't request this cancellation, please contact us immediately.</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/shop" style="color:#C48B9F;text-decoration:underline">Continue Shopping →</a></p>
  `);
}

// ===== 6. CUSTOM STITCHING ORDER PLACED =====
export function customStitchingOrderEmail(data: {
  customerName: string;
  orderNumber: string;
  suitType: string;
  totalPaid: number;
}): string {
  return emailWrapper(`
    <h2 style="color:#2D2D2D;font-size:20px;margin:0 0 15px">Custom Stitching Order Placed! ✂️</h2>
    <p>Hi ${data.customerName},</p>
    <p>Your custom stitching order has been placed successfully.</p>
    <div style="background:#FFF8F0;padding:15px;margin:15px 0;border-left:3px solid #C48B9F">
      <strong>Order:</strong> ${data.orderNumber}<br>
      <strong>Suit Type:</strong> ${data.suitType}<br>
      <strong>Total Paid:</strong> ₹${data.totalPaid.toLocaleString("en-IN")}
    </div>
    <h3 style="color:#2D2D2D;font-size:16px;margin:20px 0 10px">Next Step: Ship Your Fabric 📦</h3>
    <ol style="padding-left:20px;line-height:2">
      <li>Pack fabric in a <strong>plastic bag</strong> first (rain protection)</li>
      <li>Put in a <strong>cardboard box</strong> or thick envelope</li>
      <li>Write <strong>"${data.orderNumber}"</strong> and your phone number on the parcel</li>
      <li>Courier to: <strong>ਵਿਰਸਾ Style, Shop No. 26, Ganpati Square, Front of DMart, Barnala, Punjab — 148101</strong></li>
    </ol>
    <p>After we receive your fabric, stitching takes <strong>2 days</strong> + return shipping <strong>2 days</strong> = ~4-5 working days total. Return delivery is <strong>FREE</strong>.</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/custom-stitching/track" style="background:#C48B9F;color:white;padding:12px 30px;text-decoration:none;display:inline-block;font-size:13px;letter-spacing:2px;text-transform:uppercase">Track Your Order</a></p>
  `);
}

// ===== 7. FABRIC RECEIVED =====
export function fabricReceivedEmail(data: {
  customerName: string;
  orderNumber: string;
}): string {
  return emailWrapper(`
    <h2 style="color:#2D2D2D;font-size:20px;margin:0 0 15px">We Received Your Fabric! 📦✅</h2>
    <p>Hi ${data.customerName},</p>
    <p>We've received the fabric for your order <strong>${data.orderNumber}</strong>.</p>
    <p>Our tailor will review the fabric and your design choices. We'll confirm everything on WhatsApp before we start cutting.</p>
    <div style="background:#F0FFF4;padding:15px;margin:15px 0;border-left:3px solid #48BB78">
      <strong>What's next:</strong><br>
      ✅ Fabric received<br>
      ⏳ Tailor confirmation (today)<br>
      ✂️ Stitching (2 days)<br>
      🚚 Ship back to you (2 days)<br>
    </div>
    <p>We'll update you at every step.</p>
  `);
}

// ===== 8. STITCHING DONE =====
export function stitchingDoneEmail(data: {
  customerName: string;
  orderNumber: string;
}): string {
  return emailWrapper(`
    <h2 style="color:#2D2D2D;font-size:20px;margin:0 0 15px">Your Outfit is Ready! ✂️✅</h2>
    <p>Hi ${data.customerName},</p>
    <p>Great news! The stitching for your order <strong>${data.orderNumber}</strong> is complete.</p>
    <p>We're packing it carefully and will ship it to you shortly. You'll receive a tracking update once shipped.</p>
    <div style="background:#F0FFF4;padding:15px;margin:15px 0;border-left:3px solid #48BB78">
      ✅ Fabric received<br>
      ✅ Stitching complete<br>
      ⏳ Shipping to you now<br>
    </div>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/custom-stitching/track" style="color:#C48B9F;text-decoration:underline">Track your order →</a></p>
  `);
}

// ===== 9. CONTACT FORM — TO ADMIN =====
export function contactFormAdminEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): string {
  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
      <h2 style="color:#C48B9F">💬 New Contact Form Message</h2>
      <table style="width:100%;font-size:14px">
        <tr><td style="padding:6px 0;color:#888;width:80px">Name:</td><td style="padding:6px 0"><strong>${data.name}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#888">Email:</td><td style="padding:6px 0">${data.email}</td></tr>
        ${data.phone ? `<tr><td style="padding:6px 0;color:#888">Phone:</td><td style="padding:6px 0">${data.phone}</td></tr>` : ""}
        ${data.subject ? `<tr><td style="padding:6px 0;color:#888">Subject:</td><td style="padding:6px 0">${data.subject}</td></tr>` : ""}
      </table>
      <div style="background:#f5f5f5;padding:15px;margin:15px 0;border-left:3px solid #C48B9F">
        ${data.message}
      </div>
      <p style="font-size:12px;color:#999">Reply directly to this email to respond to the customer.</p>
    </div>
  `;
}

// ===== 10. CONTACT FORM — TO CUSTOMER =====
export function contactFormCustomerEmail(customerName: string): string {
  return emailWrapper(`
    <h2 style="color:#2D2D2D;font-size:20px;margin:0 0 15px">We Received Your Message! 💬</h2>
    <p>Hi ${customerName},</p>
    <p>Thank you for reaching out to ਵਿਰਸਾ Style. We've received your message and will get back to you within 24 hours.</p>
    <p>For urgent queries, you can WhatsApp us directly:</p>
    <p><a href="https://wa.me/918289012150" style="background:#25D366;color:white;padding:12px 30px;text-decoration:none;display:inline-block;font-size:13px">WhatsApp Us →</a></p>
  `);
}

// ===== 11. ADMIN — NEW ORDER NOTIFICATION =====
export function adminOrderNotificationEmail(order: {
  orderNumber: string;
  total: number;
  customerName: string;
  customerEmail: string;
  itemCount: number;
}): string {
  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
      <h2 style="color:#C48B9F">🛍 New Order Received!</h2>
      <table style="width:100%;font-size:14px">
        <tr><td style="padding:6px 0;color:#888">Order:</td><td style="padding:6px 0;font-weight:bold">${order.orderNumber}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Customer:</td><td style="padding:6px 0">${order.customerName} (${order.customerEmail})</td></tr>
        <tr><td style="padding:6px 0;color:#888">Items:</td><td style="padding:6px 0">${order.itemCount}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Total:</td><td style="padding:6px 0;font-weight:bold;color:#C48B9F">₹${order.total.toLocaleString("en-IN")}</td></tr>
      </table>
      <p style="margin-top:15px">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders" style="background:#C48B9F;color:white;padding:10px 20px;text-decoration:none;display:inline-block">View in Admin</a>
        <a href="https://wa.me/${order.customerEmail}?text=${encodeURIComponent(`Hi ${order.customerName}! Your order ${order.orderNumber} has been received. We'll process it shortly. — ਵਿਰਸਾ Style`)}" style="background:#25D366;color:white;padding:10px 20px;text-decoration:none;display:inline-block;margin-left:8px">WhatsApp Customer</a>
      </p>
    </div>
  `;
}

// ===== 12. ADMIN — NEW CUSTOM STITCHING ORDER =====
export function adminCustomStitchingEmail(data: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  suitType: string;
  totalPaid: number;
}): string {
  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
      <h2 style="color:#C48B9F">✂️ New Custom Stitching Order!</h2>
      <table style="width:100%;font-size:14px">
        <tr><td style="padding:6px 0;color:#888">Order:</td><td style="padding:6px 0;font-weight:bold">${data.orderNumber}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Customer:</td><td style="padding:6px 0">${data.customerName}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Phone:</td><td style="padding:6px 0">${data.customerPhone}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Suit:</td><td style="padding:6px 0">${data.suitType}</td></tr>
        <tr><td style="padding:6px 0;color:#888">Total:</td><td style="padding:6px 0;font-weight:bold;color:#C48B9F">₹${data.totalPaid.toLocaleString("en-IN")}</td></tr>
      </table>
      <p>Customer will ship fabric to shop. Watch for courier delivery.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/custom-orders" style="background:#C48B9F;color:white;padding:10px 20px;text-decoration:none;display:inline-block;margin-top:10px">View in Admin</a></p>
    </div>
  `;
}
