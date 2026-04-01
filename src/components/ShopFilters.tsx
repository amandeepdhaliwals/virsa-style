"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface Props {
  categories: { name: string; slug: string }[];
  currentCategory?: string;
  currentSort?: string;
  allSizes?: string[];
  allColors?: string[];
  currentSize?: string;
  currentColor?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

export default function ShopFilters({
  categories,
  currentCategory,
  currentSort,
  allSizes = [],
  allColors = [],
  currentSize,
  currentColor,
  currentMinPrice,
  currentMaxPrice,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => router.push("/shop");

  const hasFilters = currentCategory || currentSize || currentColor || currentMinPrice || currentMaxPrice;
  const activeFilterCount = [currentSize, currentColor, currentMinPrice, currentMaxPrice].filter(Boolean).length;

  // Group categories: Suits vs Footwear vs Other
  const suitCategories = categories.filter((c) =>
    ["punjabi-salwar-suit", "pant-plazo-suit", "straight-plazo-suit", "sharara-suit", "gharara-suit", "pajami-suit"].includes(c.slug)
  );
  const footwearCategories = categories.filter((c) =>
    ["punjabi-jutti", "boots", "chappals"].includes(c.slug)
  );
  const otherCategories = categories.filter((c) =>
    !suitCategories.includes(c) && !footwearCategories.includes(c)
  );

  const currentCategoryName = categories.find((c) => c.slug === currentCategory)?.name;

  return (
    <div>
      {/* Top bar — compact */}
      <div className="flex items-center justify-between gap-3 border-b border-pastel-pink pb-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Category dropdown (mobile & desktop) */}
          <div className="relative">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className={`flex items-center gap-2 text-xs tracking-wider uppercase px-4 py-2.5 transition-colors border ${
                currentCategory
                  ? "border-accent bg-accent/5 text-accent"
                  : "border-pastel-pink bg-white text-luxury-text hover:border-accent/50"
              }`}
            >
              {currentCategoryName || "All Categories"}
              <ChevronDown size={12} className={`transition-transform ${showCategories ? "rotate-180" : ""}`} />
            </button>

            {/* Category dropdown menu */}
            {showCategories && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowCategories(false)} />
                <div className="absolute top-full left-0 mt-1 bg-white border border-pastel-pink shadow-xl z-40 w-64 max-h-[70vh] overflow-y-auto">
                  {/* All */}
                  <button
                    onClick={() => { updateFilter("category", ""); setShowCategories(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-pastel-cream ${
                      !currentCategory ? "bg-accent/5 text-accent font-medium" : "text-luxury-text hover:bg-pastel-cream"
                    }`}
                  >
                    All Products
                  </button>

                  {/* Suits group */}
                  {suitCategories.length > 0 && (
                    <div>
                      <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase text-luxury-text/40 font-medium">Suits</p>
                      {suitCategories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => { updateFilter("category", cat.slug); setShowCategories(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            currentCategory === cat.slug ? "bg-accent/5 text-accent font-medium" : "text-luxury-text hover:bg-pastel-cream"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Footwear group */}
                  {footwearCategories.length > 0 && (
                    <div className="border-t border-pastel-cream">
                      <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase text-luxury-text/40 font-medium">Footwear</p>
                      {footwearCategories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => { updateFilter("category", cat.slug); setShowCategories(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            currentCategory === cat.slug ? "bg-accent/5 text-accent font-medium" : "text-luxury-text hover:bg-pastel-cream"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Other */}
                  {otherCategories.length > 0 && (
                    <div className="border-t border-pastel-cream">
                      <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase text-luxury-text/40 font-medium">More</p>
                      {otherCategories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => { updateFilter("category", cat.slug); setShowCategories(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            currentCategory === cat.slug ? "bg-accent/5 text-accent font-medium" : "text-luxury-text hover:bg-pastel-cream"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Active filter tags */}
          {hasFilters && (
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {currentCategory && (
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 flex items-center gap-1">
                  {currentCategoryName}
                  <button onClick={() => updateFilter("category", "")}><X size={10} /></button>
                </span>
              )}
              {currentSize && (
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 flex items-center gap-1">
                  Size: {currentSize}
                  <button onClick={() => updateFilter("size", "")}><X size={10} /></button>
                </span>
              )}
              {currentColor && (
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 flex items-center gap-1">
                  {currentColor}
                  <button onClick={() => updateFilter("color", "")}><X size={10} /></button>
                </span>
              )}
              {(currentMinPrice || currentMaxPrice) && (
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-1 flex items-center gap-1">
                  ₹{currentMinPrice || "0"} - ₹{currentMaxPrice || "∞"}
                  <button onClick={() => { updateFilter("minPrice", ""); updateFilter("maxPrice", ""); }}><X size={10} /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-[10px] text-luxury-text/40 hover:text-accent underline">Clear all</button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 text-xs tracking-wider uppercase px-4 py-2.5 transition-colors border ${
              showFilters
                ? "border-accent bg-accent text-white"
                : "border-pastel-pink bg-white text-luxury-text hover:border-accent/50"
            }`}
          >
            <SlidersHorizontal size={13} />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-accent text-white text-[9px] rounded-full flex items-center justify-center -mr-1">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <select
            value={currentSort || ""}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="text-xs tracking-wider uppercase border border-pastel-pink bg-white px-3 py-2.5 text-luxury-text focus:outline-none focus:border-accent appearance-none pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C48B9F' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
          >
            <option value="">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="name">A-Z</option>
          </select>
        </div>
      </div>

      {/* Expanded filters panel */}
      {showFilters && (
        <div className="bg-white border-b border-pastel-pink py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Price Range */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-text/50 mb-3 font-medium">Price Range (₹)</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={currentMinPrice || ""}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="w-full border border-pastel-rose px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
                <span className="text-luxury-text/20">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={currentMaxPrice || ""}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="w-full border border-pastel-rose px-3 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Size */}
            {allSizes.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-text/50 mb-3 font-medium">Size</p>
                <div className="flex flex-wrap gap-1.5">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateFilter("size", currentSize === size ? "" : size)}
                      className={`min-w-[36px] h-9 px-2 text-xs border transition-colors ${
                        currentSize === size
                          ? "border-accent bg-accent text-white"
                          : "border-pastel-rose text-luxury-text hover:border-accent"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {allColors.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-luxury-text/50 mb-3 font-medium">Color</p>
                <div className="flex flex-wrap gap-1.5">
                  {allColors.slice(0, 12).map((color) => (
                    <button
                      key={color}
                      onClick={() => updateFilter("color", currentColor === color ? "" : color)}
                      className={`px-3 py-1.5 text-[11px] border transition-colors ${
                        currentColor === color
                          ? "border-accent bg-accent text-white"
                          : "border-pastel-rose text-luxury-text hover:border-accent"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear */}
          {hasFilters && (
            <button onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-accent hover:underline mt-4">
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
