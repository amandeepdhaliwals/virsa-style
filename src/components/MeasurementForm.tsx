"use client";

import { useState } from "react";
import { Ruler, Info } from "lucide-react";

interface Props {
  onMeasurementsChange: (measurements: Record<string, string>) => void;
}

const MEASUREMENT_FIELDS = [
  { key: "bust", label: "Bust / Chest", placeholder: "e.g. 36", hint: "Around the fullest part" },
  { key: "waist", label: "Waist", placeholder: "e.g. 30", hint: "Around the narrowest part" },
  { key: "hip", label: "Hip", placeholder: "e.g. 38", hint: "Around the widest part" },
  { key: "shoulder", label: "Shoulder", placeholder: "e.g. 14", hint: "Shoulder to shoulder" },
  { key: "armLength", label: "Arm Length", placeholder: "e.g. 22", hint: "Shoulder to wrist" },
  { key: "kameezLength", label: "Kameez Length", placeholder: "e.g. 42", hint: "Shoulder to desired length" },
  { key: "bottomLength", label: "Bottom Length", placeholder: "e.g. 40", hint: "Waist to ankle" },
  { key: "armhole", label: "Armhole", placeholder: "e.g. 18", hint: "Around armhole" },
];

export default function MeasurementForm({ onMeasurementsChange }: Props) {
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [showGuide, setShowGuide] = useState(false);

  const handleChange = (key: string, value: string) => {
    // Only allow numbers and decimal point
    const cleaned = value.replace(/[^\d.]/g, "");
    const updated = { ...measurements, [key]: cleaned };
    setMeasurements(updated);
    onMeasurementsChange(updated);
  };

  const filledCount = Object.values(measurements).filter((v) => v.trim()).length;

  return (
    <div className="border border-pastel-pink p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ruler size={16} className="text-accent" />
          <p className="text-xs tracking-[0.15em] uppercase text-luxury-dark font-medium">
            Your Measurements
          </p>
          <span className="text-[10px] text-luxury-text/40">
            ({filledCount}/{MEASUREMENT_FIELDS.length} filled)
          </span>
        </div>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-1 text-[10px] text-accent hover:underline"
        >
          <Info size={12} />
          How to measure
        </button>
      </div>

      {showGuide && (
        <div className="bg-pastel-cream p-4 mb-4 text-xs text-luxury-text leading-relaxed">
          <p className="font-medium text-luxury-dark mb-2">Measurement Tips:</p>
          <ul className="space-y-1 list-disc pl-4">
            <li>Use a measuring tape (not a ruler)</li>
            <li>All measurements in <strong>inches</strong></li>
            <li>Measure over undergarments, not over thick clothes</li>
            <li>Keep tape snug but not tight</li>
            <li>Stand straight with arms relaxed at sides</li>
          </ul>
          <p className="mt-2 text-accent">
            Not sure? You can also share measurements via WhatsApp after ordering.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {MEASUREMENT_FIELDS.map((field) => (
          <div key={field.key}>
            <label className="text-[10px] tracking-wider uppercase text-luxury-text/60 block mb-1">
              {field.label}
            </label>
            <div className="relative">
              <input
                type="text"
                value={measurements[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full border border-pastel-rose px-3 py-2.5 text-sm focus:outline-none focus:border-accent pr-12"
                inputMode="decimal"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-luxury-text/30">
                inches
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-luxury-text/40 mt-3 leading-relaxed">
        You can fill measurements now or share them on WhatsApp after placing your order. Our tailor will confirm measurements before stitching.
      </p>
    </div>
  );
}
