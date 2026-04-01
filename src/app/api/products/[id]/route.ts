import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  // Build update object — only include fields that are provided
  const update: Record<string, unknown> = {};

  if (data.name !== undefined) update.name = data.name;
  if (data.description !== undefined) update.description = data.description || null;
  if (data.sku !== undefined) update.sku = data.sku || null;
  if (data.price !== undefined) update.price = parseFloat(data.price);
  if (data.comparePrice !== undefined) update.comparePrice = data.comparePrice ? parseFloat(data.comparePrice) : null;
  if (data.costPrice !== undefined) update.costPrice = data.costPrice ? parseFloat(data.costPrice) : null;
  if (data.images !== undefined) update.images = data.images || [];
  if (data.fabricImages !== undefined) update.fabricImages = data.fabricImages || [];
  if (data.sizes !== undefined) update.sizes = data.sizes || [];
  if (data.colors !== undefined) update.colors = data.colors || [];
  if (data.tags !== undefined) update.tags = data.tags || [];
  if (data.categoryId !== undefined) update.categoryId = data.categoryId;
  if (data.productType !== undefined) update.productType = data.productType;
  if (data.featured !== undefined) update.featured = data.featured;
  if (data.status !== undefined) update.status = data.status;
  if (data.inStock !== undefined) update.inStock = data.inStock;
  if (data.stock !== undefined) update.stock = parseInt(data.stock) || 0;
  if (data.lowStockAt !== undefined) update.lowStockAt = parseInt(data.lowStockAt) || 5;
  if (data.weight !== undefined) update.weight = data.weight ? parseFloat(data.weight) : null;
  if (data.metaTitle !== undefined) update.metaTitle = data.metaTitle || null;
  if (data.metaDesc !== undefined) update.metaDesc = data.metaDesc || null;
  // Suit-specific
  if (data.stitchingAvailable !== undefined) update.stitchingAvailable = data.stitchingAvailable;
  if (data.baseStitchingPrice !== undefined) update.baseStitchingPrice = data.baseStitchingPrice ? parseFloat(data.baseStitchingPrice) : null;
  if (data.fabricType !== undefined) update.fabricType = data.fabricType || null;
  if (data.suitPieces !== undefined) update.suitPieces = data.suitPieces || null;
  if (data.workType !== undefined) update.workType = data.workType || null;
  if (data.washCare !== undefined) update.washCare = data.washCare || null;
  if (data.deliveryDays !== undefined) update.deliveryDays = data.deliveryDays ? parseInt(data.deliveryDays) : null;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: update,
  });
  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
