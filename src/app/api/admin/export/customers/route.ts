import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    include: {
      orders: { select: { total: true } },
      addresses: { where: { isDefault: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const headers = ["Name", "Email", "Phone", "Email Verified", "Total Orders", "Total Spent", "City", "State", "Joined Date"];

  const rows = users.map((u) => [
    u.name,
    u.email,
    u.phone || "",
    u.emailVerified ? "Yes" : "No",
    u.orders.length,
    u.orders.reduce((sum, o) => sum + o.total, 0),
    u.addresses[0]?.city || "",
    u.addresses[0]?.state || "",
    new Date(u.createdAt).toLocaleDateString("en-IN"),
  ]);

  const csv = [headers, ...rows].map((row) =>
    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="customers-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
