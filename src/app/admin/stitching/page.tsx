"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

interface StitchingOption {
  id: string;
  productId: string | null;
  category: string;
  name: string;
  price: number;
  isDefault: boolean;
  order: number;
}

const CATEGORIES = [
  { value: "NECK", label: "Neck Style" },
  { value: "SLEEVE", label: "Sleeve Style" },
  { value: "BOTTOM", label: "Bottom Style" },
  { value: "EXTRA", label: "Additional Options" },
];

export default function StitchingPage() {
  const [options, setOptions] = useState<StitchingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // New option form
  const [newOption, setNewOption] = useState({
    category: "NECK",
    name: "",
    price: 0,
    isDefault: false,
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    const res = await fetch("/api/admin/stitching-options");
    if (res.ok) setOptions(await res.json());
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newOption.name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/stitching-options", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newOption, productId: null }),
    });
    if (res.ok) {
      setNewOption({ category: "NECK", name: "", price: 0, isDefault: false });
      fetchOptions();
      setMsg("Option added");
      setTimeout(() => setMsg(""), 2000);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this option?")) return;
    const res = await fetch(`/api/admin/stitching-options?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchOptions();
  };

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    options: options.filter((o) => o.category === cat.value),
  }));

  if (loading) return <p className="p-8 text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stitching Options</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage customization options that customers can choose when ordering suits with stitching.
          </p>
        </div>
      </div>

      {msg && (
        <div className="bg-green-50 text-green-600 text-sm px-4 py-2 mb-4 rounded">{msg}</div>
      )}

      {/* Add new option */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Add New Option
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select
              value={newOption.category}
              onChange={(e) => setNewOption({ ...newOption, category: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={newOption.name}
              onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
              placeholder="e.g. V-Neck, Full Sleeve"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Extra Price (₹)</label>
            <input
              type="number"
              value={newOption.price}
              onChange={(e) => setNewOption({ ...newOption, price: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={newOption.isDefault}
                onChange={(e) => setNewOption({ ...newOption, isDefault: e.target.checked })}
              />
              Default
            </label>
          </div>
          <button
            onClick={handleAdd}
            disabled={saving || !newOption.name.trim()}
            className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2 justify-center"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Options by category */}
      <div className="space-y-6">
        {grouped.map((group) => (
          <div key={group.value} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                {group.label}
              </h3>
            </div>
            {group.options.length === 0 ? (
              <p className="px-6 py-4 text-sm text-gray-400">No options added yet.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 uppercase">
                    <th className="text-left px-6 py-2">Name</th>
                    <th className="text-left px-6 py-2">Extra Price</th>
                    <th className="text-left px-6 py-2">Default</th>
                    <th className="text-right px-6 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {group.options.map((opt) => (
                    <tr key={opt.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-800">{opt.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {opt.price > 0 ? `+₹${opt.price}` : "Included"}
                      </td>
                      <td className="px-6 py-3">
                        {opt.isDefault && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleDelete(opt.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>

      {/* Help text */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-5 text-sm text-blue-800">
        <p className="font-medium mb-2">How it works:</p>
        <ul className="space-y-1 list-disc pl-4 text-blue-700">
          <li><strong>Global options</strong> apply to all suit products with stitching enabled.</li>
          <li><strong>Extra Price = ₹0</strong> means the option is included in the base stitching price.</li>
          <li><strong>Default</strong> options are pre-selected for the customer.</li>
          <li>Set <strong>Base Stitching Price</strong> on each product in the product edit page.</li>
          <li>Customers see: Fabric Price + Base Stitching + Add-ons = Total.</li>
        </ul>
      </div>
    </div>
  );
}
