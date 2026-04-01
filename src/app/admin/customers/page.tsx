"use client";

import React, { useEffect, useState } from "react";
import { Users, Search, Mail, Phone, ChevronDown, ChevronUp, ShoppingBag, Shield, ShieldOff, Edit3, Trash2, Save, X, StickyNote, CheckCircle, XCircle } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  adminNotes: string | null;
  blocked: boolean;
  createdAt: string;
  totalSpent: number;
  orderCount: number;
  _count: { orders: number; reviews: number; wishlist: number };
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Record<string, { orderNumber: string; total: number; status: string; createdAt: string; items: { name: string; quantity: number }[] }[]>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", adminNotes: "" });

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    const res = await fetch("/api/admin/customers");
    if (res.ok) setCustomers(await res.json());
    setLoading(false);
  };

  const toggleCustomer = async (id: string) => {
    if (expandedCustomer === id) { setExpandedCustomer(null); return; }
    setExpandedCustomer(id);
    if (!customerOrders[id]) {
      const res = await fetch(`/api/admin/customers/${id}/orders`);
      if (res.ok) {
        const data = await res.json();
        setCustomerOrders((prev) => ({ ...prev, [id]: data }));
      }
    }
  };

  const startEdit = (c: Customer) => {
    setEditingId(c.id);
    setEditForm({ name: c.name, phone: c.phone || "", adminNotes: c.adminNotes || "" });
  };

  const saveEdit = async (id: string) => {
    await fetch(`/api/admin/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchCustomers();
  };

  const toggleBlock = async (id: string, blocked: boolean) => {
    await fetch(`/api/admin/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocked: !blocked }),
    });
    fetchCustomers();
  };

  const deleteCustomer = async (id: string) => {
    if (!confirm("Delete this customer? This cannot be undone. Customers with orders cannot be deleted.")) return;
    const res = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
    if (res.ok) fetchCustomers();
    else { const d = await res.json(); alert(d.error); }
  };

  const saveNotes = async (id: string, notes: string) => {
    await fetch(`/api/admin/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes: notes }),
    });
  };

  const filtered = customers.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  if (loading) return <p className="text-sm text-gray-500 py-20 text-center">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customers</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total", value: customers.length, color: "text-gray-800" },
          { label: "Verified", value: customers.filter((c) => c.emailVerified).length, color: "text-green-600" },
          { label: "Blocked", value: customers.filter((c) => c.blocked).length, color: "text-red-600" },
          { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, color: "text-blue-600" },
          { label: "New This Month", value: customers.filter((c) => {
            const d = new Date(c.createdAt); const n = new Date();
            return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
          }).length, color: "text-accent" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] tracking-wider uppercase text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by name, email, or phone..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400" />
      </div>

      {/* Customer list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No customers found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <React.Fragment key={c.id}>
              <div className={`bg-white border rounded-lg overflow-hidden ${c.blocked ? "border-red-200 bg-red-50/30" : "border-gray-200"}`}>
                {/* Row */}
                <div className="flex items-center cursor-pointer hover:bg-gray-50" onClick={() => toggleCustomer(c.id)}>
                  <div className="flex-1 p-4 flex items-center gap-4 flex-wrap">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${c.blocked ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Info */}
                    <div className="min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                        {c.emailVerified ? (
                          <CheckCircle size={13} className="text-green-500" title="Email verified" />
                        ) : (
                          <XCircle size={13} className="text-orange-400" title="Email not verified" />
                        )}
                        {c.blocked && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-wider font-medium">Blocked</span>}
                      </div>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </div>
                    {/* Phone */}
                    <div className="hidden md:block">
                      {c.phone && <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={11} /> {c.phone}</p>}
                    </div>
                    {/* Stats */}
                    <div className="text-center min-w-[60px]">
                      <p className="text-sm font-bold text-gray-800">{c.orderCount}</p>
                      <p className="text-[9px] text-gray-400">Orders</p>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <p className={`text-sm font-bold ${c.totalSpent > 0 ? "text-green-600" : "text-gray-300"}`}>
                        ₹{c.totalSpent.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[9px] text-gray-400">Spent</p>
                    </div>
                    <div className="hidden lg:block text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <div className="pr-4">
                    {expandedCustomer === c.id ? <ChevronUp size={16} className="text-blue-500" /> : <ChevronDown size={16} className="text-gray-300" />}
                  </div>
                </div>

                {/* Expanded */}
                {expandedCustomer === c.id && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: Orders */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                          <ShoppingBag size={12} /> Order History ({c.orderCount})
                        </p>
                        {!customerOrders[c.id] ? (
                          <p className="text-xs text-gray-400">Loading...</p>
                        ) : customerOrders[c.id].length === 0 ? (
                          <p className="text-xs text-gray-400">No orders</p>
                        ) : (
                          <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {customerOrders[c.id].map((o) => (
                              <div key={o.orderNumber} className="bg-white border border-gray-200 rounded px-3 py-2 flex items-center justify-between">
                                <div>
                                  <p className="text-xs font-medium text-gray-800">{o.orderNumber}</p>
                                  <p className="text-[10px] text-gray-400">
                                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                    {" · "}{o.items.map((i) => `${i.name} x${i.quantity}`).join(", ").substring(0, 50)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-bold text-gray-800">₹{o.total.toLocaleString("en-IN")}</p>
                                  <span className={`text-[8px] tracking-wider uppercase px-1.5 py-0.5 rounded ${
                                    o.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                                    o.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                    "bg-yellow-100 text-yellow-700"
                                  }`}>{o.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Edit + Notes + Actions */}
                      <div className="space-y-4">
                        {/* Edit customer */}
                        {editingId === c.id ? (
                          <div className="bg-white border border-gray-200 rounded p-4 space-y-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1"><Edit3 size={12} /> Edit Customer</p>
                            <div>
                              <label className="text-[10px] text-gray-400 block mb-1">Name</label>
                              <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 block mb-1">Phone</label>
                              <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => saveEdit(c.id)} className="bg-gray-800 text-white px-4 py-1.5 rounded text-xs hover:bg-gray-700 flex items-center gap-1"><Save size={12} /> Save</button>
                              <button onClick={() => setEditingId(null)} className="border border-gray-300 px-4 py-1.5 rounded text-xs hover:bg-gray-50 flex items-center gap-1"><X size={12} /> Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(c)} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <Edit3 size={12} /> Edit Name / Phone
                          </button>
                        )}

                        {/* Admin Notes */}
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1"><StickyNote size={12} /> Admin Notes</p>
                          <textarea
                            defaultValue={c.adminNotes || ""}
                            placeholder="Internal notes about this customer..."
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-xs resize-none focus:outline-none focus:border-blue-400"
                            onBlur={(e) => saveNotes(c.id, e.target.value)}
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
                          <a href={`https://wa.me/${c.phone?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1">
                            💬 WhatsApp
                          </a>
                          <a href={`mailto:${c.email}`} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <Mail size={12} /> Email
                          </a>
                          <button onClick={() => toggleBlock(c.id, c.blocked)}
                            className={`text-xs flex items-center gap-1 ${c.blocked ? "text-green-600 hover:text-green-700" : "text-orange-600 hover:text-orange-700"}`}>
                            {c.blocked ? <><Shield size={12} /> Unblock</> : <><ShieldOff size={12} /> Block</>}
                          </button>
                          <button onClick={() => deleteCustomer(c.id)}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
