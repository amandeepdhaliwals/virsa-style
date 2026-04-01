import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// In-memory rate limiting (use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || "unknown";
  return `${ip}:${req.nextUrl.pathname}`;
}

function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimit.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimit.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > maxRequests;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimit.entries()) {
    if (now > entry.resetTime) rateLimit.delete(key);
  }
}, 5 * 60 * 1000);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // ===== Security Headers =====
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // ===== Rate Limiting =====

  // Login: 5 attempts per minute (brute force protection)
  if (pathname === "/api/auth/callback/customer-login" || pathname === "/api/auth/callback/admin-login") {
    const key = getRateLimitKey(req);
    if (isRateLimited(key, 5, 60 * 1000)) {
      return NextResponse.json({ error: "Too many login attempts. Wait 1 minute." }, { status: 429 });
    }
  }

  // Register: 3 per minute
  if (pathname === "/api/auth/register") {
    const key = getRateLimitKey(req);
    if (isRateLimited(key, 3, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }
  }

  // Password reset: 3 per minute
  if (pathname === "/api/auth/forgot-password") {
    const key = getRateLimitKey(req);
    if (isRateLimited(key, 3, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }
  }

  // Contact form: 5 per minute
  if (pathname === "/api/contact") {
    const key = getRateLimitKey(req);
    if (isRateLimited(key, 5, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }
  }

  // Order creation: 10 per minute
  if ((pathname === "/api/orders" || pathname === "/api/custom-stitching") && req.method === "POST") {
    const key = getRateLimitKey(req);
    if (isRateLimited(key, 10, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }
  }

  // Search: 30 per minute
  if (pathname === "/api/search") {
    const key = getRateLimitKey(req);
    if (isRateLimited(key, 30, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }
  }

  // ===== Admin Route Protection =====
  // Protect admin pages (except login) — requires admin session
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token as { role?: string }).role !== "admin") {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect admin API routes — requires admin session
  if (pathname.startsWith("/api/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || (token as { role?: string }).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
