"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, IndianRupee, Users, AlertTriangle, Ticket, Clock, Download } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string };
}

interface Product {
  id: string;
  name: string;
  stock: number;
  lowStockAt: number;
  images: string[];
  price: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0, categories: 0, orders: 0, revenue: 0,
    pendingOrders: 0, customers: 0, todayOrders: 0, todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.ok ? r.json() : []),
      fetch("/api/admin/customers").then((r) => r.ok ? r.json() : []),
    ]).then(([products, categories, orders, customers]) => {
      const ordersList = Array.isArray(orders) ? orders : [];
      const today = new Date().toDateString();
      const todayOrders = ordersList.filter((o: { createdAt: string }) => new Date(o.createdAt).toDateString() === today);

      setStats({
        products: products.length,
        categories: categories.length,
        orders: ordersList.length,
        revenue: ordersList.reduce((acc: number, o: { total: number; status: string }) => o.status !== "CANCELLED" ? acc + o.total : acc, 0),
        pendingOrders: ordersList.filter((o: { status: string }) => o.status === "PENDING").length,
        customers: Array.isArray(customers) ? customers.length : 0,
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((acc: number, o: { total: number }) => acc + o.total, 0),
      });

      setRecentOrders(ordersList.slice(0, 5));
      setLowStockProducts(
        products.filter((p: Product) => p.stock <= (p.lowStockAt || 5)).slice(0, 5)
      );
    });
  }, []);

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800", CONFIRMED: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-purple-100 text-purple-800", DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return map[s] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-luxury-dark">Dashboard</h1>
          <p className="text-xs text-luxury-text/50 mt-1">Welcome back! Here&apos;s your store overview.</p>
        </div>
        <Link href="/admin/products/new" className="btn-luxury flex items-center gap-2 text-xs">
          <Package size={14} /> Add Product
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 border border-pastel-pink">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] tracking-wider uppercase text-luxury-text/50">Total Revenue</span>
            <IndianRupee size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-medium text-luxury-dark">₹{stats.revenue.toLocaleString("en-IN")}</p>
          <p className="text-[10px] text-green-600 mt-1">₹{stats.todayRevenue.toLocaleString("en-IN")} today</p>
        </div>

        <div className="bg-white p-5 border border-pastel-pink">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] tracking-wider uppercase text-luxury-text/50">Orders</span>
            <ShoppingCart size={18} className="text-accent" />
          </div>
          <p className="text-2xl font-medium text-luxury-dark">{stats.orders}</p>
          <p className="text-[10px] mt-1">
            {stats.todayOrders > 0 ? <span className="text-green-600">{stats.todayOrders} today</span> : <span className="text-luxury-text/40">0 today</span>}
            {stats.pendingOrders > 0 && <span className="text-yellow-600 ml-2">{stats.pendingOrders} pending</span>}
          </p>
        </div>

        <div className="bg-white p-5 border border-pastel-pink">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] tracking-wider uppercase text-luxury-text/50">Products</span>
            <Package size={18} className="text-accent" />
          </div>
          <p className="text-2xl font-medium text-luxury-dark">{stats.products}</p>
          {lowStockProducts.length > 0 && (
            <p className="text-[10px] text-yellow-600 mt-1">{lowStockProducts.length} low stock</p>
          )}
        </div>

        <div className="bg-white p-5 border border-pastel-pink">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] tracking-wider uppercase text-luxury-text/50">Customers</span>
            <Users size={18} className="text-accent" />
          </div>
          <p className="text-2xl font-medium text-luxury-dark">{stats.customers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white border border-pastel-pink">
          <div className="flex items-center justify-between p-5 border-b border-pastel-cream">
            <h2 className="text-xs tracking-wider uppercase text-accent flex items-center gap-2">
              <Clock size={14} /> Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-[10px] text-accent hover:underline">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-luxury-text/40 text-center">No orders yet</p>
          ) : (
            <div className="divide-y divide-pastel-cream">
              {recentOrders.map((o) => (
                <div key={o.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-luxury-dark font-mono">{o.orderNumber}</p>
                    <p className="text-[10px] text-luxury-text/50">{o.user?.name} · {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{o.total.toLocaleString("en-IN")}</p>
                    <span className={`text-[9px] px-2 py-0.5 tracking-wider uppercase ${statusColor(o.status)}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="bg-white border border-pastel-pink p-5">
          <h2 className="text-xs tracking-wider uppercase text-accent mb-4 flex items-center gap-2">
            <Download size={14} /> Export Data
          </h2>
          <div className="flex flex-wrap gap-3">
            <a href="/api/admin/export/orders" className="flex items-center gap-2 px-4 py-2 bg-luxury-dark text-white text-xs tracking-wider uppercase hover:bg-accent transition-colors">
              <Download size={12} /> Orders CSV
            </a>
            <a href="/api/admin/export/customers" className="flex items-center gap-2 px-4 py-2 bg-luxury-dark text-white text-xs tracking-wider uppercase hover:bg-accent transition-colors">
              <Download size={12} /> Customers CSV
            </a>
            <a href="/api/admin/export/products" className="flex items-center gap-2 px-4 py-2 bg-luxury-dark text-white text-xs tracking-wider uppercase hover:bg-accent transition-colors">
              <Download size={12} /> Products CSV
            </a>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-pastel-pink">
          <div className="flex items-center justify-between p-5 border-b border-pastel-cream">
            <h2 className="text-xs tracking-wider uppercase text-accent flex items-center gap-2">
              <AlertTriangle size={14} /> Low Stock Alerts
            </h2>
            <Link href="/admin/products" className="text-[10px] text-accent hover:underline">View all</Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="p-5 text-sm text-green-600 text-center">All products well stocked!</p>
          ) : (
            <div className="divide-y divide-pastel-cream">
              {lowStockProducts.map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}`} className="p-4 flex items-center gap-3 hover:bg-pastel-cream/30">
                  <div className="w-10 h-12 bg-pastel-cream overflow-hidden flex-shrink-0">
                    {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-luxury-dark">{p.name}</p>
                    <p className="text-[10px] text-luxury-text/40">₹{p.price.toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 tracking-wider uppercase ${
                    p.stock === 0 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {p.stock === 0 ? "Out" : `${p.stock} left`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/orders" className="bg-white p-6 border border-pastel-pink hover:border-accent transition-colors group text-center">
          <ShoppingCart size={24} className="mx-auto text-accent mb-2" />
          <p className="text-sm font-medium text-luxury-dark group-hover:text-accent">Orders</p>
        </Link>
        <Link href="/admin/products/new" className="bg-white p-6 border border-pastel-pink hover:border-accent transition-colors group text-center">
          <Package size={24} className="mx-auto text-accent mb-2" />
          <p className="text-sm font-medium text-luxury-dark group-hover:text-accent">Add Product</p>
        </Link>
        <Link href="/admin/customers" className="bg-white p-6 border border-pastel-pink hover:border-accent transition-colors group text-center">
          <Users size={24} className="mx-auto text-accent mb-2" />
          <p className="text-sm font-medium text-luxury-dark group-hover:text-accent">Customers</p>
        </Link>
        <Link href="/admin/coupons" className="bg-white p-6 border border-pastel-pink hover:border-accent transition-colors group text-center">
          <Ticket size={24} className="mx-auto text-accent mb-2" />
          <p className="text-sm font-medium text-luxury-dark group-hover:text-accent">Coupons</p>
        </Link>
      </div>
    </div>
  );
}
