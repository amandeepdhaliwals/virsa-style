"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Scissors } from "lucide-react";

interface CSOrder {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  suitType: string;
  neckStyle: string;
  sleeveStyle: string;
  extras: string[];
  specialNotes?: string;
  measurements: string;
  referenceImages: string[];
  stitchingPrice: number;
  returnShipping: number;
  totalPaid: number;
  paymentStatus: string;
  fabricCourierName?: string;
  fabricTrackingNumber?: string;
  fabricReceivedAt?: string;
  returnCourierName?: string;
  returnTrackingNumber?: string;
  adminNotes?: string;
  resultImages: string[];
  createdAt: string;
}

const STATUSES = [
  "ORDER_PLACED", "FABRIC_SHIPPED", "FABRIC_RECEIVED",
  "STITCHING_STARTED", "STITCHING_DONE", "SHIPPED_BACK", "DELIVERED", "CANCELLED",
];

const STATUS_COLORS: Record<string, string> = {
  ORDER_PLACED: "bg-yellow-100 text-yellow-800",
  FABRIC_SHIPPED: "bg-blue-100 text-blue-800",
  FABRIC_RECEIVED: "bg-indigo-100 text-indigo-800",
  STITCHING_STARTED: "bg-purple-100 text-purple-800",
  STITCHING_DONE: "bg-green-100 text-green-800",
  SHIPPED_BACK: "bg-cyan-100 text-cyan-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CSOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/custom-orders");
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  };

  const updateOrder = async (id: string, data: Record<string, unknown>) => {
    const res = await fetch(`/api/custom-stitching/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchOrders();
  };

  const filtered = filter ? orders.filter((o) => o.status === filter) : orders;

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Scissors size={24} /> Custom Stitching Orders
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {orders.length} total orders — Customers who sent their own fabric
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pending Fabric", count: orders.filter((o) => o.status === "ORDER_PLACED").length, color: "text-yellow-600" },
          { label: "Fabric Received", count: orders.filter((o) => o.status === "FABRIC_RECEIVED").length, color: "text-indigo-600" },
          { label: "In Stitching", count: orders.filter((o) => o.status === "STITCHING_STARTED").length, color: "text-purple-600" },
          { label: "Completed", count: orders.filter((o) => ["DELIVERED", "STITCHING_DONE", "SHIPPED_BACK"].includes(o.status)).length, color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button onClick={() => setFilter("")}
          className={`px-3 py-1.5 text-xs rounded ${!filter ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          All ({orders.length})
        </button>
        {STATUSES.map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          if (count === 0) return null;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs rounded whitespace-nowrap ${filter === s ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {s.replace(/_/g, " ")} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No custom stitching orders yet.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Header row */}
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400">Order</p>
                    <p className="text-sm font-semibold text-gray-800">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Customer</p>
                    <p className="text-sm text-gray-700">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Suit</p>
                    <p className="text-sm text-gray-700">{order.suitType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="text-sm font-medium text-gray-800">₹{order.totalPaid.toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`text-[10px] tracking-wider uppercase px-3 py-1 rounded ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>
                {expanded === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Expanded details */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 p-5 space-y-5">
                  {/* Design details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Neck</p>
                      <p className="text-sm text-gray-800">{order.neckStyle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Sleeve</p>
                      <p className="text-sm text-gray-800">{order.sleeveStyle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Extras</p>
                      <p className="text-sm text-gray-800">{order.extras.length > 0 ? order.extras.join(", ") : "None"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="text-sm text-gray-800">{order.customerPhone}</p>
                    </div>
                  </div>

                  {/* Measurements */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Measurements</p>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      {Object.entries(JSON.parse(order.measurements)).filter(([, v]) => v).map(([k, v]) => (
                        <div key={k} className="bg-gray-50 px-2 py-1 rounded">
                          <span className="text-gray-400 capitalize text-xs">{k.replace(/([A-Z])/g, " $1")}:</span>{" "}
                          <span className="text-gray-800 font-medium">{v as string}&quot;</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.specialNotes && (
                    <div>
                      <p className="text-xs text-gray-400">Special Notes</p>
                      <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded mt-1">{order.specialNotes}</p>
                    </div>
                  )}

                  {/* Reference images */}
                  {order.referenceImages.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Reference Images</p>
                      <div className="flex gap-2">
                        {order.referenceImages.map((img, i) => (
                          <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                            <img src={img} alt="" className="w-20 h-20 object-cover border rounded" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Return address */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Return Address</p>
                    <p className="text-sm text-gray-700">
                      {order.customerName}, {order.addressLine1}
                      {order.addressLine2 && `, ${order.addressLine2}`}, {order.city}, {order.state} — {order.pincode}
                    </p>
                  </div>

                  {/* Fabric tracking */}
                  {order.fabricTrackingNumber && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-blue-600 font-medium">Customer Fabric Courier</p>
                      <p className="text-sm text-blue-800">{order.fabricCourierName} — {order.fabricTrackingNumber}</p>
                    </div>
                  )}

                  {/* Admin actions */}
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <p className="text-xs text-gray-400 font-medium uppercase">Update Order</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status update */}
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Status</label>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                          ))}
                        </select>
                      </div>

                      {/* Return tracking */}
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Return Courier & Tracking</label>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Courier name"
                            defaultValue={order.returnCourierName || ""}
                            onBlur={(e) => e.target.value && updateOrder(order.id, { returnCourierName: e.target.value })}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
                          <input type="text" placeholder="Tracking #"
                            defaultValue={order.returnTrackingNumber || ""}
                            onBlur={(e) => e.target.value && updateOrder(order.id, { returnTrackingNumber: e.target.value, status: "SHIPPED_BACK" })}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Admin notes */}
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Admin Notes (visible to customer)</label>
                      <textarea
                        defaultValue={order.adminNotes || ""}
                        onBlur={(e) => updateOrder(order.id, { adminNotes: e.target.value })}
                        rows={2}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                        placeholder="e.g., Fabric received, starting work tomorrow..."
                      />
                    </div>

                    {/* Result image URL */}
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Result Image URL (paste photo of stitched outfit)</label>
                      <input type="text" placeholder="Paste image URL and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) {
                              updateOrder(order.id, { resultImages: [...order.resultImages, val] });
                              (e.target as HTMLInputElement).value = "";
                            }
                          }
                        }}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                      {order.resultImages.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {order.resultImages.map((img, i) => (
                            <img key={i} src={img} alt="" className="w-16 h-16 object-cover border rounded" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
