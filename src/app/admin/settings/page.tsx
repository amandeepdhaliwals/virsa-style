"use client";

import { useState, useEffect } from "react";
import { Save, Store, Truck, Check } from "lucide-react";

interface Settings {
  storeName: string;
  storeTagline: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  businessHours: string;
  domesticFreeShippingAbove: number;
  domesticShippingRate: number;
  internationalFreeShippingAbove: number;
  internationalShippingRate: number;
  whatsappNumber: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!settings) return <p className="p-8 text-gray-500">Loading...</p>;

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400";
  const labelClass = "text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Store Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your store configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors ${
            saved ? "bg-green-600 text-white" : "bg-gray-800 text-white hover:bg-gray-700"
          } disabled:opacity-50`}
        >
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> {saving ? "Saving..." : "Save Changes"}</>}
        </button>
      </div>

      <div className="space-y-6">
        {/* Store Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">
            <Store size={16} /> Store Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Store Name</label>
              <input type="text" value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input type="text" value={settings.storeTagline} onChange={(e) => setSettings({ ...settings, storeTagline: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" value={settings.storePhone} onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={settings.storeEmail} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address</label>
              <input type="text" value={settings.storeAddress} onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Business Hours</label>
              <input type="text" value={settings.businessHours} onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp Number (with country code, no +)</label>
              <input type="text" value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} className={inputClass} placeholder="918289012150" />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider mb-5">
            <Truck size={16} /> Shipping Rates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-xs font-bold text-green-700 uppercase mb-3">India (Domestic)</p>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Free Shipping Above (₹)</label>
                  <input type="number" value={settings.domesticFreeShippingAbove}
                    onChange={(e) => setSettings({ ...settings, domesticFreeShippingAbove: Number(e.target.value) })}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Shipping Rate (₹) — below threshold</label>
                  <input type="number" value={settings.domesticShippingRate}
                    onChange={(e) => setSettings({ ...settings, domesticShippingRate: Number(e.target.value) })}
                    className={inputClass} />
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs font-bold text-blue-700 uppercase mb-3">International</p>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Free Shipping Above (₹)</label>
                  <input type="number" value={settings.internationalFreeShippingAbove}
                    onChange={(e) => setSettings({ ...settings, internationalFreeShippingAbove: Number(e.target.value) })}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Shipping Rate (₹) — below threshold</label>
                  <input type="number" value={settings.internationalShippingRate}
                    onChange={(e) => setSettings({ ...settings, internationalShippingRate: Number(e.target.value) })}
                    className={inputClass} />
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Changes take effect immediately after saving. Shipping rates apply to new orders only.</p>
        </div>

        {/* Env variables info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Other Settings (require .env file edit)</h3>
          <p className="text-xs text-yellow-700 mb-2">These settings require editing the <code className="bg-yellow-100 px-1 rounded">.env</code> file and restarting the server:</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
            <li>Razorpay keys (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)</li>
            <li>Email SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS)</li>
            <li>Google Analytics (NEXT_PUBLIC_GA_ID)</li>
            <li>Cloudinary image upload (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
