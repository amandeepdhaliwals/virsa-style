import { NextResponse } from "next/server";
import { sendEmail, contactFormAdminEmail, contactFormCustomerEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Send to admin
    sendEmail({
      to: process.env.ADMIN_EMAIL || "hello@virsastyle.com",
      subject: `Contact Form: ${subject || "General Inquiry"} — from ${name}`,
      html: contactFormAdminEmail({ name, email, phone, subject, message }),
    });

    // Auto-reply to customer
    sendEmail({
      to: email,
      subject: "We received your message — ਵਿਰਸਾ Style",
      html: contactFormCustomerEmail(name),
    });

    return NextResponse.json({ message: "Message sent successfully! We'll get back to you shortly." });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
