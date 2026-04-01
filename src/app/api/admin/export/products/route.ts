import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const headers = ["Name", "SKU", "Category", "Type", "Price", "Compare Price", "Cost Price", "Stock", "Status", "Featured", "Stitching Available", "Base Stitching Price", "Sizes", "Colors", "Created"];

  const rows = products.map((p) => [
    p.name,
    p.sku || "",
    p.category.name,
    p.productType,
    p.price,
    p.comparePrice || "",
    p.costPrice || "",
    p.stock,
    p.status,
    p.featured ? "Yes" : "No",
    p.stitchingAvailable ? "Yes" : "No",
    p.baseStitchingPrice || "",
    p.sizes.join(", "),
    p.colors.join(", "),
    new Date(p.createdAt).toLocaleDateString("en-IN"),
  ]);

  const csv = [headers, ...rows].map((row) =>
    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="products-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
