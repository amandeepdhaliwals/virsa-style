"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { MapPin, Plus, ChevronRight, ShieldCheck, Truck, Check, Tag } from "lucide-react";

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

type Step = "address" | "payment" | "confirm";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const hasHydrated = useCartStore((s) => s._hasHydrated);

  const [step, setStep] = useState<Step>("address");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", country: "India", isDefault: false,
  });
  const [formError, setFormError] = useState("");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponError, setCouponError] = useState("");

  const isCustomer = session?.user && (session.user as { role?: string }).role === "customer";
  const subtotal = hasHydrated ? items.reduce((acc, i) => acc + i.price * i.quantity, 0) : 0;

  // Get country from selected address for shipping calculation
  const selectedAddr = addresses.find((a) => a.id === selectedAddress);
  const selectedCountry = (selectedAddr as { country?: string })?.country || "India";
  const isInternational = selectedCountry !== "India";
  const shipping = isInternational
    ? (subtotal >= 5000 ? 0 : 799)
    : (subtotal >= 999 ? 0 : 79);
  const total = subtotal + shipping - couponDiscount;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/checkout");
    }
    if (status === "authenticated" && !isCustomer) {
      router.push("/login?redirect=/checkout");
    }
  }, [status, isCustomer, router]);

  useEffect(() => {
    if (isCustomer) fetchAddresses();
  }, [isCustomer]);

  const fetchAddresses = async () => {
    const res = await fetch("/api/addresses");
    if (res.ok) {
      const data = await res.json();
      setAddresses(data);
      const defaultAddr = data.find((a: Address) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
      else if (data.length > 0) setSelectedAddress(data[0].id);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressForm),
    });
    if (res.ok) {
      const addr = await res.json();
      setShowAddressForm(false);
      setAddressForm({ name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", isDefault: false });
      fetchAddresses();
      setSelectedAddress(addr.id);
    } else {
      const data = await res.json();
      setFormError(data.error);
    }
  };

  const createOrder = async () => {
    const orderItems = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      wantStitching: item.wantStitching || false,
      stitchingPrice: item.stitchingPrice || 0,
      customizations: item.customizations,
      measurements: item.measurements,
      designReference: item.designReference,
    }));

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addressId: selectedAddress,
        items: orderItems,
        paymentMethod,
        notes: notes || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to place order");
    }

    return res.json();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    setLoading(true);
    setFormError("");

    try {
      if (paymentMethod === "COD") {
        const order = await createOrder();
        setOrderPlaced(order.orderNumber);
        clearCart();
      } else {
        // Online payment via Razorpay
        const payRes = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });

        if (!payRes.ok) {
          throw new Error("Failed to initiate payment");
        }

        const payData = await payRes.json();

        // Create the order first
        const order = await createOrder();

        // Load Razorpay
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);

        script.onload = () => {
          const options = {
            key: payData.key,
            amount: payData.amount,
            currency: payData.currency,
            name: "ਵਿਰਸਾ Style",
            description: `Order ${order.orderNumber}`,
            order_id: payData.orderId,
            handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
              // Verify payment
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...response,
                  orderId: order.id,
                }),
              });

              if (verifyRes.ok) {
                setOrderPlaced(order.orderNumber);
                clearCart();
              } else {
                setFormError("Payment verification failed. Contact support with order: " + order.orderNumber);
              }
            },
            prefill: {
              name: session?.user?.name || "",
              email: session?.user?.email || "",
            },
            theme: { color: "#C48B9F" },
            modal: {
              ondismiss: () => {
                setFormError("Payment was cancelled. Your order has been saved. Complete payment from your account.");
                setLoading(false);
              },
            },
          };

          const rzp = new (window as unknown as { Razorpay: new (opts: typeof options) => { open: () => void } }).Razorpay(options);
          rzp.open();
        };

        return; // Don't set loading false yet — Razorpay modal is open
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }

    setLoading(false);
  };

  if (!mounted || !hasHydrated) return null;

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-luxury-text">Loading...</p>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-luxury-dark mb-4">Your cart is empty</h1>
        <Link href="/shop" className="btn-luxury inline-block">Continue Shopping</Link>
      </div>
    );
  }

  // Order success
  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-green-600" />
        </div>
        <h1 className="font-serif text-3xl text-luxury-dark mb-3">Order Placed!</h1>
        <p className="text-luxury-text mb-2">
          Your order <span className="font-medium text-luxury-dark">{orderPlaced}</span> has been placed successfully.
        </p>
        <p className="text-sm text-luxury-text/60 mb-8">
          You&apos;ll receive a confirmation on WhatsApp shortly. Track your order from your account.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/account" className="btn-luxury">View Orders</Link>
          <Link href="/shop" className="btn-outline-luxury">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-serif text-3xl text-luxury-dark mb-8">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-10">
        {(["address", "payment", "confirm"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (s === "address") setStep("address");
                if (s === "payment" && selectedAddress) setStep("payment");
                if (s === "confirm" && selectedAddress) setStep("confirm");
              }}
              className={`w-8 h-8 rounded-full text-xs flex items-center justify-center transition-colors ${
                step === s
                  ? "bg-accent text-white"
                  : (s === "address" || (s === "payment" && selectedAddress) || (s === "confirm" && selectedAddress))
                  ? "bg-pastel-pink text-luxury-dark"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {i + 1}
            </button>
            <span className={`text-xs tracking-wider uppercase hidden sm:block ${
              step === s ? "text-accent" : "text-luxury-text/40"
            }`}>
              {s === "address" ? "Address" : s === "payment" ? "Payment" : "Confirm"}
            </span>
            {i < 2 && <ChevronRight size={14} className="text-luxury-text/20 mx-2" />}
          </div>
        ))}
      </div>

      {formError && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 mb-6">{formError}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === "address" && (
            <div>
              <h2 className="text-sm tracking-wider uppercase text-luxury-dark font-medium mb-6">
                <MapPin size={16} className="inline mr-2" />
                Select Delivery Address
              </h2>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-6">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-4 border p-5 cursor-pointer transition-colors ${
                        selectedAddress === addr.id ? "border-accent bg-pastel-cream" : "border-pastel-pink hover:border-accent/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="mt-1 accent-accent"
                      />
                      <div>
                        <p className="text-sm font-medium text-luxury-dark">
                          {addr.name} {addr.isDefault && <span className="text-[10px] text-accent ml-2">DEFAULT</span>}
                        </p>
                        <p className="text-sm text-luxury-text mt-1">
                          {addr.line1}{addr.line2 && `, ${addr.line2}`}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-sm text-luxury-text/60">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {!showAddressForm ? (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="btn-outline-luxury flex items-center gap-2 mb-6"
                >
                  <Plus size={16} /> Add New Address
                </button>
              ) : (
                <form onSubmit={handleAddAddress} className="border border-pastel-pink p-6 space-y-4 mb-6">
                  <h3 className="text-sm font-medium text-luxury-dark">New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" value={addressForm.name}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                    <input type="tel" placeholder="Phone Number" value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                  </div>
                  <input type="text" placeholder="Address Line 1" value={addressForm.line1}
                    onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                  <input type="text" placeholder="Address Line 2 (optional)" value={addressForm.line2}
                    onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="City" value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                    <input type="text" placeholder="State" value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                    <input type="text" placeholder="Pincode / ZIP" value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                  </div>
                  <div>
                    <select value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white">
                      <option value="India">India</option>
                      <option value="Canada">Canada</option>
                      <option value="United States">United States</option>
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="UAE / Dubai">UAE / Dubai</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Germany">Germany</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Kuwait">Kuwait</option>
                      <option value="Qatar">Qatar</option>
                      <option value="Other">Other Country</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-luxury-text">
                    <input type="checkbox" checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      className="accent-accent" />
                    Set as default
                  </label>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-luxury">Save</button>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="btn-outline-luxury">Cancel</button>
                  </div>
                </form>
              )}

              <button
                onClick={() => selectedAddress && setStep("payment")}
                disabled={!selectedAddress}
                className="btn-luxury w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === "payment" && (
            <div>
              <h2 className="text-sm tracking-wider uppercase text-luxury-dark font-medium mb-6">
                <ShieldCheck size={16} className="inline mr-2" />
                Payment Method
              </h2>

              <div className="space-y-3 mb-6">
                {[
                  { id: "UPI", label: "UPI Payment", desc: "Pay via Google Pay, PhonePe, Paytm etc.", icon: "📱" },
                  { id: "CARD", label: "Credit / Debit Card", desc: "Visa, Mastercard, Rupay", icon: "💳" },
                  { id: "NETBANKING", label: "Net Banking", desc: "All major banks supported", icon: "🏦" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 border p-5 cursor-pointer transition-colors ${
                      paymentMethod === method.id ? "border-accent bg-pastel-cream" : "border-pastel-pink hover:border-accent/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-accent"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-luxury-dark">{method.label}</p>
                      <p className="text-xs text-luxury-text/60">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <label className="text-xs tracking-wider uppercase text-luxury-text block mb-2">
                  Order Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special instructions for delivery..."
                  className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep("address")} className="btn-outline-luxury">
                  Back
                </button>
                <button onClick={() => setStep("confirm")} className="btn-luxury flex-1 py-4">
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === "confirm" && (
            <div>
              <h2 className="text-sm tracking-wider uppercase text-luxury-dark font-medium mb-6">
                Review Your Order
              </h2>

              {/* Delivery address */}
              {selectedAddr && (
                <div className="border border-pastel-pink p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs tracking-wider uppercase text-accent">Delivering To</p>
                    <button onClick={() => setStep("address")} className="text-xs text-accent hover:underline">Change</button>
                  </div>
                  <p className="text-sm font-medium text-luxury-dark">{selectedAddr.name}</p>
                  <p className="text-sm text-luxury-text">
                    {selectedAddr.line1}{selectedAddr.line2 && `, ${selectedAddr.line2}`}, {selectedAddr.city}, {selectedAddr.state} - {selectedAddr.pincode}
                  </p>
                  <p className="text-sm text-luxury-text/60">Phone: {selectedAddr.phone}</p>
                </div>
              )}

              {/* Items */}
              <div className="border border-pastel-pink p-5 mb-6">
                <p className="text-xs tracking-wider uppercase text-accent mb-4">Items ({items.length})</p>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <img src={item.image || "/placeholder.jpg"} alt={item.name} className="w-14 h-18 object-cover bg-pastel-cream" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-luxury-dark">{item.name}</p>
                        <p className="text-xs text-luxury-text/60">
                          {item.size && `Size: ${item.size}`}{item.size && item.color && " | "}{item.color && `Color: ${item.color}`}
                          {" "} Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-luxury-dark">
                        &#8377;{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment method */}
              <div className="border border-pastel-pink p-5 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs tracking-wider uppercase text-accent mb-1">Payment</p>
                    <p className="text-sm text-luxury-dark">{paymentMethod === "COD" ? "Cash on Delivery" : paymentMethod}</p>
                  </div>
                  <button onClick={() => setStep("payment")} className="text-xs text-accent hover:underline">Change</button>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep("payment")} className="btn-outline-luxury">Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-luxury flex-1 py-4 disabled:opacity-50"
                >
                  {loading ? "Placing Order..." : `Place Order — ₹${total.toLocaleString("en-IN")}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white border border-pastel-pink p-6 h-fit sticky top-24">
          <h2 className="text-xs tracking-[0.3em] uppercase text-luxury-dark mb-6">Order Summary</h2>
          <div className="space-y-3 border-b border-pastel-pink pb-4 mb-4">
            <div className="flex justify-between text-sm text-luxury-text">
              <span>Subtotal ({items.length} items)</span>
              <span>&#8377;{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm text-luxury-text">
              <span>Shipping {isInternational && <span className="text-[10px] text-accent">(International)</span>}</span>
              <span className={shipping === 0 ? "text-green-600" : ""}>
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Coupon ({couponCode})</span>
                <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          {/* Coupon Input */}
          <div className="border-b border-pastel-pink pb-4 mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-text/30" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); setCouponMsg(""); }}
                  placeholder="Coupon code"
                  className="w-full pl-9 pr-3 py-2 border border-pastel-pink text-xs focus:outline-none focus:border-accent uppercase"
                />
              </div>
              <button
                type="button"
                onClick={async () => {
                  if (!couponCode) return;
                  setCouponError("");
                  setCouponMsg("");
                  const res = await fetch("/api/coupons/validate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: couponCode, orderTotal: subtotal }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setCouponDiscount(data.discount);
                    setCouponMsg(data.message);
                  } else {
                    setCouponDiscount(0);
                    setCouponError(data.error);
                  }
                }}
                className="px-4 py-2 bg-accent text-white text-xs tracking-wider uppercase hover:bg-accent-dark transition-colors"
              >
                Apply
              </button>
            </div>
            {couponMsg && <p className="text-green-600 text-[10px] mt-1">{couponMsg}</p>}
            {couponError && <p className="text-red-500 text-[10px] mt-1">{couponError}</p>}
          </div>

          <div className="flex justify-between text-lg font-medium text-luxury-dark mb-4">
            <span>Total</span>
            <span>&#8377;{total.toLocaleString("en-IN")}</span>
          </div>

          <div className="space-y-2 text-[11px] text-luxury-text/50">
            <div className="flex items-center gap-2">
              <Truck size={12} />
              {isInternational
                ? (subtotal >= 5000 ? "Free international shipping applied!" : "Free international shipping above ₹5,000")
                : (subtotal >= 999 ? "Free shipping applied" : "Free shipping above ₹999")
              }
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} />
              Secure checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
