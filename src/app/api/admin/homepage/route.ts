import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHomepageContent, saveHomepageContent } from "@/lib/homepage-content";

export async function GET() {
  return NextResponse.json(getHomepageContent());
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await req.json();
  saveHomepageContent(content);
  return NextResponse.json({ message: "Homepage content saved" });
}
