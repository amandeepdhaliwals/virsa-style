import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const SETTINGS_FILE = join(process.cwd(), "settings.json");

const DEFAULT_SETTINGS = {
  storeName: "ਵਿਰਸਾ Style",
  storeTagline: "Tradition Meets Elegance",
  storePhone: "+91 8289012150",
  storeEmail: "hello@virsastyle.com",
  storeAddress: "Shop No. 26, Ganpati Square, Front of DMart, Barnala, Punjab — 148101",
  businessHours: "Mon-Sat, 10 AM - 8 PM",
  domesticFreeShippingAbove: 999,
  domesticShippingRate: 79,
  internationalFreeShippingAbove: 5000,
  internationalShippingRate: 799,
  whatsappNumber: "918289012150",
};

function getSettings() {
  if (existsSync(SETTINGS_FILE)) {
    return JSON.parse(readFileSync(SETTINGS_FILE, "utf-8"));
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: Record<string, unknown>) {
  writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const current = getSettings();
  const updated = { ...current, ...body };
  saveSettings(updated);

  return NextResponse.json(updated);
}
