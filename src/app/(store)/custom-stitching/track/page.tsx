"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, Truck, Scissors, Check, Clock, ArrowRight } from "lucide-react";

interface CSOrder {
  orderNumber: string;
  status: string;
  suitType: string;
  neckStyle: string;
  sleeveStyle: string;
  extras: string[];
  totalPaid: number;
  fabricCourierName?: string;
  fabricTrackingNumber?: string;
  fabricReceivedAt?: string;
  returnCourierName?: string;
  returnTrackingNumber?: string;
  shippedBackAt?: string;
  resultImages: string[];
  adminNotes?: string;
  createdAt: string;
}

const STEPS = [
  { key: "ORDER_PLACED", label: "Order Placed", icon: Clock, desc: "Pay & place your order" },
  { key: "FABRIC_SHIPPED", label: "Fabric Shipped", icon: Truck, desc: "You ship fabric to our shop" },
  { key: "FABRIC_RECEIVED", label: "Fabric Received", icon: Package, desc: "We received your fabric" },
  { key: "STITCHING_STARTED", label: "Stitching Started", icon: Scissors, desc: "Tailor has started work" },
  { key: "STITCHING_DONE", label: "Stitching Done", icon: Check, desc: "Your outfit is ready" },
  { key: "SHIPPED_BACK", label: "Shipped to You", icon: Truck, desc: "On the way to you" },
  { key: "DELIVERED", label: "Delivered", icon: Check, desc: "You received your outfit" },
];

