import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    }

    // Delete any existing tokens for this email
    await prisma.passwordReset.deleteMany({ where: { email } });

    // Create new token (expires in 1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordReset.create({
      data: {
        email,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Reset Your Password — ਵਿਰਸਾ Style",
      html: `
        <div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;padding:20px;color:#4A4A4A">
          <div style="text-align:center;padding:20px 0;border-bottom:2px solid #C48B9F">
            <h1 style="font-size:24px;letter-spacing:0.2em;color:#2D2D2D;margin:0">VIRSA</h1>
            <p style="font-size:10px;letter-spacing:0.4em;color:#C48B9F;margin:0">STYLE</p>
          </div>
          <div style="padding:30px 0">
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <p style="text-align:center;margin:30px 0">
              <a href="${resetUrl}" style="background:#C48B9F;color:white;padding:14px 28px;text-decoration:none;font-size:14px;letter-spacing:0.1em;text-transform:uppercase">Reset Password</a>
            </p>
            <p style="font-size:13px;color:#888">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
