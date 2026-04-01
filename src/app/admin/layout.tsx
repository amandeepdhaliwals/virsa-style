"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart, Ticket,
  Users, LogOut, ArrowLeft, Menu, X, Scissors, Settings, Home
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayoutInner>{children}</AdminLayoutInner>
  );
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-light">
        <div className="animate-pulse text-accent text-sm">Loading...</div>
      </div>
    );
  }

  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    return null;
  }

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/homepage", label: "Homepage", icon: Home },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: FolderOpen },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/coupons", label: "Coupons", icon: Ticket },
    { href: "/admin/stitching", label: "Stitching Options", icon: Scissors },
    { href: "/admin/custom-orders", label: "Custom Orders", icon: Scissors },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  const sidebar = (
    <>
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-white/60 text-xs hover:text-white mb-4">
          <ArrowLeft size={14} /> Back to Store
        </Link>
        <span className="flex items-baseline gap-1.5">
          <span className="text-xl text-white leading-none" style={{ fontFamily: "'Gurmukhi', sans-serif", fontWeight: 600 }}>ਵਿਰਸਾ</span>
          <span className="text-sm text-accent-light leading-none" style={{ fontFamily: "'PlayfairItalic', serif", fontStyle: "italic" }}>Style</span>
        </span>
        <span className="text-[9px] tracking-[0.4em] uppercase text-white/40 block mt-1">Admin Panel</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 text-sm rounded transition-colors ${
              isActive(link.href)
                ? "bg-accent text-white"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <link.icon size={18} />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-white/40 mb-2 px-4 truncate">{session?.user?.email}</div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded w-full transition-colors"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-luxury-dark text-white flex-col fixed h-full z-30">
        {sidebar}
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-luxury-dark text-white z-30 flex items-center justify-between px-4 h-14">
        <button onClick={() => setSidebarOpen(true)} className="text-white/80">
          <Menu size={22} />
        </button>
        <div>
          <span className="flex items-baseline gap-1">
            <span className="text-lg text-white leading-none" style={{ fontFamily: "'Gurmukhi', sans-serif", fontWeight: 600 }}>ਵਿਰਸਾ</span>
            <span className="text-xs text-accent-light leading-none" style={{ fontFamily: "'PlayfairItalic', serif", fontStyle: "italic" }}>Style</span>
          </span>
        </div>
        <div className="w-6" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-luxury-dark text-white flex flex-col z-50 lg:hidden">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/60 hover:text-white">
              <X size={20} />
            </button>
            {sidebar}
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 bg-luxury-light min-h-screen p-4 pt-18 lg:p-8">
        <div className="lg:hidden h-14" /> {/* Spacer for mobile header */}
        {children}
      </main>
    </div>
  );
}
