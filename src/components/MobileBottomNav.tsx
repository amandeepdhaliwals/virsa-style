"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, Scissors } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useSession } from "next-auth/react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s._hasHydrated);
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const { data: session } = useSession();
  const isCustomer = session?.user && (session.user as { role?: string }).role === "customer";

  if (pathname.startsWith("/admin") || pathname === "/checkout") return null;

  const navItems = [
    { href: "/", icon: Home, label: "Home", active: pathname === "/" },
    { href: "/shop", icon: Search, label: "Shop", active: pathname === "/shop" || pathname.startsWith("/shop/") },
    { href: "/custom-stitching", icon: Scissors, label: "Stitching", active: pathname.startsWith("/custom-stitching") },
    { href: "/cart", icon: ShoppingBag, label: "Cart", active: pathname === "/cart" },
    { href: isCustomer ? "/account" : "/login", icon: User, label: isCustomer ? "Account" : "Login", active: pathname === "/account" || pathname === "/login" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        {/* Glass effect background */}
        <div className="bg-white/95 backdrop-blur-md border-t border-pastel-pink/80 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-around h-[60px] max-w-md mx-auto px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isCart = item.label === "Cart";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center justify-center flex-1 h-full relative group"
                >
                  {/* Active top indicator */}
                  {item.active && (
                    <span className="absolute top-0 w-10 h-[3px] bg-accent rounded-b-full" />
                  )}

                  {/* Icon container */}
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                    item.active ? "bg-accent/10" : "group-active:bg-pastel-cream"
                  }`}>
                    <Icon
                      size={19}
                      strokeWidth={item.active ? 2.2 : 1.5}
                      className={`transition-colors ${
                        item.active ? "text-accent" : "text-luxury-text/45"
                      }`}
                    />

                    {/* Cart badge */}
                    {isCart && hasHydrated && cartCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <span className={`text-[9px] mt-0.5 tracking-wide transition-colors ${
                    item.active ? "text-accent font-semibold" : "text-luxury-text/40"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Safe area for phones with gesture bars */}
        <div className="bg-white/95 h-[env(safe-area-inset-bottom)]" />
      </nav>

      {/* Spacer */}
      <div className="h-[60px] lg:hidden" />
    </>
  );
}
