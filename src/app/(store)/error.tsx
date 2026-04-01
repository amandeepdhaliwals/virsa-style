"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-serif text-6xl text-pastel-rose mb-4">Oops</p>
        <h1 className="font-serif text-2xl text-luxury-dark mb-3">Something went wrong</h1>
        <p className="text-luxury-text/60 mb-8 max-w-md mx-auto text-sm">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={reset} className="btn-luxury">
            Try Again
          </button>
          <Link href="/" className="btn-outline-luxury">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
