"use client";

import { useState } from "react";
import { Search, Package, Truck, Check, Clock, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";

interface TrackingOrder {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  trackingId: string | null;
  items: { name: string; quantity: number; size?: string; color?: string; image?: string; price: number }[];
  address: { name: string; city: string; state: string; pincode: string };
}

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`);
      if (res.ok) {
        setOrder(await res.json());
      } else {
        const data = await res.json();
        setError(data.error || "Order not found");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const getStepIndex = (status: string) => {
    if (status === "CANCELLED") return -1;
    if (status === "RETURNED") return -1;
    return STATUS_STEPS.indexOf(status);
  };

  const stepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Track</p>
        <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">Track Your Order</h1>
        <p className="text-sm text-luxury-text/60 mt-2">Enter your order number and email to track</p>
      </div>

      <form onSubmit={handleTrack} className="bg-white border border-pastel-pink p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs tracking-wider uppercase text-luxury-text/50 block mb-2">
              Order Number
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="e.g. VS-20260329-XXXX"
              className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent uppercase"
              required
            />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-luxury-text/50 block mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-luxury w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Search size={16} />
          {loading ? "Tracking..." : "Track Order"}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 mb-6 text-center">{error}</div>
      )}

      {order && (
        <div className="bg-white border border-pastel-pink">
          {/* Order header */}
          <div className="p-6 border-b border-pastel-pink">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-luxury-text/50">Order</p>
                <p className="text-lg font-medium text-luxury-dark">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-luxury-text/50">Placed on</p>
                <p className="text-sm text-luxury-dark">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-luxury-text/50">Total</p>
                <p className="text-lg font-medium text-luxury-dark">
                  ₹{order.total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Status timeline */}
          <div className="p-6 border-b border-pastel-pink">
            {order.status === "CANCELLED" ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package size={24} className="text-red-500" />
                </div>
                <p className="text-sm font-medium text-red-600">Order Cancelled</p>
              </div>
            ) : order.status === "RETURNED" ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package size={24} className="text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-600">Order Returned</p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                {STATUS_STEPS.map((step, i) => {
                  const isCompleted = i <= stepIndex;
                  const isCurrent = i === stepIndex;
                  const icons = [Clock, Check, Package, Truck, MapPin];
                  const Icon = icons[i];
                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isCurrent
                              ? "bg-accent text-white"
                              : isCompleted
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-300"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <p className={`text-[10px] mt-2 tracking-wider uppercase text-center ${
                          isCompleted ? "text-luxury-dark" : "text-luxury-text/30"
                        }`}>
                          {step.charAt(0) + step.slice(1).toLowerCase()}
                        </p>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 mt-[-18px] ${
                          i < stepIndex ? "bg-green-300" : "bg-gray-200"
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {order.trackingId && (
              <p className="text-xs text-luxury-text mt-4 text-center">
                Tracking ID: <span className="font-medium text-luxury-dark">{order.trackingId}</span>
              </p>
            )}
          </div>

          {/* Items */}
          <div className="p-6">
            <p className="text-xs tracking-wider uppercase text-accent mb-4">Items Ordered</p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-pastel-cream" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-luxury-dark">{item.name}</p>
                    <p className="text-xs text-luxury-text/60">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && " | "}
                      {item.color && `Color: ${item.color}`}
                      {" "}Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm text-luxury-dark">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Link to login */}
      <div className="text-center mt-8">
        <p className="text-sm text-luxury-text/60">
          Have an account?{" "}
          <Link href="/account" className="text-accent hover:underline">
            View all orders <ChevronRight size={12} className="inline" />
          </Link>
        </p>
      </div>
    </div>
  );
}
