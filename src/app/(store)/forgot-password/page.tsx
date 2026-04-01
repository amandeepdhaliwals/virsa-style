"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-pastel-cream rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">📧</div>
          <h1 className="font-serif text-2xl text-luxury-dark mb-3">Check Your Email</h1>
          <p className="text-sm text-luxury-text mb-6">
            If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link. Check your inbox and spam folder.
          </p>
          <Link href="/login" className="text-sm text-accent hover:underline">Back to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Account Recovery</p>
          <h1 className="font-serif text-3xl text-luxury-dark">Forgot Password</h1>
          <p className="text-sm text-luxury-text mt-2">Enter your email to receive a reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-4">{error}</p>}
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white"
              placeholder="your@email.com"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-luxury py-4 disabled:opacity-50">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-luxury-text mt-6">
          Remember your password? <Link href="/login" className="text-accent hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
