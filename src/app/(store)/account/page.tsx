"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package, MapPin, User, LogOut, Plus, ChevronDown, ChevronUp,
  XCircle, Key, Edit3, Check, Trash2, ShoppingBag, Scissors, Heart, Clock,
} from "lucide-react";

interface OrderItem {
  id: string; name: string; price: number; quantity: number;
  size?: string; color?: string; image?: string;
  wantStitching?: boolean; stitchingPrice?: number; customizations?: string;
}

interface Address {
  id: string; name: string; phone: string; line1: string; line2?: string;
  city: string; state: string; pincode: string; isDefault: boolean;
}

interface Order {
  id: string; orderNumber: string; total: number; subtotal: number; shipping: number;
  status: string; paymentStatus: string; paymentMethod: string; trackingId?: string;
  createdAt: string; items: OrderItem[]; address: Address;
}

type Tab = "orders" | "custom-orders" | "addresses" | "profile";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<{ id: string; orderNumber: string; status: string; suitType: string; totalPaid: number; createdAt: string }[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false });
  const [addressError, setAddressError] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelMsg, setCancelMsg] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isCustomer = session?.user && (session.user as { role?: string }).role === "customer";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && !isCustomer) router.push("/login");
  }, [status, isCustomer, router]);

  useEffect(() => {
    if (isCustomer) {
      Promise.all([
        fetch("/api/orders").then(r => r.ok ? r.json() : []),
        fetch("/api/addresses").then(r => r.ok ? r.json() : []),
        fetch("/api/custom-stitching").then(r => r.ok ? r.json() : []),
      ]).then(([o, a, c]) => {
        setOrders(o); setAddresses(a); setCustomOrders(c);
        setLoading(false);
      });
      setProfileForm({ name: session?.user?.name || "", phone: (session?.user as { phone?: string })?.phone || "" });
    }
  }, [isCustomer]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault(); setAddressError("");
    const res = await fetch("/api/addresses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(addressForm) });
    if (res.ok) { setShowAddressForm(false); setAddressForm({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false }); const a = await fetch("/api/addresses").then(r => r.json()); setAddresses(a); }
    else { const d = await res.json(); setAddressError(d.error); }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancelMsg("");
    const res = await fetch("/api/orders/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, reason: cancelReason }) });
    const data = await res.json();
    if (res.ok) { setCancelMsg("Order cancelled"); setCancellingOrder(null); setCancelReason(""); setOrders(orders.map(o => o.id === orderId ? { ...o, status: "CANCELLED" } : o)); }
    else setCancelMsg(data.error || "Failed");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setProfileError(""); setProfileMsg("");
    const res = await fetch("/api/auth/update-profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profileForm) });
    if (res.ok) { setProfileMsg("Profile updated!"); setEditingProfile(false); } else { const d = await res.json(); setProfileError(d.error); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setPasswordError(""); setPasswordMsg("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordError("Passwords don't match"); return; }
    const res = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }) });
    if (res.ok) { setPasswordMsg("Password changed!"); setShowPasswordForm(false); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    else { const d = await res.json(); setPasswordError(d.error); }
  };

  const statusColor = (s: string) => ({
    PENDING: "bg-yellow-100 text-yellow-800", CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-indigo-100 text-indigo-800", SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800", CANCELLED: "bg-red-100 text-red-800",
    RETURNED: "bg-gray-100 text-gray-800",
    ORDER_PLACED: "bg-yellow-100 text-yellow-800", FABRIC_SHIPPED: "bg-blue-100 text-blue-800",
    FABRIC_RECEIVED: "bg-indigo-100 text-indigo-800", STITCHING_STARTED: "bg-purple-100 text-purple-800",
    STITCHING_DONE: "bg-green-100 text-green-800", SHIPPED_BACK: "bg-cyan-100 text-cyan-800",
  }[s] || "bg-gray-100 text-gray-800");

  if (status === "loading" || loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-luxury-text text-sm">Loading...</p></div>;
  }
  if (!isCustomer) return null;

  const tabs = [
    { key: "orders" as Tab, label: "Orders", icon: Package, count: orders.length },
    { key: "custom-orders" as Tab, label: "Custom Stitching", icon: Scissors, count: customOrders.length },
    { key: "addresses" as Tab, label: "Addresses", icon: MapPin, count: addresses.length },
    { key: "profile" as Tab, label: "Profile & Security", icon: User },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header card */}
      <div className="bg-gradient-to-r from-luxury-dark to-accent/80 text-white p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-serif">
            {(session?.user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif text-2xl">{profileForm.name || session?.user?.name}</h1>
            <p className="text-white/60 text-sm">{session?.user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-2xl font-medium">{orders.length}</p>
            <p className="text-white/50 text-xs">Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-medium">{customOrders.length}</p>
            <p className="text-white/50 text-xs">Custom</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-medium">{addresses.length}</p>
            <p className="text-white/50 text-xs">Addresses</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="ml-4 flex items-center gap-2 text-white/60 hover:text-white text-xs transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Link href="/shop" className="flex items-center gap-3 bg-white border border-pastel-pink p-4 hover:border-accent transition-colors">
          <ShoppingBag size={18} className="text-accent" />
          <span className="text-xs tracking-wider uppercase text-luxury-dark">Shop Now</span>
        </Link>
        <Link href="/custom-stitching/order" className="flex items-center gap-3 bg-white border border-pastel-pink p-4 hover:border-accent transition-colors">
          <Scissors size={18} className="text-accent" />
          <span className="text-xs tracking-wider uppercase text-luxury-dark">Custom Stitching</span>
        </Link>
        <Link href="/wishlist" className="flex items-center gap-3 bg-white border border-pastel-pink p-4 hover:border-accent transition-colors">
          <Heart size={18} className="text-accent" />
          <span className="text-xs tracking-wider uppercase text-luxury-dark">Wishlist</span>
        </Link>
        <Link href="/track-order" className="flex items-center gap-3 bg-white border border-pastel-pink p-4 hover:border-accent transition-colors">
          <Clock size={18} className="text-accent" />
          <span className="text-xs tracking-wider uppercase text-luxury-dark">Track Order</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 sm:gap-4 border-b border-pastel-pink mb-8 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm tracking-wider uppercase border-b-2 transition-colors whitespace-nowrap ${
              activeTab === key ? "border-accent text-accent" : "border-transparent text-luxury-text/50 hover:text-accent"
            }`}>
            <Icon size={15} /> {label}
            {count !== undefined && count > 0 && (
              <span className="bg-pastel-cream text-luxury-text text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
            )}
          </button>
        ))}
      </div>

      {cancelMsg && <div className={`text-sm px-4 py-3 mb-4 ${cancelMsg.includes("cancelled") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>{cancelMsg}</div>}

      {/* ORDERS TAB */}
      {activeTab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-pastel-pink">
              <Package size={48} className="mx-auto text-pastel-lilac mb-4" />
              <p className="text-luxury-text mb-4">No orders yet</p>
              <Link href="/shop" className="btn-luxury inline-block">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-pastel-pink">
                  <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full p-4 md:p-5 flex items-center justify-between text-left hover:bg-pastel-cream/30 transition-colors">
                    <div className="flex items-center gap-3 md:gap-6 flex-wrap">
                      <div className="hidden sm:block">
                        {order.items[0]?.image && <img src={order.items[0].image} alt="" className="w-12 h-14 object-cover bg-pastel-cream" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-luxury-dark">{order.orderNumber}</p>
                        <p className="text-[10px] text-luxury-text/50">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          {" · "}{order.items.length} item{order.items.length > 1 ? "s" : ""}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-luxury-dark">₹{order.total.toLocaleString("en-IN")}</p>
                      <span className={`text-[10px] tracking-wider uppercase px-3 py-1 ${statusColor(order.status)}`}>{order.status}</span>
                    </div>
                    {expandedOrder === order.id ? <ChevronUp size={16} className="text-accent" /> : <ChevronDown size={16} className="text-luxury-text/30" />}
                  </button>

                  {expandedOrder === order.id && (
                    <div className="border-t border-pastel-cream p-5">
                      <div className="space-y-3 mb-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex gap-3">
                            {item.image && <img src={item.image} alt={item.name} className="w-14 h-18 object-cover bg-pastel-cream" />}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-luxury-dark">{item.name}</p>
                              <p className="text-xs text-luxury-text/60">
                                {item.size && `Size: ${item.size}`}{item.size && item.color && " | "}{item.color && `Color: ${item.color}`} · Qty: {item.quantity}
                              </p>
                              {item.wantStitching && (
                                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 mt-1 inline-block">✂ Stitched — ₹{item.stitchingPrice}</span>
                              )}
                            </div>
                            <p className="text-sm text-luxury-dark">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-pastel-cream text-xs">
                        <div>
                          <p className="text-luxury-text/40 mb-1">Delivery Address</p>
                          <p className="text-luxury-dark">{order.address.name}, {order.address.line1}, {order.address.city}, {order.address.state} — {order.address.pincode}</p>
                          {order.trackingId && <p className="text-accent mt-1">Tracking: {order.trackingId}</p>}
                        </div>
                        <div className="sm:text-right space-y-0.5">
                          <p>Subtotal: ₹{order.subtotal.toLocaleString("en-IN")}</p>
                          <p>Shipping: {order.shipping === 0 ? "Free" : `₹${order.shipping}`}</p>
                          <p className="font-medium text-luxury-dark">Total: ₹{order.total.toLocaleString("en-IN")}</p>
                          <p className="text-luxury-text/40">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
                          <a
                            href={`/api/orders/invoice/${order.orderNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-accent hover:text-accent-dark mt-2 text-xs"
                          >
                            📄 Download Invoice
                          </a>
                        </div>
                      </div>
                      {["PENDING", "CONFIRMED"].includes(order.status) && (
                        <div className="mt-4 pt-4 border-t border-pastel-cream">
                          {cancellingOrder === order.id ? (
                            <div className="flex gap-3 items-center">
                              <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                                className="flex-1 border border-pastel-rose px-3 py-2 text-xs focus:outline-none focus:border-accent">
                                <option value="">Select reason</option>
                                <option>Changed my mind</option><option>Found better price</option>
                                <option>Ordered by mistake</option><option>Other</option>
                              </select>
                              <button onClick={() => handleCancelOrder(order.id)} className="px-4 py-2 bg-red-500 text-white text-xs uppercase hover:bg-red-600">Cancel</button>
                              <button onClick={() => setCancellingOrder(null)} className="text-xs text-luxury-text/40 hover:text-accent">Keep</button>
                            </div>
                          ) : (
                            <button onClick={() => setCancellingOrder(order.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                              <XCircle size={12} /> Cancel Order
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CUSTOM STITCHING ORDERS TAB */}
      {activeTab === "custom-orders" && (
        <div>
          {customOrders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-pastel-pink">
              <Scissors size={48} className="mx-auto text-pastel-lilac mb-4" />
              <p className="text-luxury-text mb-4">No custom stitching orders yet</p>
              <Link href="/custom-stitching/order" className="btn-luxury inline-block">Send Your Fabric</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {customOrders.map((co) => (
                <Link key={co.id} href="/custom-stitching/track"
                  className="block bg-white border border-pastel-pink p-5 hover:border-accent/50 transition-colors">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-sm font-medium text-luxury-dark">{co.orderNumber}</p>
                      <p className="text-[10px] text-luxury-text/50">
                        {co.suitType} · {new Date(co.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-luxury-dark">₹{co.totalPaid.toLocaleString("en-IN")}</p>
                      <span className={`text-[10px] tracking-wider uppercase px-3 py-1 ${statusColor(co.status)}`}>
                        {co.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADDRESSES TAB */}
      {activeTab === "addresses" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {addresses.map((addr) => (
              <div key={addr.id} className={`bg-white border p-5 relative ${addr.isDefault ? "border-accent" : "border-pastel-pink"}`}>
                {addr.isDefault && <span className="text-[10px] tracking-wider uppercase text-accent mb-2 block font-medium">Default</span>}
                <p className="text-sm font-medium text-luxury-dark">{addr.name}</p>
                <p className="text-xs text-luxury-text mt-1">{addr.line1}{addr.line2 && `, ${addr.line2}`}</p>
                <p className="text-xs text-luxury-text">{addr.city}, {addr.state} — {addr.pincode}</p>
                <p className="text-xs text-luxury-text/60 mt-1">Ph: {addr.phone}</p>
                {!addr.isDefault && (
                  <button onClick={() => handleDeleteAddress(addr.id)}
                    className="absolute top-4 right-4 text-luxury-text/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                )}
              </div>
            ))}
          </div>
          {!showAddressForm ? (
            <button onClick={() => setShowAddressForm(true)} className="btn-outline-luxury flex items-center gap-2"><Plus size={14} /> Add Address</button>
          ) : (
            <form onSubmit={handleAddAddress} className="bg-white border border-pastel-pink p-6 space-y-4">
              <p className="text-xs tracking-wider uppercase text-luxury-dark font-medium">New Address</p>
              {addressError && <p className="text-red-500 text-sm bg-red-50 py-2 px-4">{addressError}</p>}
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Full Name" value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                <input type="tel" placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
              </div>
              <input type="text" placeholder="Address Line 1" value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
              <input type="text" placeholder="Address Line 2" value={addressForm.line2} onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })} className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                <input type="text" placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                <input type="text" placeholder="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
              </div>
              <label className="flex items-center gap-2 text-sm text-luxury-text"><input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="accent-accent" /> Default</label>
              <div className="flex gap-3">
                <button type="submit" className="btn-luxury">Save</button>
                <button type="button" onClick={() => setShowAddressForm(false)} className="btn-outline-luxury">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile info */}
          <div className="bg-white border border-pastel-pink p-6">
            <h3 className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-4 flex items-center gap-2"><User size={14} /> Profile</h3>
            {profileMsg && <p className="text-green-600 text-sm bg-green-50 py-2 px-4 mb-4">{profileMsg}</p>}
            {profileError && <p className="text-red-500 text-sm bg-red-50 py-2 px-4 mb-4">{profileError}</p>}

            {editingProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-[10px] tracking-wider uppercase text-luxury-text/50 block mb-1">Name</label>
                  <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                </div>
                <div>
                  <label className="text-[10px] tracking-wider uppercase text-luxury-text/50 block mb-1">Phone</label>
                  <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" placeholder="Phone" />
                </div>
                <div>
                  <label className="text-[10px] tracking-wider uppercase text-luxury-text/50 block mb-1">Email</label>
                  <p className="text-sm text-luxury-text/50 border border-pastel-pink px-4 py-3 bg-pastel-cream">{session?.user?.email}</p>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-luxury flex items-center gap-2"><Check size={14} /> Save</button>
                  <button type="button" onClick={() => setEditingProfile(false)} className="btn-outline-luxury">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-pastel-cream">
                  <span className="text-xs text-luxury-text/50">Name</span>
                  <span className="text-sm text-luxury-dark">{profileForm.name || session?.user?.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-pastel-cream">
                  <span className="text-xs text-luxury-text/50">Email</span>
                  <span className="text-sm text-luxury-dark">{session?.user?.email}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-luxury-text/50">Phone</span>
                  <span className="text-sm text-luxury-dark">{profileForm.phone || "Not set"}</span>
                </div>
                <button onClick={() => setEditingProfile(true)} className="btn-outline-luxury flex items-center gap-2 text-sm mt-2"><Edit3 size={14} /> Edit Profile</button>
              </div>
            )}
          </div>

          {/* Security */}
          <div className="bg-white border border-pastel-pink p-6">
            <h3 className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-4 flex items-center gap-2"><Key size={14} /> Security</h3>
            {passwordMsg && <p className="text-green-600 text-sm bg-green-50 py-2 px-4 mb-4">{passwordMsg}</p>}
            {passwordError && <p className="text-red-500 text-sm bg-red-50 py-2 px-4 mb-4">{passwordError}</p>}

            {showPasswordForm ? (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input type="password" placeholder="Current Password" value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                <input type="password" placeholder="New Password (min 6)" value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required minLength={6} />
                <input type="password" placeholder="Confirm New Password" value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                <div className="flex gap-3">
                  <button type="submit" className="btn-luxury">Change Password</button>
                  <button type="button" onClick={() => setShowPasswordForm(false)} className="btn-outline-luxury">Cancel</button>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-sm text-luxury-text mb-4">Change your account password. We recommend using a strong password.</p>
                <button onClick={() => setShowPasswordForm(true)} className="btn-outline-luxury flex items-center gap-2 text-sm"><Key size={14} /> Change Password</button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-pastel-pink">
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
                <LogOut size={14} /> Sign Out of Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
