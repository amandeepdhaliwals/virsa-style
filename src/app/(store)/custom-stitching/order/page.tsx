"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Check, X, MapPin, Scissors, Ruler, CreditCard, Package, Truck } from "lucide-react";
import AuthModal from "@/components/AuthModal";

const SUIT_TYPES = [
  { value: "Punjabi Salwar Suit", price: 800 },
  { value: "Pant Plazo Suit", price: 800 },
  { value: "Straight Plazo Suit", price: 850 },
  { value: "Sharara Suit", price: 1100 },
  { value: "Gharara Suit", price: 1200 },
  { value: "Pajami Suit", price: 850 },
];

const NECK_STYLES = [
  { name: "Round Neck", price: 0 },
  { name: "V-Neck", price: 0 },
  { name: "Square Neck", price: 0 },
  { name: "Boat Neck", price: 100 },
  { name: "Chinese Collar", price: 150 },
  { name: "Sweetheart Neck", price: 100 },
  { name: "High Neck", price: 100 },
];

const SLEEVE_STYLES = [
  { name: "Full Sleeve", price: 0 },
  { name: "3/4 Sleeve", price: 0 },
  { name: "Half Sleeve", price: 0 },
  { name: "Sleeveless", price: 0 },
  { name: "Bell Sleeve", price: 150 },
  { name: "Puff Sleeve", price: 200 },
];

const EXTRAS = [
  { name: "Lining", price: 200 },
  { name: "Canvas Padding", price: 250 },
  { name: "Side Pocket", price: 100 },
  { name: "Piping", price: 150 },
];

const MEASUREMENT_FIELDS = [
  { key: "bust", label: "Bust / Chest" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "shoulder", label: "Shoulder" },
  { key: "armLength", label: "Arm Length" },
  { key: "kameezLength", label: "Kameez Length" },
  { key: "bottomLength", label: "Bottom Length" },
  { key: "armhole", label: "Armhole" },
];

type Step = "design" | "measurements" | "shipping" | "review";

