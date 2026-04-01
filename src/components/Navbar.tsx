"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ShoppingBag, Menu, X, User, Heart, Home, Search as SearchIcon,
  Scissors, Phone, MapPin, Package, Globe, FileText, HelpCircle, ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useSession } from "next-auth/react";
import SearchBar from "./SearchBar";
import Logo from "./Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const isCustomer = session?.user && (session.user as { role?: string }).role === "customer";

  const items = useCartStore((s) => s.items);
  const hasHydrated = useCartStore((s) => s._hasHydrated);
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white border-b border-pastel-pink"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden text-luxury-dark"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Left nav */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/shop" className="text-sm tracking-widest uppercase text-luxury-text hover:text-accent transition-colors">
                Shop
              </Link>
              <Link href="/about" className="text-sm tracking-widest uppercase text-luxury-text hover:text-accent transition-colors">
                About
              </Link>
            </div>

            {/* Logo — centered, luxury style */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="flex items-baseline gap-1">
                <span className="text-[26px] md:text-[32px] text-luxury-dark leading-none tracking-wide" style={{ fontFamily: "'Gurmukhi', 'Noto Sans Gurmukhi', sans-serif", fontWeight: 600 }}>
                  ਵਿਰਸਾ
                </span>
                <span className="text-[22px] md:text-[28px] text-accent leading-none" style={{ fontFamily: "'PlayfairItalic', Georgia, serif", fontStyle: "italic", letterSpacing: "0.02em" }}>
                  Style
                </span>
              </div>
              <span className="text-[7px] md:text-[8px] tracking-[0.35em] uppercase text-luxury-text/40 mt-0.5">
                tradition meets elegance
              </span>
            </Link>

            {/* Right nav */}
            <div className="flex items-center space-x-4 lg:space-x-5">
              <Link href="/custom-stitching"
                className="hidden lg:block text-sm tracking-widest uppercase text-accent hover:text-accent-dark transition-colors font-medium">
                Custom Stitching
              </Link>
              <Link href="/contact"
                className="hidden lg:block text-sm tracking-widest uppercase text-luxury-text hover:text-accent transition-colors">
                Contact
              </Link>
              <SearchBar />
              {isCustomer && (
                <Link href="/wishlist" className="hidden sm:block text-luxury-dark hover:text-accent transition-colors">
                  <Heart size={20} />
                </Link>
              )}
              <Link href={isCustomer ? "/account" : "/login"}
                className="hidden sm:block text-luxury-dark hover:text-accent transition-colors">
                <User size={22} />
              </Link>
              <Link href="/cart" className="relative text-luxury-dark hover:text-accent transition-colors">
                <ShoppingBag size={22} />
                {hasHydrated && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer — slides from left */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={close}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl flex flex-col animate-[slideInLeft_0.3s_ease-out]">
            {/* Header with brand + close */}
            <div className="relative bg-gradient-to-br from-luxury-dark to-accent/80 text-white p-6 pb-8">
              <button onClick={close} className="absolute top-4 right-4 text-white/60 hover:text-white">
                <X size={22} />
              </button>
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-[30px] text-white leading-none tracking-wide" style={{ fontFamily: "'Gurmukhi', sans-serif", fontWeight: 600 }}>ਵਿਰਸਾ</span>
                  <span className="text-[24px] text-accent-light leading-none" style={{ fontFamily: "'PlayfairItalic', serif", fontStyle: "italic" }}>Style</span>
                </div>
                <span className="text-[7px] tracking-[0.35em] uppercase text-white/30 mt-0.5 block">
                  tradition meets elegance
                </span>
              </div>
              <p className="text-white/50 text-xs leading-relaxed">
                Luxury Boutique — Barnala, Punjab
              </p>

              {/* User info */}
              {isCustomer ? (
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                  <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-sm font-serif">
                    {(session?.user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-white">{session?.user?.name}</p>
                    <p className="text-[10px] text-white/40">{session?.user?.email}</p>
                  </div>
                </div>
              ) : (
                <Link href="/login" onClick={close}
                  className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 text-sm text-white/70 hover:text-white">
                  <User size={16} /> Sign In / Create Account
                </Link>
              )}
            </div>

            {/* Menu items */}
            <div className="flex-1 py-4">
              <div className="px-4 space-y-1">
                {[
                  { href: "/", icon: Home, label: "Home" },
                  { href: "/shop", icon: SearchIcon, label: "Shop All" },
                  { href: "/custom-stitching", icon: Scissors, label: "Custom Stitching", highlight: true },
                  { href: "/track-order", icon: Package, label: "Track Order" },
                  { href: "/worldwide-shipping", icon: Globe, label: "We Ship Worldwide" },
                  { href: "/about", icon: MapPin, label: "About Us" },
                  { href: "/contact", icon: Phone, label: "Contact" },
                  { href: "/faq", icon: HelpCircle, label: "FAQs" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={close}
                    className={`flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                      item.highlight
                        ? "text-accent font-medium hover:bg-accent/5"
                        : "text-luxury-dark hover:bg-pastel-cream"
                    }`}>
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={item.highlight ? "text-accent" : "text-luxury-text/40"} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-luxury-text/20" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-pastel-cream p-4">
              <a href="https://wa.me/918289012150" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm hover:bg-green-100 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-600 flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat with us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
