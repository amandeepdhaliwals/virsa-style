"use client";

import Link from "next/link";
import { useState } from "react";
import { Instagram, Facebook, Mail, Phone, Send } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subMsg, setSubMsg] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubLoading(true);
    setSubMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubMsg(data.message);
        setEmail("");
      } else {
        setSubMsg(data.error);
      }
    } catch {
      setSubMsg("Something went wrong");
    }
    setSubLoading(false);
  };

  return (
    <footer className="bg-luxury-dark text-white/80">
      {/* Newsletter Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-xl text-white">Stay in Style</h3>
              <p className="text-xs text-white/50 mt-1">
                Get exclusive offers, new arrivals & styling tips. No spam, ever.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSubMsg(""); }}
                placeholder="Your email address"
                className="flex-1 md:w-64 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent"
                required
              />
              <button
                type="submit"
                disabled={subLoading}
                className="px-6 py-3 bg-accent text-white text-xs tracking-wider uppercase hover:bg-accent-dark transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={14} />
                {subLoading ? "..." : "Subscribe"}
              </button>
            </form>
          </div>
          {subMsg && (
            <p className={`text-xs mt-3 text-center md:text-right ${subMsg.includes("Success") ? "text-green-400" : "text-red-400"}`}>
              {subMsg}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3">
              <div className="flex items-baseline gap-1">
                <span className="text-[26px] text-white leading-none tracking-wide" style={{ fontFamily: "'Gurmukhi', sans-serif", fontWeight: 600 }}>ਵਿਰਸਾ</span>
                <span className="text-[22px] text-accent-light leading-none" style={{ fontFamily: "'PlayfairItalic', serif", fontStyle: "italic" }}>Style</span>
              </div>
              <span className="text-[7px] tracking-[0.35em] uppercase text-white/25 mt-0.5 block">
                tradition meets elegance
              </span>
            </div>
            <p className="text-xs leading-relaxed text-white/50 max-w-xs">
              Curating elegance for the modern woman. Premium clothing & footwear
              that celebrates your unique style.
            </p>
            <div className="flex items-center gap-4 mt-4 md:hidden">
              <a href="https://wa.me/918289012150" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-accent-light"><Phone size={16} /></a>
              <a href="mailto:hello@virsastyle.com" className="text-white/50 hover:text-accent-light"><Mail size={16} /></a>
              <a href="#" className="text-white/50 hover:text-accent-light"><Instagram size={16} /></a>
              <a href="#" className="text-white/50 hover:text-accent-light"><Facebook size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/custom-stitching", label: "Custom Stitching" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQs" },
                { href: "/track-order", label: "Track Order" },
                { href: "/worldwide-shipping", label: "🌍 We Ship Worldwide" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-white/50 hover:text-accent-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-white mb-4">Customer Care</h4>
            <ul className="space-y-2">
              {[
                { href: "/shipping", label: "Shipping" },
                { href: "/returns", label: "Returns" },
                { href: "/size-guide", label: "Size Guide" },
                { href: "/privacy-policy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-white/50 hover:text-accent-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="hidden md:block">
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-white mb-4">Get in Touch</h4>
            <div className="space-y-2">
              <a href="https://wa.me/918289012150" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-white/50 hover:text-accent-light transition-colors">
                <Phone size={14} /> +91 8289012150
              </a>
              <a href="mailto:hello@virsastyle.com"
                className="flex items-center gap-2 text-xs text-white/50 hover:text-accent-light transition-colors">
                <Mail size={14} /> hello@virsastyle.com
              </a>
              <div className="flex gap-4 pt-2">
                <a href="#" className="text-white/50 hover:text-accent-light transition-colors"><Instagram size={18} /></a>
                <a href="#" className="text-white/50 hover:text-accent-light transition-colors"><Facebook size={18} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center">
          <p className="text-[10px] text-white/30 tracking-wider">
            &copy; {new Date().getFullYear()} ਵਿਰਸਾ Style. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
