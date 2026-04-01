import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET reviews for a product
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const avg =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({ reviews, average: Math.round(avg * 10) / 10, total: reviews.length });
}

// POST a review
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "customer") {
    return NextResponse.json({ error: "Please sign in to leave a review" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { productId, rating, comment } = await req.json();

  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Valid product ID and rating (1-5) required" }, { status: 400 });
  }

  // Check if already reviewed
  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    // Update existing review
    const review = await prisma.review.update({
      where: { id: existing.id },
      data: { rating, comment },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json(review);
  }

  const review = await prisma.review.create({
    data: { userId, productId, rating, comment },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(review, { status: 201 });
}
