import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (user.emailVerified) {
    return NextResponse.json({ message: "Email already verified" });
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: { verifyOtp: otp, verifyOtpExpiry: expiry },
  });

  // Send OTP email
  await sendEmail({
    to: user.email,
    subject: "Verify Your Email — ਵਿਰਸਾ Style",
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #2D2D2D; margin-bottom: 10px;">Verify Your Email</h2>
        <p style="color: #4A4A4A; font-size: 14px;">Hello ${user.name},</p>
        <p style="color: #4A4A4A; font-size: 14px;">Your verification code is:</p>
        <div style="background: #F8E8EE; border: 2px solid #C48B9F; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2D2D2D;">${otp}</span>
        </div>
        <p style="color: #4A4A4A; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
        <p style="color: #4A4A4A; font-size: 14px;">If you didn't create an account, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #F2D1D1; margin: 30px 0;" />
        <p style="color: #999; font-size: 11px;">ਵਿਰਸਾ Style — Tradition Meets Elegance</p>
      </div>
    `,
  });

  return NextResponse.json({ message: "Verification code sent to your email" });
}
