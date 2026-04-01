"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  image: string;
  category?: string;
  stock?: number;
  createdAt?: string;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  image,
  category,
  stock,
  createdAt,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, price, image, quantity: 1, slug });
  };

  const discount = comparePrice
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  const isNew = createdAt
    ? (Date.now() - new Date(createdAt).getTime()) < 14 * 24 * 60 * 60 * 1000
    : false;

  const lowStock = stock !== undefined && stock > 0 && stock <= 10;

  return (
    <Link href={`/shop/${slug}`} className="group product-card block">
      <div className="relative overflow-hidden bg-pastel-cream aspect-[3/4]">
        <img
          src={image || "/placeholder.jpg"}
          alt={name}
          className="product-image w-full h-full object-cover"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="bg-accent text-white text-[10px] tracking-wider uppercase px-2.5 py-0.5">
              {discount}% Off
            </span>
          )}
          {isNew && !discount && (
            <span className="bg-green-600 text-white text-[10px] tracking-wider uppercase px-2.5 py-0.5">
              New
            </span>
          )}
        </div>

        {/* Low stock badge */}
        {lowStock && (
          <span className="absolute bottom-12 left-3 bg-orange-500 text-white text-[9px] tracking-wider uppercase px-2 py-0.5 z-10 group-hover:bottom-16 transition-all">
            Only {stock} left!
          </span>
        )}

        <WishlistButton
          productId={id}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          size={18}
        />
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-0 left-0 right-0 bg-luxury-dark/90 text-white py-3 text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <ShoppingBag size={14} />
          Quick Add
        </button>
      </div>
      <div className="pt-4 pb-2">
        {category && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-accent mb-1">
            {category}
          </p>
        )}
        <h3 className="text-sm font-medium text-luxury-dark group-hover:text-accent transition-colors line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium text-luxury-dark">
            ₹{price.toLocaleString("en-IN")}
          </span>
          {comparePrice && (
            <span className="text-xs text-luxury-text/50 line-through">
              ₹{comparePrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
