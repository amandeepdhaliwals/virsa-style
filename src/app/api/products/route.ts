import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: `${slug}-${Date.now().toString(36)}`,
      sku: data.sku || null,
      description: data.description || null,
      price: parseFloat(data.price),
      comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
      costPrice: data.costPrice ? parseFloat(data.costPrice) : null,
      images: data.images || [],
      fabricImages: data.fabricImages || [],
      sizes: data.sizes || [],
      colors: data.colors || [],
      tags: data.tags || [],
      categoryId: data.categoryId,
      productType: data.productType || "DRESS",
      featured: data.featured || false,
      status: data.status || "ACTIVE",
      inStock: data.inStock !== false,
      stock: data.stock ? parseInt(data.stock) : 0,
      lowStockAt: data.lowStockAt ? parseInt(data.lowStockAt) : 5,
      weight: data.weight ? parseFloat(data.weight) : null,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
      // Suit-specific
      stitchingAvailable: data.stitchingAvailable || false,
      baseStitchingPrice: data.baseStitchingPrice ? parseFloat(data.baseStitchingPrice) : null,
      fabricType: data.fabricType || null,
      suitPieces: data.suitPieces || null,
      workType: data.workType || null,
      washCare: data.washCare || null,
      deliveryDays: data.deliveryDays ? parseInt(data.deliveryDays) : null,
    },
  });
  return NextResponse.json(product);
}
