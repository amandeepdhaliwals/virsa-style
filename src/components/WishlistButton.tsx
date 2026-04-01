"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import AuthModal from "./AuthModal";

export default function WishlistButton({
  productId,
  initialWishlisted = false,
  size = 18,
  className = "",
}: {
  productId: string;
  initialWishlisted?: boolean;
  size?: number;
  className?: string;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { data: session, update } = useSession();
  const isCustomer = session?.user && (session.user as { role?: string }).role === "customer";

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isCustomer) {
      setShowAuth(true);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    if (res.ok) {
      const data = await res.json();
      setWishlisted(data.wishlisted);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={toggle}
        disabled={loading}
        className={`transition-all duration-200 ${className}`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={size}
          className={`transition-colors ${
            wishlisted ? "fill-red-500 text-red-500" : "text-luxury-text/40 hover:text-red-400"
          }`}
        />
      </button>
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => { setShowAuth(false); update(); }}
      />
    </>
  );
}
