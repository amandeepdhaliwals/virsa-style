"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import AuthModal from "@/components/AuthModal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("customer-login", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push(redirectTo);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left Side — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-luxury-dark">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1000&h=1400&fit=crop"
          alt="Fashion"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-luxury-dark/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="mb-6">
            <span className="flex items-baseline gap-2">
              <span className="text-4xl text-white leading-none" style={{ fontFamily: "'Gurmukhi', sans-serif", fontWeight: 600 }}>ਵਿਰਸਾ</span>
              <span className="text-2xl text-accent-light leading-none" style={{ fontFamily: "'PlayfairItalic', serif", fontStyle: "italic" }}>Style</span>
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-md">
            Welcome back to your style destination. Sign in to access your wishlist,
            track orders, and enjoy a personalized shopping experience.
          </p>
          <div className="flex items-center gap-8 mt-8 text-white/40 text-xs tracking-wider">
            <span>Premium Quality</span>
            <span className="w-1 h-1 bg-accent-light rounded-full" />
            <span>Pan-India Delivery</span>
            <span className="w-1 h-1 bg-accent-light rounded-full" />
            <span>Easy Returns</span>
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="text-center mb-2 lg:hidden flex justify-center">
            <span className="flex items-baseline gap-1.5">
              <span className="text-2xl text-luxury-dark leading-none" style={{ fontFamily: "'Gurmukhi', sans-serif", fontWeight: 600 }}>ਵਿਰਸਾ</span>
              <span className="text-lg text-accent leading-none" style={{ fontFamily: "'PlayfairItalic', serif", fontStyle: "italic" }}>Style</span>
            </span>
          </div>

          <div className="text-center lg:text-left mb-10">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-3">Welcome Back</p>
            <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">Sign In</h1>
            <p className="text-sm text-luxury-text/50 mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 border border-red-100 py-3 px-4">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-luxury-text/70 block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-3 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs tracking-[0.2em] uppercase text-luxury-text/70">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[10px] tracking-wider text-accent hover:text-accent-dark transition-colors">
                  FORGOT?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-3 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-luxury-text/30 hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-dark text-white py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-accent transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pastel-pink" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-[10px] tracking-[0.3em] uppercase text-luxury-text/30">
                New Here?
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="block w-full text-center border-2 border-pastel-pink text-luxury-text py-3.5 text-sm tracking-[0.15em] uppercase hover:border-accent hover:text-accent transition-all duration-300"
          >
            Create Account
          </button>

          <p className="text-center text-[10px] text-luxury-text/30 mt-8 tracking-wider">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-accent">Terms</Link> &{" "}
            <Link href="/privacy-policy" className="underline hover:text-accent">Privacy Policy</Link>
          </p>

          {/* Register Modal Popup */}
          <AuthModal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            onSuccess={() => { setShowRegisterModal(false); router.push(redirectTo); }}
            defaultMode="register"
          />
        </div>
      </div>
    </div>
  );
}
