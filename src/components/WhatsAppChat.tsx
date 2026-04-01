"use client";

import { useState, useEffect, useRef } from "react";
import { X, MessageCircle, Package, Scissors, Ruler, ShoppingBag, HelpCircle } from "lucide-react";

const WHATSAPP_NUMBER = "918289012150";

const CATEGORIES = [
  {
    icon: Package,
    label: "Order Status / Tracking",
    message: "Hi! I need help with my order status/tracking.\n\nMy order number: ",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Scissors,
    label: "Custom Stitching Query",
    message: "Hi! I have a question about custom stitching service.\n\n",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Ruler,
    label: "Measurement Help",
    message: "Hi! I need help with my body measurements for stitching.\n\n",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: ShoppingBag,
    label: "Product Inquiry",
    message: "Hi! I want to know more about a product.\n\nProduct: ",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: HelpCircle,
    label: "Other Question",
    message: "Hi! I have a question.\n\n",
    color: "text-accent bg-accent/10",
  },
];

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hide pulse after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="fixed bottom-20 right-4 z-50 lg:bottom-8 lg:right-8">
      {/* Chat popup */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[320px] bg-white border border-pastel-pink shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
          {/* Header */}
          <div className="bg-green-600 text-white px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">ਵਿਰਸਾ Style</p>
                  <p className="text-[10px] text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                    Usually replies within minutes
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Welcome message */}
          <div className="px-5 py-4 bg-pastel-cream/50">
            <div className="bg-white p-3 rounded-lg shadow-sm text-sm text-luxury-text relative">
              <div className="absolute -top-1 left-4 w-3 h-3 bg-white rotate-45" />
              <p className="font-medium text-luxury-dark mb-1">Hello! 👋</p>
              <p className="text-xs text-luxury-text/70 leading-relaxed">
                Welcome to ਵਿਰਸਾ Style. How can we help you today? Select a topic below.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="px-4 py-3 space-y-2 max-h-[300px] overflow-y-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.label}
                  onClick={() => openWhatsApp(cat.message)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-pastel-pink hover:border-accent/50 hover:bg-pastel-cream/30 transition-all text-left group"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-luxury-dark group-hover:text-accent transition-colors">{cat.label}</p>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green-600 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-pastel-pink bg-pastel-cream/30">
            <p className="text-[10px] text-luxury-text/40 text-center">
              Powered by WhatsApp · Mon-Sat, 10 AM - 8 PM
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-luxury-dark text-white rotate-0"
            : "bg-green-500 hover:bg-green-600 text-white hover:scale-110"
        }`}
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <>
            <MessageCircle size={24} />
            {/* Pulse animation */}
            {showPulse && (
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
            )}
            {/* Notification dot */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
              1
            </span>
          </>
        )}
      </button>
    </div>
  );
}
