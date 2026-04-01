"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string };
}

export default function ReviewSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const isCustomer = session?.user && (session.user as { role?: string }).role === "customer";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews);
        setAverage(data.average);
        setTotal(data.total);
      });
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });

    setSubmitting(false);

    if (res.ok) {
      setShowForm(false);
      setComment("");
      // Refetch
      const data = await fetch(`/api/reviews?productId=${productId}`).then((r) => r.json());
      setReviews(data.reviews);
      setAverage(data.average);
      setTotal(data.total);
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  const StarRating = ({ value, interactive = false }: { value: number; interactive?: boolean }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={interactive ? 20 : 14}
            className={`${
              star <= (interactive ? hoverRating || rating : value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <section className="mt-16 border-t border-pastel-pink pt-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-2xl text-luxury-dark">Customer Reviews</h2>
          {total > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating value={average} />
              <span className="text-sm text-luxury-text">
                {average} out of 5 ({total} {total === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>
        {isCustomer && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn-outline-luxury text-xs">
            Write a Review
          </button>
        )}
        {!isCustomer && (
          <Link href="/login" className="text-xs text-accent hover:underline">
            Sign in to review
          </Link>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="border border-pastel-pink p-6 mb-8">
          <h3 className="text-sm font-medium text-luxury-dark mb-4">Your Review</h3>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="mb-4">
            <p className="text-xs text-luxury-text mb-2">Rating</p>
            <StarRating value={rating} interactive />
          </div>
          <div className="mb-4">
            <p className="text-xs text-luxury-text mb-2">Comment (optional)</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience with this product..."
              className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-luxury text-xs disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline-luxury text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {total === 0 && !showForm ? (
        <p className="text-sm text-luxury-text/60 text-center py-8">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-pastel-cream pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pastel-lavender rounded-full flex items-center justify-center text-xs font-medium text-accent">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-luxury-dark">{review.user.name}</p>
                    <p className="text-[10px] text-luxury-text/40">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} />
              </div>
              {review.comment && (
                <p className="text-sm text-luxury-text leading-relaxed ml-11">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
