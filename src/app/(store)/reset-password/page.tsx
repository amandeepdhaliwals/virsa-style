"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="font-serif text-2xl text-luxury-dark mb-3">Invalid Link</h1>
          <p className="text-sm text-luxury-text mb-6">This reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="btn-luxury inline-block">Request New Link</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
        <div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
          <h1 className="font-serif text-2xl text-luxury-dark mb-3">Password Reset!</h1>
          <p className="text-sm text-luxury-text mb-6">Your password has been updated. You can now sign in.</p>
          <Link href="/login" className="btn-luxury inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Account Recovery</p>
          <h1 className="font-serif text-3xl text-luxury-dark">Set New Password</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-4">{error}</p>}
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white"
              placeholder="Min. 6 characters" required />
          </div>
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white"
              placeholder="Re-enter password" required />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-luxury py-4 disabled:opacity-50">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><p className="text-sm text-luxury-text">Loading...</p></div>}>
      <ResetForm />
    </Suspense>
  );
}
