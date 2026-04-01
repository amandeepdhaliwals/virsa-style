"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice: number | null;
    images: string[];
    category: { name: string };
  };
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isCustomer = session?.user && (session.user as { role?: string }).role === "customer";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (isCustomer) {
      fetch("/api/wishlist")
        .then((r) => r.json())
        .then(setItems)
        .finally(() => setLoading(false));
    }
  }, [isCustomer]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-luxury-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Saved Items</p>
        <h1 className="font-serif text-3xl text-luxury-dark">My Wishlist</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="mx-auto text-pastel-rose mb-4" />
          <p className="text-luxury-text mb-4">Your wishlist is empty</p>
          <Link href="/shop" className="btn-luxury inline-block">Explore Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              id={item.product.id}
              name={item.product.name}
              slug={item.product.slug}
              price={item.product.price}
              comparePrice={item.product.comparePrice}
              image={item.product.images[0] || ""}
              category={item.product.category.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
