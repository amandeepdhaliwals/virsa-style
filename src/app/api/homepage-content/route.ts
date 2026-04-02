import { NextResponse } from "next/server";
import { getHomepageContent } from "@/lib/homepage-content";

// Public GET — no auth needed (used by homepage)
export async function GET() {
  return NextResponse.json(getHomepageContent());
}
