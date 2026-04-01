"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    if (password.length < 6) errs.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error });
        setLoading(false);
        return;
      }

      const result = await signIn("customer-login", {
        email,
        password,
        redirect: false,
      });

      setLoading(false);

      if (result?.error) {
        setErrors({ form: "Account created but login failed. Please sign in manually." });
      } else {
        router.push("/verify-email");
      }
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
      setLoading(false);
    }
  };

  // Password strength
  const passStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Good", "Strong"];
  const strengthColors = ["", "bg-red-400", "bg-yellow-400", "bg-green-500"];

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left Side — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="text-center mb-2 lg:hidden">
            <span className="flex items-baseline gap-1.5">
              <span className="text-2xl text-luxury-dark leading-none" style={{ fontFamily: "'Gurmukhi', sans-serif", fontWeight: 600 }}>ਵਿਰਸਾ</span>
              <span className="text-lg text-accent leading-none" style={{ fontFamily: "'PlayfairItalic', serif", fontStyle: "italic" }}>Style</span>
            </span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-3">Join Us</p>
            <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">Create Account</h1>
            <p className="text-sm text-luxury-text/50 mt-2">
              Join ਵਿਰਸਾ Style for exclusive offers & easy ordering
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="flex items-center gap-3 text-red-600 text-sm bg-red-50 border border-red-100 py-3 px-4">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.form}
              </div>
            )}

            {/* Name & Phone side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-luxury-text/70 block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-3 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-luxury-text/70 block mb-2">
                  Phone <span className="text-luxury-text/30 normal-case tracking-normal">(optional)</span>
                </label>
                <div className="flex items-center border-b-2 border-pastel-rose focus-within:border-accent transition-colors">
                  <select
                    value={phone.startsWith("+") ? phone.split(" ")[0] : "+91"}
                    onChange={(e) => {
                      const num = phone.replace(/^\+\d+\s?/, "");
                      setPhone(`${e.target.value} ${num}`);
                    }}
                    className="bg-transparent text-sm text-luxury-dark py-3 pr-1 focus:outline-none appearance-none"
                    style={{ width: "70px" }}
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇨🇦 +1</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+64">🇳🇿 +64</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+65">🇸🇬 +65</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+49">🇩🇪 +49</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+965">🇰🇼 +965</option>
                    <option value="+974">🇶🇦 +974</option>
                  </select>
                  <input
                    type="tel"
                    value={phone.replace(/^\+\d+\s?/, "")}
                    onChange={(e) => {
                      const code = phone.startsWith("+") ? phone.split(" ")[0] : "+91";
                      setPhone(`${code} ${e.target.value.replace(/[^\d]/g, "")}`);
                    }}
                    className="flex-1 bg-transparent px-0 py-3 text-sm text-luxury-dark focus:outline-none placeholder:text-luxury-text/30"
                    placeholder="XXXXX XXXXX"
                  />
                </div>
              </div>
            </div>

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
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-luxury-text/70 block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-3 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30 pr-10"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-luxury-text/30 hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passStrength >= level ? strengthColors[passStrength] : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] tracking-wider ${
                    passStrength <= 1 ? "text-red-400" : passStrength === 2 ? "text-yellow-600" : "text-green-600"
                  }`}>
                    {strengthLabels[passStrength]}
                  </span>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-luxury-text/70 block mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-3 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30 pr-10"
                  placeholder="Re-enter password"
                />
                {confirmPassword && password === confirmPassword && (
                  <Check size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[11px] mt-1">{errors.confirmPassword}</p>
              )}
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
                  Creating Account...
                </span>
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
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
                Already a member?
              </span>
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full text-center border-2 border-pastel-pink text-luxury-text py-3.5 text-sm tracking-[0.15em] uppercase hover:border-accent hover:text-accent transition-all duration-300"
          >
            Sign In
          </Link>

          <p className="text-center text-[10px] text-luxury-text/30 mt-6 tracking-wider leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-accent">Terms of Service</Link> and{" "}
            <Link href="/privacy-policy" className="underline hover:text-accent">Privacy Policy</Link>
          </p>
        </div>
      </div>

      {/* Right Side — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-luxury-dark">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&h=1400&fit=crop"
          alt="Fashion"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark via-luxury-dark/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <h2 className="font-serif text-3xl text-white mb-4">
            Join the ਵਿਰਸਾ Style Family
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-md mb-8">
            Create your account to unlock exclusive member benefits, track your orders,
            save your favorites, and get early access to new collections.
          </p>

          {/* Benefits */}
          <div className="space-y-3">
            {[
              "Exclusive member-only offers & discounts",
              "Save addresses for faster checkout",
              "Track orders & manage returns easily",
              "Build your personal wishlist",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-accent-light" />
                </div>
                <span className="text-white/50 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
