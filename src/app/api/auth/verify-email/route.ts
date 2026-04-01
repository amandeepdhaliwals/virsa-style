import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail, welcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { otp } = await req.json();

  if (!otp || otp.length !== 6) {
    return NextResponse.json({ error: "Please enter a valid 6-digit code" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.emailVerified) {
    return NextResponse.json({ message: "Email already verified" });
  }

  if (!user.verifyOtp || !user.verifyOtpExpiry) {
    return NextResponse.json({ error: "No verification code found. Please request a new one." }, { status: 400 });
  }

  if (new Date() > user.verifyOtpExpiry) {
    return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 });
  }

  if (user.verifyOtp !== otp) {
    return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });
  }

  // Verify email
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verifyOtp: null, verifyOtpExpiry: null },
  });

  // Send welcome email
  sendEmail({
    to: user.email,
    subject: "Welcome to ਵਿਰਸਾ Style! 🎉",
    html: welcomeEmail(user.name),
  });

  return NextResponse.json({ message: "Email verified successfully!" });
}
