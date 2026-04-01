import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");

  // Get product-specific options + global options (productId = null)
  const options = await prisma.stitchingOption.findMany({
    where: {
      OR: [
        { productId: productId || undefined },
        { productId: null },
      ],
    },
    orderBy: [
      { category: "asc" },
      { order: "asc" },
    ],
  });

  return NextResponse.json(options);
}
