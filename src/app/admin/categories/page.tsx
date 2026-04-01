"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Check } from "lucide-react";

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

  useEffect(() => {
    fetchCategories();
  }, []);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl text-luxury-dark">Categories</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm({ name: "", image: "", order: 0 });
          }}
          className="btn-luxury flex items-center gap-2 text-xs"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-pastel-pink p-6 mb-8 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm tracking-[0.2em] uppercase text-luxury-dark">
              {editingId ? "Edit Category" : "New Category"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="text-luxury-text/40 hover:text-luxury-dark"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-luxury-text block mb-2">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-luxury-light"
                required
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-luxury-text block mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-luxury-light"
              />
            </div>
            <div>
              <label className="text-xs tracking-[0.15em] uppercase text-luxury-text block mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-luxury-light"
              />
            </div>
          </div>

          <button type="submit" className="btn-luxury flex items-center gap-2 text-xs">
            <Check size={16} /> {editingId ? "Save Changes" : "Create Category"}
          </button>
        </form>
      )}

      {/* Categories List */}
      {loading ? (
        <p className="text-luxury-text/60 text-sm">Loading...</p>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-white border border-pastel-pink">
          <p className="text-luxury-text/60">No categories yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-pastel-pink overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pastel-pink bg-pastel-cream/50">
                <th className="text-left p-4 text-xs tracking-[0.15em] uppercase text-luxury-text/60">
                  Category
                </th>
                <th className="text-left p-4 text-xs tracking-[0.15em] uppercase text-luxury-text/60">
                  Slug
                </th>
                <th className="text-left p-4 text-xs tracking-[0.15em] uppercase text-luxury-text/60">
                  Products
                </th>
                <th className="text-left p-4 text-xs tracking-[0.15em] uppercase text-luxury-text/60">
                  Order
                </th>
                <th className="text-right p-4 text-xs tracking-[0.15em] uppercase text-luxury-text/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-pastel-pink/50 hover:bg-pastel-cream/30">
                  <td className="p-4 text-sm font-medium text-luxury-dark">{cat.name}</td>
                  <td className="p-4 text-sm text-luxury-text/60">{cat.slug}</td>
                  <td className="p-4 text-sm text-luxury-text/60">{cat._count.products}</td>
                  <td className="p-4 text-sm text-luxury-text/60">{cat.order}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="w-8 h-8 flex items-center justify-center text-luxury-text/40 hover:text-accent transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="w-8 h-8 flex items-center justify-center text-luxury-text/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
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
