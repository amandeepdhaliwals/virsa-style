"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";

interface Category { id: string; name: string; }

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", comparePrice: "", costPrice: "",
    images: [] as string[], fabricImages: [] as string[], sizes: "", colors: "", tags: "",
    categoryId: "", featured: false, status: "ACTIVE",
    stock: "0", lowStockAt: "5", sku: "",
    metaTitle: "", metaDesc: "", weight: "",
    productType: "DRESS",
    stitchingAvailable: false, baseStitchingPrice: "",
    fabricType: "", suitPieces: "", workType: "", washCare: "", deliveryDays: "",
  });

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        images: form.images,
        fabricImages: form.fabricImages,
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        stock: Number(form.stock) || 0,
        lowStockAt: Number(form.lowStockAt) || 5,
        weight: form.weight ? Number(form.weight) : null,
        costPrice: form.costPrice ? Number(form.costPrice) : null,
        inStock: Number(form.stock) > 0,
        baseStitchingPrice: form.baseStitchingPrice ? Number(form.baseStitchingPrice) : null,
        deliveryDays: form.deliveryDays ? Number(form.deliveryDays) : null,
      }),
    });

    router.push("/admin/products");
  };

  const inputClass = "w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-luxury-light";
  const labelClass = "text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2";

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-1 text-sm text-luxury-text/60 hover:text-accent mb-6">
        <ArrowLeft size={16} /> Back to Products
      </Link>
      <h1 className="font-serif text-2xl text-luxury-dark mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Basic Info */}
        <div className="bg-white border border-pastel-pink p-6 space-y-5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-accent mb-2">Basic Information</h2>
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
            <label className={labelClass}>Tags <span className="text-luxury-text/30">(comma separated)</span></label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="summer, trending, bestseller" className={inputClass} />
          </div>
        </div>

        {/* Product Type */}
        <div className="bg-white border border-pastel-pink p-6 space-y-5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-accent mb-2">Product Type</h2>
          <div className="grid grid-cols-4 gap-3">
            {["SUIT", "FOOTWEAR", "DRESS", "ACCESSORY"].map((t) => (
              <button key={t} type="button" onClick={() => setForm({ ...form, productType: t })}
                className={`py-3 text-xs tracking-wider uppercase border transition-colors ${form.productType === t ? "border-accent bg-accent/10 text-accent font-medium" : "border-pastel-pink text-luxury-text hover:border-accent/50"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white border border-pastel-pink p-6 space-y-5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-accent mb-4">
            {form.productType === "SUIT" ? "Model / Stitched Look Images" : "Product Images"}
          </h2>
          <ImageUploader images={form.images} onChange={(urls) => setForm({ ...form, images: urls })} />

          {form.productType === "SUIT" && (
            <div className="pt-4 border-t border-pastel-cream">
              <h3 className="text-xs tracking-[0.2em] uppercase text-luxury-text mb-4">Fabric / Material Close-up Images</h3>
              <ImageUploader images={form.fabricImages} onChange={(urls) => setForm({ ...form, fabricImages: urls })} />
            </div>
          )}
        </div>

        {/* Suit-specific fields */}
        {form.productType === "SUIT" && (
          <div className="bg-white border border-pastel-pink p-6 space-y-5">
            <h2 className="text-xs tracking-[0.2em] uppercase text-accent mb-2">Suit Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Fabric Type</label>
                <input type="text" value={form.fabricType} onChange={(e) => setForm({ ...form, fabricType: e.target.value })} placeholder="Cotton, Silk, Georgette..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Suit Pieces Included</label>
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

            <div className="border-t border-pastel-cream pt-5">
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input type="checkbox" checked={form.stitchingAvailable} onChange={(e) => setForm({ ...form, stitchingAvailable: e.target.checked })} className="accent-accent w-4 h-4" />
                <span className="text-sm text-luxury-text">Stitching Available for this product</span>
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
        <div className="bg-white border border-pastel-pink p-6 space-y-5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-accent mb-2">Pricing</h2>
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
        <div className="bg-white border border-pastel-pink p-6 space-y-5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-accent mb-2">Inventory</h2>
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
        <div className="bg-white border border-pastel-pink p-6 space-y-5">
          <h2 className="text-xs tracking-[0.2em] uppercase text-accent mb-2">Variants</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Sizes <span className="text-luxury-text/30">(comma separated)</span></label>
              <input type="text" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="S, M, L, XL" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Colors <span className="text-luxury-text/30">(comma separated)</span></label>
              <input type="text" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Black, White, Red" className={inputClass} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-accent w-4 h-4" />
            <span className="text-sm text-luxury-text">Featured Product</span>
          </label>
        </div>

        {/* SEO */}
        <div className="bg-white border border-pastel-pink">
          <button type="button" onClick={() => setShowSEO(!showSEO)}
            className="w-full p-6 flex items-center justify-between text-left">
            <h2 className="text-xs tracking-[0.2em] uppercase text-accent">SEO & Meta</h2>
            <ChevronDown size={16} className={`text-accent transition-transform ${showSEO ? "rotate-180" : ""}`} />
          </button>
          {showSEO && (
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className={labelClass}>Meta Title</label>
                <input type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                  placeholder="Defaults to product name" className={inputClass} />
                <p className="text-[10px] text-luxury-text/40 mt-1">{(form.metaTitle || form.name).length}/60 characters</p>
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea value={form.metaDesc} onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                  placeholder="Defaults to product description" rows={2} className={`${inputClass} resize-none`} />
                <p className="text-[10px] text-luxury-text/40 mt-1">{(form.metaDesc || form.description).length}/160 characters</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-luxury flex-1 py-4 disabled:opacity-50">
            {loading ? "Creating..." : "Create Product"}
          </button>
          <Link href="/admin/products" className="btn-outline-luxury px-8 py-4">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
