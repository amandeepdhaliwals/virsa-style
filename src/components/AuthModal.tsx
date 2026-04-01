"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { X, Eye, EyeOff, ArrowRight, Check } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultMode?: "login" | "register";
}

type Mode = "login" | "register";

export default function AuthModal({ isOpen, onClose, onSuccess, defaultMode = "login" }: Props) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("customer-login", {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      onSuccess();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (regPassword !== regConfirm) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, phone: regPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto-login
      const result = await signIn("customer-login", {
        email: regEmail,
        password: regPassword,
        redirect: false,
      });

      setLoading(false);

      if (result?.error) {
        setError("Account created! Please close and try logging in.");
      } else {
        // Redirect to email verification
        window.location.href = "/verify-email";
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — stop all clicks from bubbling to parent Link */}
      <div className="relative bg-white w-full max-w-md max-h-[90vh] overflow-y-auto z-10"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-luxury-text/40 hover:text-luxury-dark transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex items-baseline gap-1 justify-center">
              <span className="text-[26px] text-luxury-dark leading-none tracking-wide" style={{ fontFamily: "'Gurmukhi', sans-serif", fontWeight: 600 }}>ਵਿਰਸਾ</span>
              <span className="text-[22px] text-accent leading-none" style={{ fontFamily: "'PlayfairItalic', serif", fontStyle: "italic" }}>Style</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl text-luxury-dark">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-xs text-luxury-text/50 mt-1">
              {mode === "login"
                ? "Sign in to continue your order"
                : "Quick registration to place your order"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-luxury-text/70 block mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-3 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30"
                  placeholder="your@email.com"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-luxury-text/70 block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-3 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30 pr-10"
                    placeholder="Your password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-luxury-text/30 hover:text-accent">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-luxury-dark text-white py-3.5 text-sm tracking-[0.15em] uppercase font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Signing In..." : <><span>Sign In</span> <ArrowRight size={14} /></>}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-[0.15em] uppercase text-luxury-text/70 block mb-1.5">Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-2.5 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30"
                    placeholder="Your name"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.15em] uppercase text-luxury-text/70 block mb-1.5">Phone</label>
                  <div className="flex items-center border-b-2 border-pastel-rose focus-within:border-accent transition-colors">
                    <select
                      value={regPhone.startsWith("+") ? regPhone.split(" ")[0] : "+91"}
                      onChange={(e) => {
                        const num = regPhone.replace(/^\+\d+\s?/, "");
                        setRegPhone(`${e.target.value} ${num}`);
                      }}
                      className="bg-transparent text-sm text-luxury-dark py-2.5 pr-1 focus:outline-none"
                      style={{ width: "80px" }}
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
                      value={regPhone.replace(/^\+\d+\s?/, "")}
                      onChange={(e) => {
                        const code = regPhone.startsWith("+") ? regPhone.split(" ")[0] : "+91";
                        setRegPhone(`${code} ${e.target.value.replace(/[^\d]/g, "")}`);
                      }}
                      className="flex-1 bg-transparent px-0 py-2.5 text-sm text-luxury-dark focus:outline-none placeholder:text-luxury-text/30"
                      placeholder="XXXXX XXXXX"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs tracking-[0.15em] uppercase text-luxury-text/70 block mb-1.5">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-2.5 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-[0.15em] uppercase text-luxury-text/70 block mb-1.5">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-2.5 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30"
                    placeholder="Min 6 chars"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.15em] uppercase text-luxury-text/70 block mb-1.5">Confirm</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      className="w-full border-b-2 border-pastel-rose bg-transparent px-0 py-2.5 text-sm text-luxury-dark focus:outline-none focus:border-accent transition-colors placeholder:text-luxury-text/30 pr-8"
                      placeholder="Re-enter"
                      required
                    />
                    {regConfirm && regPassword === regConfirm && (
                      <Check size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-luxury-dark text-white py-3.5 text-sm tracking-[0.15em] uppercase font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? "Creating Account..." : <><span>Create & Continue</span> <ArrowRight size={14} /></>}
              </button>
            </form>
          )}

          {/* Switch mode */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-pastel-pink" /></div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-[10px] tracking-[0.2em] uppercase text-luxury-text/30">
                {mode === "login" ? "New here?" : "Already a member?"}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); switchMode(); }}
            type="button"
            className="w-full border-2 border-pastel-pink text-luxury-text py-3 text-sm tracking-[0.12em] uppercase hover:border-accent hover:text-accent transition-colors"
          >
            {mode === "login" ? "Create Account" : "Sign In Instead"}
          </button>

          <p className="text-center text-[9px] text-luxury-text/25 mt-5 tracking-wider">
            By continuing, you agree to our Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
