"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("admin-login", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-cream via-pastel-pink to-pastel-lavender flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-10 shadow-xl">
        <div className="text-center mb-8">
          <span className="font-serif text-2xl tracking-[0.2em] text-luxury-dark">
            VIRSA
          </span>
          <span className="text-[9px] tracking-[0.4em] uppercase text-accent block -mt-1">
            Admin Panel
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-4">
              {error}
            </p>
          )}

          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-luxury-light"
              required
            />
          </div>

          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-luxury-light"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-luxury py-4 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Quick fill for dev */}
        <button
          onClick={() => { setEmail("admin@virsastyle.com"); setPassword("admin123"); }}
          className="w-full mt-4 text-[10px] text-luxury-text/30 hover:text-accent py-2 transition-colors"
        >
          Fill Admin Credentials
        </button>
      </div>
    </div>
  );
}
