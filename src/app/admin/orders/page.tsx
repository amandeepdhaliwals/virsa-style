"use client";

import { useEffect, useState } from "react";
import { Package, ChevronDown, ChevronUp, Search, Truck, Printer, Calendar, StickyNote } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  wantStitching?: boolean;
  stitchingPrice?: number;
  customizations?: string;
  measurements?: string;
  designReference?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  trackingId?: string;
  notes?: string;
  createdAt: string;
  user: { name: string; email: string; phone?: string };
  items: OrderItem[];
  address: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];
const PAYMENT_OPTIONS = ["PENDING", "PAID", "FAILED", "REFUNDED", "COD"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  };

  const updateOrder = async (id: string, data: Record<string, string>) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    }
  };

  const statusColor = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      PROCESSING: "bg-indigo-100 text-indigo-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      RETURNED: "bg-gray-100 text-gray-800",
      PAID: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      REFUNDED: "bg-orange-100 text-orange-800",
      COD: "bg-yellow-100 text-yellow-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === "ALL" || o.status === filter;
    const matchesPayment = paymentFilter === "ALL" || o.paymentStatus === paymentFilter;
    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.user.name.toLowerCase().includes(search.toLowerCase()) ||
      o.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesDateFrom = !dateFrom || new Date(o.createdAt) >= new Date(dateFrom);
    const matchesDateTo = !dateTo || new Date(o.createdAt) <= new Date(dateTo + "T23:59:59");
    return matchesFilter && matchesPayment && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filtered.length) setSelectedOrders([]);
    else setSelectedOrders(filtered.map((o) => o.id));
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;
    for (const id of selectedOrders) {
      await updateOrder(id, { status: bulkAction });
    }
    setSelectedOrders([]);
    setBulkAction("");
    fetchOrders();
  };

  const resendEmail = async (orderId: string, type: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}/resend-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (res.ok) alert("Email resent successfully!");
    else alert("Failed to resend email");
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    processing: orders.filter((o) => ["CONFIRMED", "PROCESSING"].includes(o.status)).length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
  };

  if (loading) {
    return <div className="text-center py-20 text-sm text-luxury-text">Loading orders...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
          <input type="checkbox" checked={selectedOrders.length === filtered.length && filtered.length > 0}
            onChange={toggleSelectAll} className="accent-blue-500" />
          Select All ({filtered.length})
        </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-luxury-dark" },
          { label: "Pending", value: stats.pending, color: "text-yellow-600" },
          { label: "Processing", value: stats.processing, color: "text-blue-600" },
          { label: "Shipped", value: stats.shipped, color: "text-purple-600" },
          { label: "Delivered", value: stats.delivered, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-pastel-pink p-4 text-center">
            <p className={`text-2xl font-medium ${s.color}`}>{s.value}</p>
            <p className="text-[10px] tracking-wider uppercase text-luxury-text/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-text/30" />
          <input
            type="text"
            placeholder="Search by order number, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-pastel-pink text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-200 rounded px-2 py-1.5 text-xs" placeholder="From" />
          <span className="text-gray-300">—</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-200 rounded px-2 py-1.5 text-xs" placeholder="To" />
          {(dateFrom || dateTo) && (
            <button onClick={() => { setDateFrom(""); setDateTo(""); }} className="text-xs text-accent hover:underline">Clear</button>
          )}
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="border border-pastel-pink px-3 py-2.5 text-sm focus:outline-none focus:border-accent bg-white">
          <option value="ALL">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}
          className="border border-pastel-pink px-3 py-2.5 text-sm focus:outline-none focus:border-accent bg-white">
          <option value="ALL">All Payment</option>
          {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="flex items-center gap-3 mb-4 bg-blue-50 border border-blue-200 px-4 py-3 rounded">
          <span className="text-sm text-blue-800 font-medium">{selectedOrders.length} selected</span>
          <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}
            className="border border-blue-300 rounded px-3 py-1.5 text-sm bg-white">
            <option value="">Change status to...</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleBulkAction} disabled={!bulkAction}
            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-40">
            Apply
          </button>
          <button onClick={() => setSelectedOrders([])} className="text-sm text-blue-600 hover:underline ml-auto">
            Clear selection
          </button>
        </div>
      )}

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto text-pastel-lilac mb-4" />
          <p className="text-luxury-text">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className={`bg-white border ${selectedOrders.includes(order.id) ? "border-blue-400 bg-blue-50/30" : "border-pastel-pink"}`}>
              <div className="flex items-center">
                <label className="pl-4 py-4 flex items-center" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleSelectOrder(order.id)} className="accent-blue-500 w-4 h-4" />
                </label>
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="flex-1 p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="min-w-[120px]">
                    <p className="text-xs text-luxury-text/40">Order</p>
                    <p className="text-sm font-medium text-luxury-dark font-mono">{order.orderNumber}</p>
                  </div>
                  <div className="min-w-[100px]">
                    <p className="text-xs text-luxury-text/40">Customer</p>
                    <p className="text-sm text-luxury-dark">{order.user.name}</p>
                  </div>
                  <div className="min-w-[80px]">
                    <p className="text-xs text-luxury-text/40">Total</p>
                    <p className="text-sm font-medium text-luxury-dark">₹{order.total.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="min-w-[80px]">
                    <p className="text-xs text-luxury-text/40">Date</p>
                    <p className="text-sm text-luxury-dark">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                  <span className={`text-[10px] tracking-wider uppercase px-3 py-1 ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 ${statusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {expandedOrder === order.id && (
                <div className="border-t border-pastel-cream p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Items */}
                    <div>
                      <p className="text-xs tracking-wider uppercase text-accent mb-3">Items</p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-2">
                            {item.image && (
                              <img src={item.image} alt="" className="w-10 h-12 object-cover bg-pastel-cream" />
                            )}
                            <div>
                              <p className="text-xs font-medium text-luxury-dark">{item.name}</p>
                              <p className="text-[10px] text-luxury-text/50">
                                {item.size && `${item.size}`}{item.color && ` / ${item.color}`} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                              </p>
                              {item.wantStitching && (
                                <div className="mt-1 space-y-1">
                                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 inline-block">
                                    ✂ Stitching — ₹{item.stitchingPrice?.toLocaleString("en-IN")}
                                  </span>
                                  {item.customizations && (
                                    <p className="text-[10px] text-luxury-text/50">
                                      <strong>Design:</strong>{" "}
                                      {Object.entries(JSON.parse(item.customizations)).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                                    </p>
                                  )}
                                  {item.measurements && (
                                    <p className="text-[10px] text-luxury-text/50">
                                      <strong>Measurements:</strong>{" "}
                                      {Object.entries(JSON.parse(item.measurements)).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}"`).join(", ")}
                                    </p>
                                  )}
                                  {item.designReference && (
                                    <p className="text-[10px] text-luxury-text/50">
                                      <strong>Design Note:</strong> {item.designReference}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-pastel-cream text-xs text-luxury-text">
                        <p>Subtotal: ₹{order.subtotal.toLocaleString("en-IN")}</p>
                        <p>Shipping: {order.shipping === 0 ? "Free" : `₹${order.shipping}`}</p>
                        <p className="font-medium text-luxury-dark">Total: ₹{order.total.toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <p className="text-xs tracking-wider uppercase text-accent mb-3">Delivery Address</p>
                      <p className="text-sm text-luxury-dark font-medium">{order.address.name}</p>
                      <p className="text-xs text-luxury-text mt-1">
                        {order.address.line1}{order.address.line2 && `, ${order.address.line2}`}
                      </p>
                      <p className="text-xs text-luxury-text">
                        {order.address.city}, {order.address.state} - {order.address.pincode}
                      </p>
                      <p className="text-xs text-luxury-text/60 mt-1">Phone: {order.address.phone}</p>

                      <p className="text-xs tracking-wider uppercase text-accent mt-4 mb-2">Customer</p>
                      <p className="text-xs text-luxury-text">{order.user.email}</p>
                      {order.notes && (
                        <>
                          <p className="text-xs tracking-wider uppercase text-accent mt-4 mb-1">Notes</p>
                          <p className="text-xs text-luxury-text italic">{order.notes}</p>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div>
                      <p className="text-xs tracking-wider uppercase text-accent mb-3">Update Order</p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] tracking-wider uppercase text-luxury-text/50 block mb-1">Order Status</label>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                            className="w-full border border-pastel-pink px-3 py-2 text-sm focus:outline-none focus:border-accent bg-white"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] tracking-wider uppercase text-luxury-text/50 block mb-1">Payment Status</label>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => updateOrder(order.id, { paymentStatus: e.target.value })}
                            className="w-full border border-pastel-pink px-3 py-2 text-sm focus:outline-none focus:border-accent bg-white"
                          >
                            {PAYMENT_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] tracking-wider uppercase text-luxury-text/50 block mb-1">
                            <Truck size={12} className="inline mr-1" />Tracking ID
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              defaultValue={order.trackingId || ""}
                              placeholder="Enter tracking ID"
                              className="flex-1 border border-pastel-pink px-3 py-2 text-sm focus:outline-none focus:border-accent"
                              onBlur={(e) => {
                                if (e.target.value !== (order.trackingId || "")) {
                                  updateOrder(order.id, { trackingId: e.target.value });
                                }
                              }}
                            />
                          </div>

                          {/* Admin Notes */}
                          <div className="mt-3">
                            <div className="flex items-center gap-2 mb-1">
                              <StickyNote size={12} className="text-accent" />
                              <label className="text-[10px] tracking-wider uppercase text-luxury-text/50 font-medium">Admin Notes (internal)</label>
                            </div>
                            <textarea
                              defaultValue={order.notes || ""}
                              placeholder="Internal notes — not visible to customer..."
                              rows={2}
                              className="w-full border border-pastel-pink px-3 py-2 text-xs focus:outline-none focus:border-accent resize-none"
                              onBlur={(e) => {
                                if (e.target.value !== (order.notes || "")) {
                                  updateOrder(order.id, { notes: e.target.value });
                                }
                              }}
                            />
                          </div>

                          {/* Actions row */}
                          <div className="mt-3 flex flex-wrap gap-4">
                            <a href={`/api/orders/invoice/${order.orderNumber}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-xs text-accent hover:text-accent-dark">
                              <Printer size={12} /> Print Invoice
                            </a>
                            <button onClick={() => resendEmail(order.id, "confirmation")}
                              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800">
                              📧 Resend Confirmation
                            </button>
                            {order.trackingId && (
                              <button onClick={() => resendEmail(order.id, "shipped")}
                                className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800">
                                📧 Resend Shipped Email
                              </button>
                            )}
                          </div>

                          {/* Discount/coupon info */}
                          {order.notes && order.notes.includes("Coupon:") && (
                            <p className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 inline-block rounded">
                              🏷️ {order.notes.split("\n").find((n: string) => n.includes("Coupon:")) || ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>{/* close checkbox wrapper */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
