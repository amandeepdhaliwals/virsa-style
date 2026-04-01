"use client";

import { useState, useEffect } from "react";
import { Scissors, ChevronDown, ChevronUp } from "lucide-react";

interface StitchingOption {
  id: string;
  category: string;
  name: string;
  price: number;
  isDefault: boolean;
}

interface Props {
  productId: string;
  baseStitchingPrice: number;
  onStitchingChange: (data: {
    wantStitching: boolean;
    stitchingPrice: number;
    customizations: Record<string, string>;
  }) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  NECK: "Neck Style",
  SLEEVE: "Sleeve Style",
  BOTTOM: "Bottom Style",
  EXTRA: "Additional Options",
};

export default function StitchingCustomizer({ productId, baseStitchingPrice, onStitchingChange }: Props) {
  const [wantStitching, setWantStitching] = useState(false);
  const [options, setOptions] = useState<StitchingOption[]>([]);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (wantStitching && options.length === 0) {
      fetch(`/api/stitching-options?productId=${productId}`)
        .then((r) => r.json())
        .then((data) => {
          setOptions(data);
          // Pre-select defaults
          const defaults: Record<string, string> = {};
          data.forEach((opt: StitchingOption) => {
            if (opt.isDefault && !defaults[opt.category]) {
              defaults[opt.category] = opt.id;
            }
          });
          setSelected(defaults);
        })
        .catch(() => {});
    }
  }, [wantStitching, productId]);

  // Calculate total stitching price
  useEffect(() => {
    if (!wantStitching) {
      onStitchingChange({ wantStitching: false, stitchingPrice: 0, customizations: {} });
      return;
    }

    let addOnPrice = 0;
    const customizations: Record<string, string> = {};

    Object.entries(selected).forEach(([category, optionId]) => {
      const opt = options.find((o) => o.id === optionId);
      if (opt) {
        addOnPrice += opt.price;
        customizations[category] = opt.name;
      }
    });

    onStitchingChange({
      wantStitching: true,
      stitchingPrice: baseStitchingPrice + addOnPrice,
      customizations,
    });
  }, [wantStitching, selected, options, baseStitchingPrice]);

  // Group options by category
  const grouped = options.reduce<Record<string, StitchingOption[]>>((acc, opt) => {
    if (!acc[opt.category]) acc[opt.category] = [];
    acc[opt.category].push(opt);
    return acc;
  }, {});

  const totalAddOn = Object.values(selected).reduce((sum, optId) => {
    const opt = options.find((o) => o.id === optId);
    return sum + (opt?.price || 0);
  }, 0);

  return (
    <div className="border border-pastel-pink mt-6">
      {/* Toggle: Unstitched vs With Stitching */}
      <div className="grid grid-cols-2">
        <button
          onClick={() => setWantStitching(false)}
          className={`py-4 text-sm tracking-wider uppercase text-center transition-colors ${
            !wantStitching
              ? "bg-accent text-white"
              : "bg-pastel-cream text-luxury-text hover:bg-pastel-pink"
          }`}
        >
          Unstitched
        </button>
        <button
          onClick={() => setWantStitching(true)}
          className={`py-4 text-sm tracking-wider uppercase text-center transition-colors flex items-center justify-center gap-2 ${
            wantStitching
              ? "bg-accent text-white"
              : "bg-pastel-cream text-luxury-text hover:bg-pastel-pink"
          }`}
        >
          <Scissors size={14} />
          With Stitching
        </button>
      </div>

      {wantStitching && (
        <div className="p-5">
          {/* Stitching price summary */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-xs tracking-wider uppercase text-luxury-dark font-medium"
            >
              Customize Your Design
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <div className="text-right">
              <p className="text-xs text-luxury-text/50">Stitching Charge</p>
              <p className="text-sm font-medium text-luxury-dark">
                ₹{(baseStitchingPrice + totalAddOn).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {expanded && (
            <div className="space-y-5">
              {Object.entries(grouped).map(([category, opts]) => (
                <div key={category}>
                  <p className="text-xs tracking-[0.15em] uppercase text-luxury-text mb-2">
                    {CATEGORY_LABELS[category] || category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {opts.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelected({ ...selected, [category]: opt.id })}
                        className={`px-4 py-2.5 text-xs border transition-colors ${
                          selected[category] === opt.id
                            ? "border-accent bg-accent text-white"
                            : "border-pastel-rose text-luxury-text hover:border-accent"
                        }`}
                      >
                        {opt.name}
                        {opt.price > 0 && (
                          <span className="ml-1 opacity-70">+₹{opt.price}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(grouped).length === 0 && (
                <p className="text-xs text-luxury-text/50 text-center py-4">
                  Loading customization options...
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
