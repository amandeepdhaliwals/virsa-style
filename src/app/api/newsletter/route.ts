import { NextRequest, NextResponse } from "next/server";

// For MVP, we'll store subscribers in a simple approach
// In production, integrate with Mailchimp, ConvertKit, etc.
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // Log the subscriber (in production, save to DB or send to email service)
  console.log(`[Newsletter] New subscriber: ${email}`);

  return NextResponse.json({ message: "Successfully subscribed! You'll receive our latest updates." });
}
