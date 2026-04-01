"use client";

import { useState } from "react";
import { Phone, Mail, Instagram, Facebook, Clock, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      const data = await res.json();
      setErrors({ form: data.error });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Get in Touch</p>
        <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">Contact Us</h1>
        <p className="text-luxury-text/60 mt-3 max-w-md mx-auto">
          We&apos;d love to hear from you. Send us a message or reach out on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          {success ? (
            <div className="bg-green-50 border border-green-200 p-8 text-center">
              <Check size={40} className="mx-auto text-green-600 mb-4" />
              <h2 className="font-serif text-xl text-luxury-dark mb-2">Message Sent!</h2>
              <p className="text-sm text-luxury-text mb-4">
                Thank you for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
              <button onClick={() => setSuccess(false)} className="btn-outline-luxury text-xs">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <p className="text-red-500 text-sm bg-red-50 py-2 px-4">{errors.form}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white"
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">
                    Phone <span className="text-luxury-text/30">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">
                    Subject <span className="text-luxury-text/30">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white"
                    placeholder="What's this about?"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full border border-pastel-rose px-4 py-3 text-sm focus:outline-none focus:border-accent bg-white resize-none"
                  placeholder="Tell us how we can help..."
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-luxury w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={16} />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white border border-pastel-pink p-8">
            <h2 className="text-xs tracking-[0.3em] uppercase text-luxury-dark mb-6">Reach Us</h2>
            <div className="space-y-6">
              <a href="https://wa.me/918289012150" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-luxury-dark group-hover:text-accent transition-colors">WhatsApp</p>
                  <p className="text-sm text-luxury-text/60">+91 8289012150</p>
                </div>
              </a>

              <a href="mailto:hello@virsastyle.com" className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-pastel-pink rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-luxury-dark group-hover:text-accent transition-colors">Email</p>
                  <p className="text-sm text-luxury-text/60">hello@virsastyle.com</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-pastel-lavender rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-luxury-dark">Business Hours</p>
                  <p className="text-sm text-luxury-text/60">Mon - Sat: 10:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-pastel-pink p-8">
            <h2 className="text-xs tracking-[0.3em] uppercase text-luxury-dark mb-4">Follow Us</h2>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-pastel-cream flex items-center justify-center text-luxury-text hover:bg-accent hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-pastel-cream flex items-center justify-center text-luxury-text hover:bg-accent hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 text-center">
            <p className="text-sm font-medium text-luxury-dark mb-2">Fastest Response</p>
            <p className="text-xs text-luxury-text mb-4">Get instant help on WhatsApp</p>
            <a
              href="https://wa.me/918289012150"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-xs tracking-wider uppercase inline-block transition-colors"
            >
              Chat Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
