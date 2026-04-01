"use client";

import { useEffect, useState } from "react";
import { Ticket, Plus, Trash2, Edit3, Power } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "", discountType: "PERCENT", discountValue: "", minOrder: "", maxUses: "", expiresAt: "",
  });
  const [error, setError] = useState("");

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    const res = await fetch("/api/admin/coupons");
    if (res.ok) setCoupons(await res.json());
  };

  const resetForm = () => {
    setForm({ code: "", discountType: "PERCENT", discountValue: "", minOrder: "", maxUses: "", expiresAt: "" });
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const url = editingId ? `/api/admin/coupons?id=${editingId}` : "/api/admin/coupons";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { resetForm(); fetchCoupons(); }
    else { const d = await res.json(); setError(d.error); }
  };

  const handleEdit = (c: Coupon) => {
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      minOrder: String(c.minOrder),
      maxUses: String(c.maxUses),
      expiresAt: c.expiresAt ? c.expiresAt.split("T")[0] : "",
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchCoupons();
  };

  const handleToggle = async (id: string, active: boolean) => {
    await fetch(`/api/admin/coupons?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    fetchCoupons();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-gray-800 text-white px-4 py-2 text-sm rounded hover:bg-gray-700 flex items-center gap-2">
          <Plus size={14} /> New Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            {editingId ? "Edit Coupon" : "Create Coupon"}
          </h2>
          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Code</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SAVE20" className="w-full border border-gray-300 rounded px-3 py-2 text-sm uppercase" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Type</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                <option value="PERCENT">Percentage (%)</option>
                <option value="FIXED">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Value</label>
              <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                placeholder="20" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" required />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Min Order (₹)</label>
              <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                placeholder="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Max Uses (0=unlimited)</label>
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                placeholder="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Expires</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 text-sm rounded hover:bg-gray-700">
              {editingId ? "Update Coupon" : "Create Coupon"}
            </button>
            <button type="button" onClick={resetForm} className="border border-gray-300 px-4 py-2 text-sm rounded hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {coupons.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No coupons yet</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Min Order</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Used</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-gray-800">{c.code}</td>
                  <td className="py-3 px-4">{c.discountType === "PERCENT" ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                  <td className="py-3 px-4">{c.minOrder > 0 ? `₹${c.minOrder}` : "—"}</td>
                  <td className="py-3 px-4">{c.usedCount}{c.maxUses > 0 ? `/${c.maxUses}` : ""}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleToggle(c.id, c.active)}
                      className={`text-[10px] tracking-wider uppercase px-2 py-1 rounded flex items-center gap-1 ${
                        c.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}>
                      <Power size={10} /> {c.active ? "Active" : "Off"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(c)} className="text-gray-400 hover:text-blue-500"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
