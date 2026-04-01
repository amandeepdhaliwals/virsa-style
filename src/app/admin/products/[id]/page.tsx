"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";

interface Category { id: string; name: string; }

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showSEO, setShowSEO] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", comparePrice: "", costPrice: "",
    images: [] as string[], fabricImages: [] as string[], sizes: "", colors: "", tags: "",
    categoryId: "", featured: false, status: "ACTIVE", inStock: true,
    stock: "0", lowStockAt: "5", sku: "",
    metaTitle: "", metaDesc: "", weight: "",
    productType: "DRESS",
    stitchingAvailable: false, baseStitchingPrice: "",
    fabricType: "", suitPieces: "", workType: "", washCare: "", deliveryDays: "",
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${params.id}`).then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([product, cats]) => {
      setCategories(cats);
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: String(product.price || ""),
        comparePrice: product.comparePrice ? String(product.comparePrice) : "",
        costPrice: product.costPrice ? String(product.costPrice) : "",
        images: product.images || [],
        fabricImages: product.fabricImages || [],
        sizes: (product.sizes || []).join(", "),
        colors: (product.colors || []).join(", "),
        tags: (product.tags || []).join(", "),
        categoryId: product.categoryId || "",
        featured: product.featured || false,
        status: product.status || "ACTIVE",
        inStock: product.inStock !== false,
        stock: String(product.stock || 0),
        lowStockAt: String(product.lowStockAt || 5),
        sku: product.sku || "",
        metaTitle: product.metaTitle || "",
        metaDesc: product.metaDesc || "",
        weight: product.weight ? String(product.weight) : "",
        productType: product.productType || "DRESS",
        stitchingAvailable: product.stitchingAvailable || false,
        baseStitchingPrice: product.baseStitchingPrice ? String(product.baseStitchingPrice) : "",
        fabricType: product.fabricType || "",
        suitPieces: product.suitPieces || "",
        workType: product.workType || "",
        washCare: product.washCare || "",
        deliveryDays: product.deliveryDays ? String(product.deliveryDays) : "",
      });
      setFetching(false);
    });
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch(`/api/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        stock: Number(form.stock) || 0,
        lowStockAt: Number(form.lowStockAt) || 5,
        weight: form.weight ? Number(form.weight) : null,
        costPrice: form.costPrice ? Number(form.costPrice) : null,
        baseStitchingPrice: form.baseStitchingPrice ? Number(form.baseStitchingPrice) : null,
        deliveryDays: form.deliveryDays ? Number(form.deliveryDays) : null,
        inStock: Number(form.stock) > 0,
      }),
    });

    router.push("/admin/products");
  };

  if (fetching) return <p className="text-sm text-gray-500 py-20 text-center">Loading product...</p>;

  const inputClass = "w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-blue-400 bg-white";
  const labelClass = "text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2";

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent mb-6">
        <ArrowLeft size={16} /> Back to Products
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Product Type */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Product Type</h2>
          <div className="grid grid-cols-4 gap-3">
            {["SUIT", "FOOTWEAR", "DRESS", "ACCESSORY"].map((t) => (
              <button key={t} type="button" onClick={() => setForm({ ...form, productType: t })}
                className={`py-3 text-xs tracking-wider uppercase border rounded transition-colors ${form.productType === t ? "border-blue-500 bg-blue-50 text-blue-700 font-medium" : "border-gray-200 text-gray-500 hover:border-blue-300"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Basic Information</h2>
          <div>
            <label className={labelClass}>Product Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={`${inputClass} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category *</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={inputClass} required>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Tags <span className="text-gray-400 normal-case">(comma separated)</span></label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="summer, trending, bestseller" className={inputClass} />
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {form.productType === "SUIT" ? "Model / Stitched Look Images" : "Product Images"}
          </h2>
          <ImageUploader images={form.images} onChange={(urls) => setForm({ ...form, images: urls })} />

          {form.productType === "SUIT" && (
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Fabric / Material Close-up Images</h3>
              <ImageUploader images={form.fabricImages} onChange={(urls) => setForm({ ...form, fabricImages: urls })} />
            </div>
          )}
        </div>

        {/* Suit-specific fields */}
        {form.productType === "SUIT" && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Suit Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Fabric Type</label>
                <input type="text" value={form.fabricType} onChange={(e) => setForm({ ...form, fabricType: e.target.value })} placeholder="Cotton, Silk, Georgette..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Suit Pieces</label>
                <input type="text" value={form.suitPieces} onChange={(e) => setForm({ ...form, suitPieces: e.target.value })} placeholder="Kameez + Salwar + Dupatta" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Work Type</label>
                <input type="text" value={form.workType} onChange={(e) => setForm({ ...form, workType: e.target.value })} placeholder="Embroidery, Print, Handwork..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Wash Care</label>
                <input type="text" value={form.washCare} onChange={(e) => setForm({ ...form, washCare: e.target.value })} placeholder="Dry Clean, Machine Wash..." className={inputClass} />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-5">
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input type="checkbox" checked={form.stitchingAvailable} onChange={(e) => setForm({ ...form, stitchingAvailable: e.target.checked })} className="accent-blue-500 w-4 h-4" />
                <span className="text-sm text-gray-700">Stitching Available</span>
              </label>
              {form.stitchingAvailable && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Base Stitching Price (₹)</label>
                    <input type="number" value={form.baseStitchingPrice} onChange={(e) => setForm({ ...form, baseStitchingPrice: e.target.value })} placeholder="800" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Delivery Days (with stitching)</label>
                    <input type="number" value={form.deliveryDays} onChange={(e) => setForm({ ...form, deliveryDays: e.target.value })} placeholder="4" className={inputClass} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pricing</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Selling Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Compare / MRP (₹)</label>
              <input type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Cost Price (₹)</label>
              <input type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} className={inputClass} />
            </div>
          </div>
          {form.price && form.costPrice && (
            <p className="text-xs text-green-600">
              Profit margin: ₹{(Number(form.price) - Number(form.costPrice)).toLocaleString("en-IN")}
              ({Math.round(((Number(form.price) - Number(form.costPrice)) / Number(form.price)) * 100)}%)
            </p>
          )}
        </div>

        {/* Inventory */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Inventory</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>SKU</label>
              <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="VS-001" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Stock Quantity *</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputClass} min="0" />
            </div>
            <div>
              <label className={labelClass}>Low Stock Alert At</label>
              <input type="number" value={form.lowStockAt} onChange={(e) => setForm({ ...form, lowStockAt: e.target.value })} className={inputClass} min="0" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Weight (grams)</label>
            <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className={inputClass} />
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Variants</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Sizes <span className="text-gray-400 normal-case">(comma separated)</span></label>
              <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Colors <span className="text-gray-400 normal-case">(comma separated)</span></label>
              <input type="text" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Black, White, Red" className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-blue-500 w-4 h-4" />
            <span className="text-sm text-gray-700">Featured Product</span>
          </label>
        </div>

        {/* SEO */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <button type="button" onClick={() => setShowSEO(!showSEO)}
            className="w-full p-6 flex items-center justify-between text-left">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SEO (Search Engine)</h2>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${showSEO ? "rotate-180" : ""}`} />
          </button>
          {showSEO && (
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className={labelClass}>Meta Title</label>
                <input type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="Product name | ਵਿਰਸਾ Style" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea value={form.metaDesc} onChange={(e) => setForm({ ...form, metaDesc: e.target.value })} rows={2} placeholder="Short description for Google search results..." className={`${inputClass} resize-none`} />
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading}
            className="flex-1 bg-gray-800 text-white py-4 text-sm tracking-wider uppercase rounded hover:bg-gray-700 disabled:opacity-50 transition-colors">
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/admin/products" className="px-8 py-4 border border-gray-300 text-sm tracking-wider uppercase rounded text-gray-600 hover:bg-gray-50 flex items-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
