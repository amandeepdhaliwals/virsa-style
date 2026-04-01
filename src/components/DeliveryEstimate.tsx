"use client";

import { useState } from "react";
import { MapPin, Truck, RotateCcw, ShieldCheck } from "lucide-react";

export default function DeliveryEstimate() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<{
    available: boolean;
    days: number;
    cod: boolean;
    city?: string;
  } | null>(null);
  const [checked, setChecked] = useState(false);

  const checkDelivery = () => {
    if (pincode.length !== 6) return;
    setChecked(true);

    // Metro cities get faster delivery
    const metroPins = ["11", "40", "56", "60", "50", "70", "38", "30", "12", "20", "14", "16"];
    const prefix = pincode.substring(0, 2);
    const isMetro = metroPins.includes(prefix);

    // Punjab pincodes (14xxxx, 15xxxx, 16xxxx) - local delivery
    const isPunjab = ["14", "15", "16"].includes(prefix);

    if (isPunjab) {
      setResult({ available: true, days: 2, cod: true, city: "Punjab" });
    } else if (isMetro) {
      setResult({ available: true, days: 4, cod: true, city: "Metro City" });
    } else if (parseInt(pincode) >= 100000 && parseInt(pincode) <= 999999) {
      setResult({ available: true, days: 6, cod: true });
    } else {
      setResult({ available: false, days: 0, cod: false });
    }
  };

  const estimateDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div className="border-t border-pastel-pink pt-6 mt-6">
      <p className="text-xs tracking-[0.2em] uppercase text-luxury-text mb-3 flex items-center gap-2">
        <MapPin size={14} />
        Check Delivery
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={pincode}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 6);
            setPincode(v);
            setChecked(false);
            setResult(null);
          }}
          placeholder="Enter Pincode"
          maxLength={6}
          className="flex-1 border border-pastel-rose px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
        />
        <button
          onClick={checkDelivery}
          disabled={pincode.length !== 6}
          className="px-5 py-2.5 bg-accent text-white text-xs tracking-wider uppercase hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check
        </button>
      </div>

      {checked && result && (
        <div className="mt-4 space-y-2.5">
          {result.available ? (
            <>
              <div className="flex items-center gap-3 text-sm text-luxury-dark">
                <Truck size={16} className="text-green-600 flex-shrink-0" />
                <span>
                  Delivery by <strong>{estimateDate(result.days)}</strong>
                  {result.city && <span className="text-luxury-text/50 ml-1">({result.city})</span>}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-text">
                <ShieldCheck size={16} className="text-accent flex-shrink-0" />
                Prepaid only · International cards accepted
              </div>
              <div className="flex items-center gap-3 text-sm text-luxury-text">
                <RotateCcw size={16} className="text-accent flex-shrink-0" />
                7-day easy returns
              </div>
            </>
          ) : (
            <p className="text-sm text-red-500">Sorry, delivery is not available to this pincode.</p>
          )}
        </div>
      )}
    </div>
  );
}
