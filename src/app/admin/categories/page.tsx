"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Check, ArrowUp, ArrowDown } from "lucide-react";
import ImageUploadButton from "@/components/ImageUploadButton";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  order: number;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", image: "", order: 0 });

  const fetchCategories = async () => {
    const data = await fetch("/api/categories").then((r) => r.json());
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", image: "", order: 0 });
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, image: cat.image || "", order: cat.order });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in it will also be deleted.")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const changeOrder = async (id: string, newOrder: number) => {
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    });
    fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", image: "", order: categories.length + 1 }); }}
          className="bg-gray-800 text-white px-4 py-2 text-sm rounded hover:bg-gray-700 flex items-center gap-2"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 mb-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              {editingId ? "Edit Category" : "New Category"}
            </h2>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Name *</label>
              <input type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Display Order</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setForm({ ...form, order: Math.max(0, form.order - 1) })}
                  className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 text-gray-500">
                  <ArrowDown size={14} />
                </button>
                <input type="number" value={form.order}
                  onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                  className="w-20 text-center border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
                <button type="button" onClick={() => setForm({ ...form, order: form.order + 1 })}
                  className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 text-gray-500">
                  <ArrowUp size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <ImageUploadButton label="Category Image (800×1000 portrait)" value={form.image}
              onChange={(url) => setForm({ ...form, image: url })} />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-gray-800 text-white px-5 py-2.5 rounded text-sm hover:bg-gray-700 flex items-center gap-2">
              <Check size={14} /> {editingId ? "Save Changes" : "Create Category"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}
              className="border border-gray-300 px-5 py-2.5 rounded text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {/* Categories List */}
      {loading ? (
        <p className="text-gray-500 text-sm py-20 text-center">Loading...</p>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">No categories yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-12 h-14 object-cover rounded bg-gray-100" />
                    ) : (
                      <div className="w-12 h-14 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                  </td>
                  <td className="p-4 text-sm font-semibold text-gray-800">{cat.name}</td>
                  <td className="p-4 text-sm text-gray-400 font-mono">{cat.slug}</td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-gray-800">{cat._count.products}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => changeOrder(cat.id, Math.max(0, cat.order - 1))}
                        className="w-6 h-6 border border-gray-200 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                        <ArrowUp size={10} />
                      </button>
                      <span className="text-sm text-gray-600 w-6 text-center">{cat.order}</span>
                      <button onClick={() => changeOrder(cat.id, cat.order + 1)}
                        className="w-6 h-6 border border-gray-200 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                        <ArrowDown size={10} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(cat)}
                        className="text-gray-400 hover:text-blue-500"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(cat.id)}
                        className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
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
