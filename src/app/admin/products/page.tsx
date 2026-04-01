"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Trash2, Package, ChevronLeft, ChevronRight,
  ArrowUpDown, MoreHorizontal, Archive, Eye, EyeOff, CheckSquare, Square
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  status: string;
  inStock: boolean;
  stock: number;
  lowStockAt: number;
  featured: boolean;
  category: { name: string };
  createdAt: string;
}

const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((data) => { setProducts(data); setLoading(false); });
  }, []);

  const refresh = () => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  };

  const filtered = products.filter((p) => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchStock = stockFilter === "ALL" ||
      (stockFilter === "LOW" && p.stock > 0 && p.stock <= (p.lowStockAt || 5)) ||
      (stockFilter === "OUT" && p.stock === 0) ||
      (stockFilter === "IN" && p.stock > 0);
    return matchSearch && matchStatus && matchStock;
  });

  const sorted = [...filtered].sort((a, b) => {
    let valA: string | number = 0, valB: string | number = 0;
    if (sortBy === "name") { valA = a.name; valB = b.name; }
    else if (sortBy === "price") { valA = a.price; valB = b.price; }
    else if (sortBy === "stock") { valA = a.stock; valB = b.stock; }
    else { valA = a.createdAt; valB = b.createdAt; }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: string) => {
    if (sortBy === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortDir("asc"); }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map((p) => p.id)));
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} product(s)?`)) return;
    for (const id of Array.from(selected)) {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
    }
    setSelected(new Set());
    refresh();
  };

  const bulkStatus = async (status: string) => {
    for (const id of Array.from(selected)) {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    }
    setSelected(new Set());
    refresh();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setShowActions(null);
    refresh();
  };

  const stockBadge = (p: Product) => {
    if (p.stock === 0) return <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 tracking-wider uppercase">Out</span>;
    if (p.stock <= (p.lowStockAt || 5)) return <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 tracking-wider uppercase">{p.stock} left</span>;
    return <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 tracking-wider uppercase">{p.stock}</span>;
  };

  const statusBadge = (s: string) => {
    if (s === "ACTIVE") return <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 tracking-wider uppercase">Active</span>;
    if (s === "DRAFT") return <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 tracking-wider uppercase">Draft</span>;
    return <span className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 tracking-wider uppercase">Archived</span>;
  };

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "ACTIVE").length,
    draft: products.filter((p) => p.status === "DRAFT").length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockAt || 5)).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  if (loading) return <p className="text-sm text-luxury-text py-20 text-center">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-luxury-dark">Products</h1>
          <p className="text-xs text-luxury-text/50 mt-1">
            {stats.total} total · {stats.active} active
            {stats.lowStock > 0 && <span className="text-yellow-600"> · {stats.lowStock} low stock</span>}
            {stats.outOfStock > 0 && <span className="text-red-500"> · {stats.outOfStock} out of stock</span>}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-luxury flex items-center gap-2 text-xs">
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total, color: "text-luxury-dark", click: () => { setStatusFilter("ALL"); setStockFilter("ALL"); } },
          { label: "Active", value: stats.active, color: "text-green-600", click: () => { setStatusFilter("ACTIVE"); setStockFilter("ALL"); } },
          { label: "Draft", value: stats.draft, color: "text-gray-500", click: () => { setStatusFilter("DRAFT"); setStockFilter("ALL"); } },
          { label: "Low Stock", value: stats.lowStock, color: "text-yellow-600", click: () => { setStockFilter("LOW"); setStatusFilter("ALL"); } },
          { label: "Out of Stock", value: stats.outOfStock, color: "text-red-600", click: () => { setStockFilter("OUT"); setStatusFilter("ALL"); } },
        ].map((s) => (
          <button key={s.label} onClick={() => { s.click(); setPage(1); }}
            className="bg-white border border-pastel-pink p-3 text-center hover:border-accent transition-colors">
            <p className={`text-xl font-medium ${s.color}`}>{s.value}</p>
            <p className="text-[9px] tracking-wider uppercase text-luxury-text/40">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-text/30" />
          <input type="text" placeholder="Search products or SKU..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 border border-pastel-pink text-sm focus:outline-none focus:border-accent" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-pastel-pink px-3 py-2 text-sm focus:outline-none focus:border-accent bg-white">
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setPage(1); }}
          className="border border-pastel-pink px-3 py-2 text-sm focus:outline-none focus:border-accent bg-white">
          <option value="ALL">All Stock</option>
          <option value="IN">In Stock</option>
          <option value="LOW">Low Stock</option>
          <option value="OUT">Out of Stock</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-4 bg-accent/5 border border-accent/20 p-3">
          <span className="text-xs text-accent font-medium">{selected.size} selected</span>
          <button onClick={() => bulkStatus("ACTIVE")} className="text-xs text-green-600 hover:underline flex items-center gap-1"><Eye size={12} /> Active</button>
          <button onClick={() => bulkStatus("DRAFT")} className="text-xs text-gray-500 hover:underline flex items-center gap-1"><EyeOff size={12} /> Draft</button>
          <button onClick={() => bulkStatus("ARCHIVED")} className="text-xs text-orange-600 hover:underline flex items-center gap-1"><Archive size={12} /> Archive</button>
          <button onClick={bulkDelete} className="text-xs text-red-500 hover:underline flex items-center gap-1 ml-auto"><Trash2 size={12} /> Delete</button>
          <button onClick={() => setSelected(new Set())} className="text-xs text-luxury-text/40 hover:underline">Clear</button>
        </div>
      )}

      {/* Table */}
      {paginated.length === 0 ? (
        <div className="text-center py-16 bg-white border border-pastel-pink">
          <Package size={48} className="mx-auto text-pastel-lilac mb-4" />
          <p className="text-luxury-text">No products found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pastel-pink bg-white text-left">
                <th className="py-3 px-3 w-8">
                  <button onClick={selectAll}>
                    {selected.size === paginated.length && paginated.length > 0
                      ? <CheckSquare size={16} className="text-accent" />
                      : <Square size={16} className="text-luxury-text/30" />}
                  </button>
                </th>
                <th className="py-3 px-3 w-12"></th>
                <th className="py-3 px-3"><button onClick={() => toggleSort("name")} className="flex items-center gap-1 text-[10px] tracking-wider uppercase text-accent">Product <ArrowUpDown size={10} /></button></th>
                <th className="py-3 px-3 text-[10px] tracking-wider uppercase text-accent">Status</th>
                <th className="py-3 px-3"><button onClick={() => toggleSort("stock")} className="flex items-center gap-1 text-[10px] tracking-wider uppercase text-accent">Inventory <ArrowUpDown size={10} /></button></th>
                <th className="py-3 px-3 text-[10px] tracking-wider uppercase text-accent">Category</th>
                <th className="py-3 px-3"><button onClick={() => toggleSort("price")} className="flex items-center gap-1 text-[10px] tracking-wider uppercase text-accent">Price <ArrowUpDown size={10} /></button></th>
                <th className="py-3 px-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id} className={`border-b border-pastel-cream bg-white hover:bg-pastel-cream/30 ${selected.has(p.id) ? "bg-accent/5" : ""}`}>
                  <td className="py-2 px-3"><button onClick={() => toggleSelect(p.id)}>
                    {selected.has(p.id) ? <CheckSquare size={16} className="text-accent" /> : <Square size={16} className="text-luxury-text/20" />}
                  </button></td>
                  <td className="py-2 px-3">
                    <div className="w-10 h-12 bg-pastel-cream overflow-hidden">
                      {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <Link href={`/admin/products/${p.id}`} className="text-sm font-medium text-luxury-dark hover:text-accent">{p.name}</Link>
                    {p.sku && <p className="text-[10px] text-luxury-text/40 font-mono mt-0.5">{p.sku}</p>}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={async () => {
                        const newStatus = p.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
                        await fetch(`/api/products/${p.id}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: newStatus }),
                        });
                        setProducts((prev) => prev.map((pr) => pr.id === p.id ? { ...pr, status: newStatus } : pr));
                      }}
                      className="cursor-pointer hover:opacity-70"
                      title="Click to toggle Active/Draft"
                    >
                      {statusBadge(p.status || "ACTIVE")}
                    </button>
                  </td>
                  <td className="py-2 px-3">{stockBadge(p)}</td>
                  <td className="py-2 px-3 text-xs text-luxury-text/60">{p.category.name}</td>
                  <td className="py-2 px-3">
                    <span className="text-sm font-medium">₹{p.price.toLocaleString("en-IN")}</span>
                    {p.comparePrice && <span className="text-[10px] text-luxury-text/40 line-through ml-1">₹{p.comparePrice.toLocaleString("en-IN")}</span>}
                  </td>
                  <td className="py-2 px-3 relative">
                    <button onClick={() => setShowActions(showActions === p.id ? null : p.id)} className="p-1 hover:bg-pastel-cream rounded">
                      <MoreHorizontal size={16} className="text-luxury-text/40" />
                    </button>
                    {showActions === p.id && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-pastel-pink shadow-lg z-10 min-w-[140px]">
                        <Link href={`/admin/products/${p.id}`} className="block px-4 py-2 text-xs hover:bg-pastel-cream">Edit</Link>
                        <Link href={`/shop/${p.slug}`} target="_blank" className="block px-4 py-2 text-xs hover:bg-pastel-cream">View in Store</Link>
                        <button onClick={() => deleteProduct(p.id)} className="block w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50">Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-luxury-text/40">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
          </p>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="w-8 h-8 border border-pastel-pink flex items-center justify-center disabled:opacity-30 hover:border-accent"><ChevronLeft size={14} /></button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 border text-xs flex items-center justify-center ${p === page ? "border-accent bg-accent text-white" : "border-pastel-pink hover:border-accent"}`}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="w-8 h-8 border border-pastel-pink flex items-center justify-center disabled:opacity-30 hover:border-accent"><ChevronRight size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
