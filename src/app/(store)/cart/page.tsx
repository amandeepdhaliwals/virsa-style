"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const hasHydrated = useCartStore((s) => s._hasHydrated);
  const router = useRouter();
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 79;

  if (!hasHydrated) return null;

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    let message = "Hi! I'd like to order the following from *ਵਿਰਸਾ Style*:\n\n";
    items.forEach((item, i) => {
      message += `${i + 1}. *${item.name}*\n`;
      if (item.size) message += `   Size: ${item.size}\n`;
      if (item.color) message += `   Color: ${item.color}\n`;
      message += `   Qty: ${item.quantity}\n`;
      message += `   Price: ₹${(item.price * item.quantity).toLocaleString("en-IN")}\n\n`;
    });
    message += `*Total: ₹${totalPrice().toLocaleString("en-IN")}*\n\n`;
    message += "Please confirm availability and share payment details. Thank you!";

    const url = `https://wa.me/918289012150?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-pastel-rose mb-6" />
        <h1 className="font-serif text-3xl text-luxury-dark mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-luxury-text/60 mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/shop" className="btn-luxury inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-sm text-luxury-text/60 hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Continue Shopping
      </Link>

      <h1 className="font-serif text-3xl text-luxury-dark mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color}`}
              className="flex gap-4 bg-white p-4 border border-pastel-pink"
            >
              <Link href={`/shop/${item.slug}`} className="w-24 h-32 bg-pastel-cream flex-shrink-0 overflow-hidden">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-luxury-dark">
                      {item.name}
                    </h3>
                    <div className="text-xs text-luxury-text/60 mt-1 space-x-3">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    {item.wantStitching && (
                      <div className="mt-1.5">
                        <span className="text-[10px] tracking-wider uppercase bg-accent/10 text-accent px-2 py-0.5 inline-flex items-center gap-1">
                          ✂ With Stitching — ₹{item.stitchingPrice?.toLocaleString("en-IN")}
                        </span>
                        {item.customizations && (
                          <p className="text-[10px] text-luxury-text/40 mt-1">
                            {Object.entries(JSON.parse(item.customizations)).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.id, item.size, item.color)}
                    className="text-luxury-text/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center border border-pastel-rose">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1, item.size, item.color)
                      }
                      className="w-8 h-8 flex items-center justify-center text-luxury-text hover:text-accent"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-xs border-x border-pastel-rose">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1, item.size, item.color)
                      }
                      className="w-8 h-8 flex items-center justify-center text-luxury-text hover:text-accent"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-luxury-dark">
                    &#8377;{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-pastel-pink p-6 h-fit sticky top-24">
          <h2 className="text-xs tracking-[0.3em] uppercase text-luxury-dark mb-6">
            Order Summary
          </h2>
          <div className="space-y-3 border-b border-pastel-pink pb-4 mb-4">
            <div className="flex justify-between text-sm text-luxury-text">
              <span>Subtotal</span>
              <span>&#8377;{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm text-luxury-text">
              <span>Shipping</span>
              <span className={shipping === 0 ? "text-green-600" : ""}>
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-medium text-luxury-dark mb-6">
            <span>Estimated Total</span>
            <span>&#8377;{(subtotal + shipping).toLocaleString("en-IN")}</span>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="w-full btn-luxury py-4 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} />
            Proceed to Checkout
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-pastel-pink" /></div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[10px] tracking-wider uppercase text-luxury-text/40">or</span>
            </div>
          </div>

          <button
            onClick={handleWhatsAppOrder}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-xs tracking-[0.15em] uppercase transition-colors flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order on WhatsApp
          </button>

          <button
            onClick={clearCart}
            className="w-full mt-3 text-xs tracking-wider uppercase text-luxury-text/40 hover:text-red-400 transition-colors py-2"
          >
            Clear Cart
          </button>

          <div className="mt-4 pt-4 border-t border-pastel-pink space-y-2 text-[11px] text-luxury-text/50">
            <div className="flex items-center gap-2">
              <Truck size={12} />
              {subtotal >= 999 ? "Free shipping on this order!" : "Free shipping on orders above ₹999"}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} />
              7-day easy returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