export default function CustomStitchingOrderPage() {
  const { data: session, status, update } = useSession();
  const [step, setStep] = useState<Step>("design");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Design
  const [suitType, setSuitType] = useState("");
  const [neckStyle, setNeckStyle] = useState("Round Neck");
  const [sleeveStyle, setSleeveStyle] = useState("Full Sleeve");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialNotes, setSpecialNotes] = useState("");
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  // Measurements
  const [measurements, setMeasurements] = useState<Record<string, string>>({});

  // Address (return delivery)
  const [address, setAddress] = useState({
    customerName: "", customerPhone: "", customerEmail: "",
    addressLine1: "", addressLine2: "", city: "", state: "", pincode: "",
  });

  const isCustomer = session?.user && (session.user as { role?: string }).role === "customer";

  useEffect(() => {
    if (session?.user) {
      setAddress((a) => ({
        ...a,
        customerName: a.customerName || session.user?.name || "",
        customerEmail: a.customerEmail || session.user?.email || "",
      }));
    }
  }, [session]);

  // Price calculation
  const baseSuitPrice = SUIT_TYPES.find((s) => s.value === suitType)?.price || 0;
  const neckPrice = NECK_STYLES.find((n) => n.name === neckStyle)?.price || 0;
  const sleevePrice = SLEEVE_STYLES.find((s) => s.name === sleeveStyle)?.price || 0;
  const extrasPrice = selectedExtras.reduce((sum, e) => sum + (EXTRAS.find((x) => x.name === e)?.price || 0), 0);
  const stitchingPrice = baseSuitPrice + neckPrice + sleevePrice + extrasPrice;
  const totalPrice = stitchingPrice; // FREE delivery

  const toggleExtra = (name: string) => {
    setSelectedExtras((prev) => prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]);
  };

  const filledMeasurements = Object.values(measurements).filter((v) => v.trim()).length;

  const handleContinue = (nextStep: Step) => {
    setStep(nextStep);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    update(); // Refresh session
  };

  const handleSubmit = async () => {
    if (!isCustomer) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/custom-stitching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...address,
          suitType, neckStyle, sleeveStyle,
          extras: selectedExtras, specialNotes,
          measurements: JSON.stringify(measurements),
          referenceImages,
          stitchingPrice,
          returnShipping: 0, // FREE
          paymentMethod: "UPI",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order");
      }

      const order = await res.json();
      setOrderPlaced(order.orderNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    setLoading(false);
  };

  // Success screen
  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-green-600" />
        </div>
        <h1 className="font-serif text-3xl text-luxury-dark mb-3">Order Placed!</h1>
        <p className="text-luxury-text mb-2">
          Your custom stitching order <strong className="text-luxury-dark">{orderPlaced}</strong> has been placed.
        </p>

        <div className="bg-pastel-cream border border-pastel-pink p-6 text-left mt-6 mb-6">
          <p className="text-sm font-medium text-luxury-dark mb-3 flex items-center gap-2">
            <Package size={16} className="text-accent" /> Next: Ship Your Fabric
          </p>

          <div className="space-y-3 text-sm text-luxury-text">
            <div className="flex gap-3">
              <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <p>Pack your fabric in a <strong>plastic bag first</strong>, then in a cardboard box or thick envelope. This protects from rain/damage.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <p>Write <strong>&quot;{orderPlaced}&quot;</strong> and your <strong>phone number</strong> on the parcel.</p>
            </div>
            <div className="flex gap-3">
              <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <div>
                <p>Courier to:</p>
                <p className="font-medium text-luxury-dark mt-1">
                  ਵਿਰਸਾ Style Boutique<br />
                  Shop No. 26, Ganpati Square<br />
                  Front of DMart, Barnala<br />
                  Punjab — 148101<br />
                  Ph: +91 8289012150
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-pastel-pink text-xs text-luxury-text/60 space-y-1">
            <p className="flex items-center gap-2"><Truck size={12} className="text-green-600" /> <strong className="text-green-700">Free return delivery</strong> — we ship your stitched outfit for free</p>
            <p>⏱ After we receive your fabric: <strong>2 days stitching + 2 days shipping = 4-5 days total</strong></p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/custom-stitching/track" className="btn-luxury">Track Order</Link>
          <Link href="/shop" className="btn-outline-luxury">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const steps: { key: Step; label: string; icon: typeof Scissors }[] = [
    { key: "design", label: "Design", icon: Scissors },
    { key: "measurements", label: "Measurements", icon: Ruler },
    { key: "shipping", label: "Ship Fabric", icon: Package },
    { key: "review", label: "Review & Pay", icon: CreditCard },
  ];

  return (
    <>
      {/* Auth Modal Popup */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-serif text-3xl text-luxury-dark mb-2">Custom Stitching Order</h1>
        <p className="text-sm text-luxury-text/60 mb-8">Send your own fabric — we stitch & deliver for free</p>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-10 overflow-x-auto">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <button
                onClick={() => {
                  if (s.key === "design") setStep("design");
                  if (s.key === "measurements" && suitType) handleContinue("measurements");
                  if (s.key === "shipping" && filledMeasurements >= 4) handleContinue("shipping");
                  if (s.key === "review" && address.customerName) handleContinue("review");
                }}
                className={`flex items-center gap-2 px-3 py-2 text-xs tracking-wider uppercase whitespace-nowrap ${
                  step === s.key ? "text-accent font-medium" : "text-luxury-text/40"
                }`}
              >
                <s.icon size={14} />
                {s.label}
              </button>
              {i < steps.length - 1 && <ChevronRight size={14} className="text-luxury-text/20 mx-1" />}
            </div>
          ))}
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 mb-6">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">

            {/* STEP 1: Design */}
            {step === "design" && (
              <div className="space-y-8">
                <div>
                  <p className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-3">Suit Type *</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SUIT_TYPES.map((suit) => (
                      <button key={suit.value} onClick={() => setSuitType(suit.value)}
                        className={`p-4 border text-left transition-colors ${suitType === suit.value ? "border-accent bg-accent/5" : "border-pastel-pink hover:border-accent/50"}`}>
                        <p className="text-sm text-luxury-dark font-medium">{suit.value}</p>
                        <p className="text-xs text-luxury-text/50 mt-1">From ₹{suit.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-3">Neck Style</p>
                  <div className="flex flex-wrap gap-2">
                    {NECK_STYLES.map((n) => (
                      <button key={n.name} onClick={() => setNeckStyle(n.name)}
                        className={`px-4 py-2.5 text-xs border transition-colors ${neckStyle === n.name ? "border-accent bg-accent text-white" : "border-pastel-rose text-luxury-text hover:border-accent"}`}>
                        {n.name}{n.price > 0 && <span className="ml-1 opacity-70">+₹{n.price}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-3">Sleeve Style</p>
                  <div className="flex flex-wrap gap-2">
                    {SLEEVE_STYLES.map((s) => (
                      <button key={s.name} onClick={() => setSleeveStyle(s.name)}
                        className={`px-4 py-2.5 text-xs border transition-colors ${sleeveStyle === s.name ? "border-accent bg-accent text-white" : "border-pastel-rose text-luxury-text hover:border-accent"}`}>
                        {s.name}{s.price > 0 && <span className="ml-1 opacity-70">+₹{s.price}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-3">Additional Options</p>
                  <div className="grid grid-cols-2 gap-3">
                    {EXTRAS.map((e) => (
                      <label key={e.name}
                        className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${selectedExtras.includes(e.name) ? "border-accent bg-accent/5" : "border-pastel-pink hover:border-accent/50"}`}>
                        <input type="checkbox" checked={selectedExtras.includes(e.name)} onChange={() => toggleExtra(e.name)} className="accent-accent" />
                        <div>
                          <p className="text-sm text-luxury-dark">{e.name}</p>
                          <p className="text-xs text-luxury-text/50">+₹{e.price}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-3">Special Instructions</p>
                  <textarea value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} rows={3}
                    placeholder="Any design notes, length preferences, or instructions for the tailor..."
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none" />
                </div>

                <div>
                  <p className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-3">
                    Reference Image <span className="text-luxury-text/40 normal-case">(optional — paste URL)</span>
                  </p>
                  <input type="text" placeholder="Paste image URL and press Enter"
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) { setReferenceImages([...referenceImages, val]); (e.target as HTMLInputElement).value = ""; }
                      }
                    }} />
                  {referenceImages.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {referenceImages.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 border border-pastel-pink">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => setReferenceImages(referenceImages.filter((_, j) => j !== i))}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => suitType && handleContinue("measurements")} disabled={!suitType}
                  className="btn-luxury w-full py-4 disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue to Measurements
                </button>
              </div>
            )}

            {/* STEP 2: Measurements */}
            {step === "measurements" && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Ruler size={18} className="text-accent" />
                  <p className="text-xs tracking-wider uppercase text-luxury-dark font-medium">Your Body Measurements (inches)</p>
                </div>

                <div className="bg-pastel-cream p-4 mb-6 text-xs text-luxury-text">
                  <p className="font-medium text-luxury-dark mb-1">Tips:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Use a measuring tape, not ruler</li>
                    <li>Measure over undergarments</li>
                    <li>Keep tape snug but not tight</li>
                    <li>Minimum 4 measurements needed</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {MEASUREMENT_FIELDS.map((field) => (
                    <div key={field.key}>
                      <label className="text-[10px] tracking-wider uppercase text-luxury-text/60 block mb-1">{field.label}</label>
                      <div className="relative">
                        <input type="text" value={measurements[field.key] || ""}
                          onChange={(e) => setMeasurements({ ...measurements, [field.key]: e.target.value.replace(/[^\d.]/g, "") })}
                          placeholder="e.g. 36" inputMode="decimal"
                          className="w-full border border-pastel-rose px-3 py-2.5 text-sm focus:outline-none focus:border-accent pr-14" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-luxury-text/30">inches</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep("design")} className="btn-outline-luxury">Back</button>
                  <button onClick={() => filledMeasurements >= 4 && handleContinue("shipping")} disabled={filledMeasurements < 4}
                    className="btn-luxury flex-1 py-4 disabled:opacity-40 disabled:cursor-not-allowed">
                    Continue ({filledMeasurements}/8 filled)
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Shipping Instructions + Return Address */}
            {step === "shipping" && (
              <div>
                {/* Packing & Shipping Instructions */}
                <div className="mb-8">
                  <p className="text-xs tracking-wider uppercase text-accent font-medium mb-4 flex items-center gap-2">
                    <Package size={16} /> How to Pack & Ship Your Fabric
                  </p>

                  <div className="border border-pastel-pink p-5 space-y-4">
                    <div className="flex gap-3">
                      <span className="w-7 h-7 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                      <div>
                        <p className="text-sm font-medium text-luxury-dark">Pack in plastic first</p>
                        <p className="text-xs text-luxury-text/60">Put your fabric in a <strong>plastic bag/wrap</strong> to protect from rain and water damage during transit.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-7 h-7 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                      <div>
                        <p className="text-sm font-medium text-luxury-dark">Use a box or thick envelope</p>
                        <p className="text-xs text-luxury-text/60">Place the plastic-wrapped fabric in a <strong>cardboard box or padded envelope</strong>. Don&apos;t use thin covers.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-7 h-7 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                      <div>
                        <p className="text-sm font-medium text-luxury-dark">Write order number on parcel</p>
                        <p className="text-xs text-luxury-text/60">Write your <strong>order number</strong> and <strong>phone number</strong> clearly on the outside of the parcel.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-7 h-7 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                      <div>
                        <p className="text-sm font-medium text-luxury-dark">Courier to our address</p>
                        <div className="bg-pastel-cream p-3 mt-2 text-sm">
                          <p className="font-medium text-luxury-dark">ਵਿਰਸਾ Style Boutique</p>
                          <p className="text-luxury-text">Shop No. 26, Ganpati Square</p>
                          <p className="text-luxury-text">Front of DMart, Barnala</p>
                          <p className="text-luxury-text">Punjab — 148101</p>
                          <p className="text-luxury-text">Ph: +91 8289012150</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-green-50 border border-green-200 p-4 mt-4">
                    <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                      <Truck size={16} /> Delivery Timeline
                    </p>
                    <div className="flex items-center gap-2 text-xs text-green-700 flex-wrap">
                      <span className="bg-green-100 px-2 py-1 rounded">You ship fabric</span>
                      <span>→</span>
                      <span className="bg-green-100 px-2 py-1 rounded">We receive (1-3 days)</span>
                      <span>→</span>
                      <span className="bg-green-100 px-2 py-1 rounded font-medium">Stitching (2 days)</span>
                      <span>→</span>
                      <span className="bg-green-100 px-2 py-1 rounded font-medium">Return shipping (2 days)</span>
                      <span>→</span>
                      <span className="bg-green-200 px-2 py-1 rounded font-bold">Delivered!</span>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      <strong>Total: ~4-5 working days</strong> after we receive your fabric. Return delivery is <strong>FREE</strong>.
                    </p>
                  </div>
                </div>

                {/* Return Address */}
                <div className="mb-6">
                  <p className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-accent" />
                    Your Return Address <span className="text-luxury-text/40 normal-case">(where we ship your stitched outfit — FREE delivery)</span>
                  </p>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] tracking-wider uppercase text-luxury-text/60 block mb-1">Full Name *</label>
                        <input type="text" value={address.customerName}
                          onChange={(e) => setAddress({ ...address, customerName: e.target.value })}
                          className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-wider uppercase text-luxury-text/60 block mb-1">Phone *</label>
                        <input type="tel" value={address.customerPhone}
                          onChange={(e) => setAddress({ ...address, customerPhone: e.target.value })}
                          className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] tracking-wider uppercase text-luxury-text/60 block mb-1">Email</label>
                      <input type="email" value={address.customerEmail}
                        onChange={(e) => setAddress({ ...address, customerEmail: e.target.value })}
                        className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" />
                    </div>
                    <input type="text" value={address.addressLine1} placeholder="Address Line 1 *"
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                      className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                    <input type="text" value={address.addressLine2} placeholder="Address Line 2 (optional)"
                      onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                      className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="text" value={address.city} placeholder="City *"
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                      <input type="text" value={address.state} placeholder="State *"
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                      <input type="text" value={address.pincode} placeholder="Pincode *"
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        className="border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent" required />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep("measurements")} className="btn-outline-luxury">Back</button>
                  <button
                    onClick={() => address.customerName && address.customerPhone && address.addressLine1 && address.city && address.state && address.pincode && setStep("review")}
                    disabled={!address.customerName || !address.customerPhone || !address.addressLine1 || !address.city || !address.pincode}
                    className="btn-luxury flex-1 py-4 disabled:opacity-40">
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Pay */}
            {step === "review" && (
              <div className="space-y-6">
                <div className="border border-pastel-pink p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs tracking-wider uppercase text-accent">Design</p>
                    <button onClick={() => setStep("design")} className="text-xs text-accent hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-luxury-text/50">Suit:</span> <span className="text-luxury-dark">{suitType}</span></div>
                    <div><span className="text-luxury-text/50">Neck:</span> <span className="text-luxury-dark">{neckStyle}</span></div>
                    <div><span className="text-luxury-text/50">Sleeve:</span> <span className="text-luxury-dark">{sleeveStyle}</span></div>
                    {selectedExtras.length > 0 && <div><span className="text-luxury-text/50">Extras:</span> <span className="text-luxury-dark">{selectedExtras.join(", ")}</span></div>}
                  </div>
                  {specialNotes && <p className="text-xs text-luxury-text/60 mt-2 border-t border-pastel-cream pt-2">Note: {specialNotes}</p>}
                </div>

                <div className="border border-pastel-pink p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs tracking-wider uppercase text-accent">Measurements</p>
                    <button onClick={() => setStep("measurements")} className="text-xs text-accent hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {Object.entries(measurements).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k}><span className="text-luxury-text/50 capitalize text-xs">{k.replace(/([A-Z])/g, " $1")}:</span> <span className="text-luxury-dark">{v}&quot;</span></div>
                    ))}
                  </div>
                </div>

                <div className="border border-pastel-pink p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs tracking-wider uppercase text-accent">Return Delivery (FREE)</p>
                    <button onClick={() => setStep("shipping")} className="text-xs text-accent hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-luxury-dark font-medium">{address.customerName}</p>
                  <p className="text-sm text-luxury-text">{address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}</p>
                  <p className="text-sm text-luxury-text">{address.city}, {address.state} — {address.pincode}</p>
                  <p className="text-sm text-luxury-text/60">Phone: {address.customerPhone}</p>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 text-sm text-green-700 flex items-center gap-3">
                  <Truck size={18} className="text-green-600 flex-shrink-0" />
                  <div>
                    <strong>Free return delivery</strong> — we ship your stitched outfit for free.
                    Estimated <strong>4-5 working days</strong> after we receive your fabric.
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 text-xs text-orange-700">
                  <p className="font-medium text-sm mb-1">Before you pay:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>After payment, courier your fabric to our shop (instructions on previous page)</li>
                    <li>Our tailor confirms everything on WhatsApp before cutting</li>
                    <li>Custom stitched orders are <strong>non-returnable</strong></li>
                    <li>Free alteration within 7 days if fitting issue</li>
                  </ul>
                </div>

                <button onClick={handleSubmit} disabled={loading}
                  className="btn-luxury w-full py-4 text-base disabled:opacity-50">
                  {loading ? "Placing Order..." : `Pay ₹${totalPrice.toLocaleString("en-IN")} & Place Order`}
                </button>
              </div>
            )}
          </div>

          {/* Price sidebar */}
          <div className="bg-white border border-pastel-pink p-6 h-fit sticky top-24">
            <h3 className="text-xs tracking-[0.3em] uppercase text-luxury-dark mb-6">Order Summary</h3>

            {suitType ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-luxury-text">
                  <span>{suitType}</span><span>₹{baseSuitPrice}</span>
                </div>
                {neckPrice > 0 && <div className="flex justify-between text-luxury-text"><span>{neckStyle}</span><span>+₹{neckPrice}</span></div>}
                {sleevePrice > 0 && <div className="flex justify-between text-luxury-text"><span>{sleeveStyle}</span><span>+₹{sleevePrice}</span></div>}
                {selectedExtras.map((e) => {
                  const p = EXTRAS.find((x) => x.name === e)?.price || 0;
                  return <div key={e} className="flex justify-between text-luxury-text"><span>{e}</span><span>+₹{p}</span></div>;
                })}
                <div className="border-t border-pastel-pink pt-3 flex justify-between text-luxury-dark">
                  <span>Stitching</span><span className="font-medium">₹{stitchingPrice}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Return Delivery</span><span className="font-medium">FREE</span>
                </div>
                <div className="border-t border-pastel-pink pt-3 flex justify-between text-lg text-luxury-dark font-medium">
                  <span>Total</span><span>₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-luxury-text/40">Select a suit type to see pricing</p>
            )}

            <div className="mt-6 pt-4 border-t border-pastel-pink text-[10px] text-luxury-text/40 space-y-1">
              <p>✓ Prepaid only (UPI / Card / Net Banking)</p>
              <p className="text-green-600 font-medium">✓ Free return delivery</p>
              <p>✓ ~4-5 days after we receive fabric</p>
              <p>✓ Free alteration within 7 days</p>
              <p>✓ Non-returnable (custom stitched)</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
