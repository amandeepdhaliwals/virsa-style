"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Check, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    // Auto-focus first input
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5 && newOtp.every((d) => d)) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: code }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/account"), 2000);
    } else {
      setError(data.error);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMsg("");
    const res = await fetch("/api/auth/send-verification", { method: "POST" });
    const data = await res.json();
    setResending(false);
    setResendMsg(data.message || data.error);
  };

  if (status === "loading") {
    return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-sm text-luxury-text">Loading...</p></div>;
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="font-serif text-3xl text-luxury-dark mb-3">Email Verified!</h1>
          <p className="text-sm text-luxury-text/60">Redirecting to your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={28} className="text-accent" />
        </div>

        <h1 className="font-serif text-3xl text-luxury-dark mb-3">Verify Your Email</h1>
        <p className="text-sm text-luxury-text/60 mb-2">
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-medium text-luxury-dark mb-8">
          {session?.user?.email}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-14 text-center text-xl font-medium border-2 transition-colors focus:outline-none ${
                digit
                  ? "border-accent bg-accent/5 text-luxury-dark"
                  : "border-pastel-rose text-luxury-dark focus:border-accent"
              }`}
              disabled={loading}
            />
          ))}
        </div>

        {loading && (
          <p className="text-sm text-accent mb-4">Verifying...</p>
        )}

        <button
          onClick={() => {
            const code = otp.join("");
            if (code.length === 6) handleVerify(code);
          }}
          disabled={loading || otp.some((d) => !d)}
          className="w-full btn-luxury py-4 disabled:opacity-40 mb-6"
        >
          Verify Email
        </button>

        {/* Resend */}
        <div className="text-center">
          <p className="text-xs text-luxury-text/40 mb-2">Didn&apos;t receive the code?</p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-accent hover:text-accent-dark transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
            {resending ? "Sending..." : "Resend Code"}
          </button>
          {resendMsg && (
            <p className="text-xs text-green-600 mt-2">{resendMsg}</p>
          )}
        </div>

        <p className="text-[10px] text-luxury-text/30 mt-8">
          Code expires in 10 minutes. Check your spam folder if you don&apos;t see it.
        </p>
      </div>
    </div>
  );
}
