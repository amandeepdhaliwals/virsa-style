import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, orderTotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    if (!coupon.active) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    if (orderTotal && orderTotal < coupon.minOrder) {
      return NextResponse.json(
        { error: `Minimum order of ₹${coupon.minOrder.toLocaleString("en-IN")} required` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === "PERCENT") {
      discount = Math.round((orderTotal || 0) * (coupon.discountValue / 100));
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      message:
        coupon.discountType === "PERCENT"
          ? `${coupon.discountValue}% off applied!`
          : `₹${coupon.discountValue} off applied!`,
    });
  } catch {
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