export default function TrackCustomStitchingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<CSOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fabric tracking update
  const [showTrackingForm, setShowTrackingForm] = useState(false);
  const [courierName, setCourierName] = useState("");
  const [trackingNum, setTrackingNum] = useState("");
  const [trackingMsg, setTrackingMsg] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/custom-stitching/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`);
      if (res.ok) {
        setOrder(await res.json());
      } else {
        const data = await res.json();
        setError(data.error || "Order not found");
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  const getStepIndex = (status: string) => {
    if (status === "CANCELLED") return -1;
    return STEPS.findIndex((s) => s.key === status);
  };

  const stepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Track</p>
        <h1 className="font-serif text-3xl text-luxury-dark">Track Custom Stitching Order</h1>
      </div>

      {/* Search form */}
      <form onSubmit={handleTrack} className="bg-white border border-pastel-pink p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs tracking-wider uppercase text-luxury-text/50 block mb-2">Order Number</label>
            <input type="text" value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="e.g. CS-XXXXXX-XXX"
              className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent uppercase" required />
          </div>
          <div>
            <label className="text-xs tracking-wider uppercase text-luxury-text/50 block mb-2">Email</label>
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="btn-luxury w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50">
          <Search size={16} />
          {loading ? "Tracking..." : "Track Order"}
        </button>
      </form>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 mb-6 text-center">{error}</div>}

      {order && (
        <div className="bg-white border border-pastel-pink">
          {/* Header */}
          <div className="p-6 border-b border-pastel-pink">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-xs text-luxury-text/50">Order</p>
                <p className="text-lg font-medium text-luxury-dark">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-luxury-text/50">Suit Type</p>
                <p className="text-sm text-luxury-dark">{order.suitType}</p>
              </div>
              <div>
                <p className="text-xs text-luxury-text/50">Total Paid</p>
                <p className="text-lg font-medium text-luxury-dark">₹{order.totalPaid.toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-luxury-text/50">
              Design: {order.neckStyle} | {order.sleeveStyle}
              {order.extras.length > 0 && ` | ${order.extras.join(", ")}`}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="p-6">
            {order.status === "CANCELLED" ? (
              <div className="text-center py-4">
                <p className="text-sm font-medium text-red-600">Order Cancelled</p>
              </div>
            ) : (
              <div className="space-y-0">
                {STEPS.map((s, i) => {
                  const isCompleted = i <= stepIndex;
                  const isCurrent = i === stepIndex;
                  const Icon = s.icon;
                  return (
                    <div key={s.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCurrent ? "bg-accent text-white" : isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-300"
                        }`}>
                          <Icon size={18} />
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`w-0.5 h-8 ${i < stepIndex ? "bg-green-300" : "bg-gray-200"}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-medium ${isCompleted ? "text-luxury-dark" : "text-luxury-text/30"}`}>
                          {s.label}
                        </p>
                        <p className={`text-xs ${isCompleted ? "text-luxury-text/60" : "text-luxury-text/20"}`}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add fabric tracking — show when ORDER_PLACED */}
          {order.status === "ORDER_PLACED" && (
            <div className="p-6 border-t border-pastel-pink">
              <p className="text-xs tracking-wider uppercase text-accent mb-3 font-medium">
                Next Step: Ship Your Fabric
              </p>
              <div className="bg-pastel-cream p-4 mb-4 text-sm">
                <p className="text-luxury-dark font-medium">Ship to:</p>
                <p className="text-luxury-text">ਵਿਰਸਾ Style Boutique, Shop No. 26, Ganpati Square, Front of DMart, Barnala, Punjab — 148101</p>
                <p className="text-xs text-luxury-text/50 mt-1">Write order number <strong>{order.orderNumber}</strong> on the parcel</p>
              </div>

              {!showTrackingForm ? (
                <button onClick={() => setShowTrackingForm(true)}
                  className="btn-outline-luxury flex items-center gap-2 text-sm">
                  <Truck size={14} /> I&apos;ve Shipped My Fabric — Add Tracking
                </button>
              ) : (
                <div className="space-y-3">
                  <input type="text" value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="Courier name (e.g. DTDC, BlueDart)"
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" />
                  <input type="text" value={trackingNum}
                    onChange={(e) => setTrackingNum(e.target.value)}
                    placeholder="Tracking number / AWB number"
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" />
                  {trackingMsg && <p className="text-green-600 text-sm">{trackingMsg}</p>}
                  <button
                    onClick={async () => {
                      if (!courierName || !trackingNum) return;
                      const res = await fetch(`/api/custom-stitching/${order.orderNumber}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fabricCourierName: courierName, fabricTrackingNumber: trackingNum }),
                      });
                      if (res.ok) {
                        setTrackingMsg("Tracking updated! We'll confirm when we receive your fabric.");
                        setShowTrackingForm(false);
                      }
                    }}
                    className="btn-luxury w-full py-3"
                  >
                    Submit Tracking Details
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Show fabric tracking info */}
          {order.fabricTrackingNumber && (
            <div className="p-6 border-t border-pastel-pink">
              <p className="text-xs tracking-wider uppercase text-luxury-text/50 mb-2">Your Fabric Courier</p>
              <p className="text-sm text-luxury-dark">{order.fabricCourierName} — {order.fabricTrackingNumber}</p>
            </div>
          )}

          {/* Show return tracking */}
          {order.returnTrackingNumber && (
            <div className="p-6 border-t border-pastel-pink">
              <p className="text-xs tracking-wider uppercase text-luxury-text/50 mb-2">Return Shipment</p>
              <p className="text-sm text-luxury-dark">{order.returnCourierName} — {order.returnTrackingNumber}</p>
            </div>
          )}

          {/* Result images */}
          {order.resultImages.length > 0 && (
            <div className="p-6 border-t border-pastel-pink">
              <p className="text-xs tracking-wider uppercase text-accent mb-3">Your Stitched Outfit</p>
              <div className="grid grid-cols-3 gap-2">
                {order.resultImages.map((img, i) => (
                  <img key={i} src={img} alt="" className="w-full aspect-square object-cover" />
                ))}
              </div>
            </div>
          )}

          {/* Admin notes */}
          {order.adminNotes && (
            <div className="p-6 border-t border-pastel-pink">
              <p className="text-xs tracking-wider uppercase text-luxury-text/50 mb-2">Note from Tailor</p>
              <p className="text-sm text-luxury-text">{order.adminNotes}</p>
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/custom-stitching/order" className="text-sm text-accent hover:underline flex items-center justify-center gap-1">
          Place a new custom stitching order <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
