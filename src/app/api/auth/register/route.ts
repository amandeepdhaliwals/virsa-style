import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        emailVerified: false,
        verifyOtp: otp,
        verifyOtpExpiry: otpExpiry,
      },
    });

    // Send verification email
    sendEmail({
      to: email,
      subject: "Verify Your Email — ਵਿਰਸਾ Style",
      html: `
        <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #2D2D2D; margin-bottom: 10px;">Welcome to ਵਿਰਸਾ Style!</h2>
          <p style="color: #4A4A4A; font-size: 14px;">Hello ${name},</p>
          <p style="color: #4A4A4A; font-size: 14px;">Thank you for creating your account. Please verify your email with this code:</p>
          <div style="background: #F8E8EE; border: 2px solid #C48B9F; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2D2D2D;">${otp}</span>
          </div>
          <p style="color: #4A4A4A; font-size: 14px;">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #4A4A4A; font-size: 14px;">If you didn't create this account, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #F2D1D1; margin: 30px 0;" />
          <p style="color: #999; font-size: 11px;">ਵਿਰਸਾ Style — Tradition Meets Elegance</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Account created! Please verify your email.", userId: user.id, requiresVerification: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
