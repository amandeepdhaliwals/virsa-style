"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  category: string;
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) setResults(await res.json());
      } catch {
        /* ignore */
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setResults([]);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-luxury-dark hover:text-accent transition-colors"
        aria-label="Search"
      >
        <Search size={20} />
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 border border-pastel-pink bg-white px-3 py-2">
        <Search size={16} className="text-luxury-text/40 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="text-sm text-luxury-dark bg-transparent outline-none w-32 lg:w-48"
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              close();
              window.location.href = `/shop?search=${encodeURIComponent(query)}`;
            }
            if (e.key === "Escape") close();
          }}
        />
        <button onClick={close} className="text-luxury-text/40 hover:text-accent">
          <X size={14} />
        </button>
      </div>

      {/* Dropdown Results */}
      {(results.length > 0 || loading || (query.length >= 2 && !loading)) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-pastel-pink shadow-lg z-50 max-h-80 overflow-y-auto min-w-[280px]">
          {loading && (
            <p className="text-xs text-luxury-text/50 p-4 text-center">Searching...</p>
          )}
          {!loading && results.length === 0 && query.length >= 2 && (
            <p className="text-xs text-luxury-text/50 p-4 text-center">No products found</p>
          )}
          {results.map((item) => (
            <Link
              key={item.id}
              href={`/shop/${item.slug}`}
              onClick={close}
              className="flex items-center gap-3 p-3 hover:bg-pastel-cream transition-colors border-b border-pastel-pink/50 last:border-0"
            >
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="w-12 h-14 object-cover bg-pastel-cream flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-wider uppercase text-accent">{item.category}</p>
                <p className="text-sm text-luxury-dark truncate">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-luxury-dark">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                  {item.comparePrice && (
                    <span className="text-xs text-luxury-text/40 line-through">
                      ₹{item.comparePrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {results.length > 0 && (
            <Link
              href={`/shop?search=${encodeURIComponent(query)}`}
              onClick={close}
              className="block text-center text-xs tracking-wider uppercase text-accent py-3 hover:bg-pastel-cream transition-colors"
            >
              View all results →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
