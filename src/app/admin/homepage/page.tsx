"use client";

import { useState, useEffect } from "react";
import { Save, Check, Plus, Trash2, Image as ImageIcon, Type, GripVertical } from "lucide-react";
import ImageUploadButton from "@/components/ImageUploadButton";

interface HeroSlide {
  desktopImage: string; mobileImage: string;
  subtitle: string; title: string; description: string; cta: string; link: string;
}
interface PromoBanner {
  image: string; subtitle: string; title: string; link: string;
}
interface Content {
  marquee: string;
  heroSlides: HeroSlide[];
  splitBanners: [PromoBanner, PromoBanner];
  saleBanner: { image: string; subtitle: string; title: string; description: string; cta: string; link: string };
  instagramPosts: { image: string; link: string }[];
}

export default function AdminHomepagePage() {
  const [content, setContent] = useState<Content | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"marquee" | "hero" | "banners" | "sale" | "instagram">("marquee");

  useEffect(() => {
    fetch("/api/admin/homepage").then((r) => r.json()).then(setContent);
  }, []);

  const handleSave = async () => {
    if (!content) return;
    setSaving(true); setSaved(false);
    await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!content) return <p className="p-8 text-gray-500">Loading...</p>;

  const inputClass = "w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400";
  const labelClass = "text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1";

  const tabs = [
    { key: "marquee" as const, label: "Marquee Banner", icon: Type },
    { key: "hero" as const, label: "Hero Slider", icon: ImageIcon },
    { key: "banners" as const, label: "Split Banners", icon: ImageIcon },
    { key: "sale" as const, label: "Sale Banner", icon: ImageIcon },
    { key: "instagram" as const, label: "Instagram Gallery", icon: ImageIcon },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Homepage Editor</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your homepage content — changes go live instantly</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded text-sm font-medium transition-colors ${
            saved ? "bg-green-600 text-white" : "bg-gray-800 text-white hover:bg-gray-700"
          } disabled:opacity-50`}>
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> {saving ? "Saving..." : "Save All Changes"}</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* 1. MARQUEE BANNER */}
      {activeTab === "marquee" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Marquee Banner Text</h2>
          <p className="text-xs text-gray-400 mb-4">Scrolling text at the top of the homepage. Use " · " (dot with spaces) to separate items.</p>
          <textarea
            value={content.marquee}
            onChange={(e) => setContent({ ...content, marquee: e.target.value })}
            rows={4}
            className={`${inputClass} resize-none font-mono text-xs`}
          />
          <div className="mt-3 bg-gray-800 text-white text-xs py-2 px-4 overflow-hidden">
            <div className="whitespace-nowrap animate-marquee">{content.marquee}</div>
          </div>
        </div>
      )}

      {/* 2. HERO SLIDER */}
      {activeTab === "hero" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Hero Slides ({content.heroSlides.length})</h2>
            <button onClick={() => setContent({
              ...content,
              heroSlides: [...content.heroSlides, { desktopImage: "", mobileImage: "", subtitle: "", title: "", description: "", cta: "Shop Now", link: "/shop" }],
            })} className="bg-gray-800 text-white px-3 py-1.5 rounded text-xs hover:bg-gray-700 flex items-center gap-1">
              <Plus size={12} /> Add Slide
            </button>
          </div>

          {content.heroSlides.map((slide, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <GripVertical size={14} /> Slide {i + 1}
                </span>
                {content.heroSlides.length > 1 && (
                  <button onClick={() => setContent({ ...content, heroSlides: content.heroSlides.filter((_, j) => j !== i) })}
                    className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ImageUploadButton label="🖥️ Desktop Image (1600×900 landscape)" value={slide.desktopImage}
                    onChange={(url) => { const s = [...content.heroSlides]; s[i] = { ...s[i], desktopImage: url }; setContent({ ...content, heroSlides: s }); }} />
                </div>
                <div>
                  <ImageUploadButton label="📱 Mobile Image (600×900 portrait)" value={slide.mobileImage}
                    onChange={(url) => { const s = [...content.heroSlides]; s[i] = { ...s[i], mobileImage: url }; setContent({ ...content, heroSlides: s }); }} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Subtitle (small text above title)</label>
                  <input type="text" value={slide.subtitle}
                    onChange={(e) => { const s = [...content.heroSlides]; s[i] = { ...s[i], subtitle: e.target.value }; setContent({ ...content, heroSlides: s }); }}
                    placeholder="New Collection 2026" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Title (use \n for line break)</label>
                  <input type="text" value={slide.title}
                    onChange={(e) => { const s = [...content.heroSlides]; s[i] = { ...s[i], title: e.target.value }; setContent({ ...content, heroSlides: s }); }}
                    placeholder="Tradition Meets\nElegance" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <input type="text" value={slide.description}
                    onChange={(e) => { const s = [...content.heroSlides]; s[i] = { ...s[i], description: e.target.value }; setContent({ ...content, heroSlides: s }); }}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Button Text</label>
                  <input type="text" value={slide.cta}
                    onChange={(e) => { const s = [...content.heroSlides]; s[i] = { ...s[i], cta: e.target.value }; setContent({ ...content, heroSlides: s }); }}
                    placeholder="Shop Now" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Button Link</label>
                  <input type="text" value={slide.link}
                    onChange={(e) => { const s = [...content.heroSlides]; s[i] = { ...s[i], link: e.target.value }; setContent({ ...content, heroSlides: s }); }}
                    placeholder="/shop" className={inputClass} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. SPLIT BANNERS */}
      {activeTab === "banners" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.splitBanners.map((banner, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Banner {i + 1}</h3>
              <div className="space-y-3">
                <div>
                  <ImageUploadButton label="Banner Image" value={banner.image}
                    onChange={(url) => {
                      const b = [...content.splitBanners] as [PromoBanner, PromoBanner];
                      b[i] = { ...b[i], image: url };
                      setContent({ ...content, splitBanners: b });
                    }} />
                </div>
                <div>
                  <label className={labelClass}>Subtitle</label>
                  <input type="text" value={banner.subtitle}
                    onChange={(e) => {
                      const b = [...content.splitBanners] as [PromoBanner, PromoBanner];
                      b[i] = { ...b[i], subtitle: e.target.value };
                      setContent({ ...content, splitBanners: b });
                    }}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input type="text" value={banner.title}
                    onChange={(e) => {
                      const b = [...content.splitBanners] as [PromoBanner, PromoBanner];
                      b[i] = { ...b[i], title: e.target.value };
                      setContent({ ...content, splitBanners: b });
                    }}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Link</label>
                  <input type="text" value={banner.link}
                    onChange={(e) => {
                      const b = [...content.splitBanners] as [PromoBanner, PromoBanner];
                      b[i] = { ...b[i], link: e.target.value };
                      setContent({ ...content, splitBanners: b });
                    }}
                    className={inputClass} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. SALE BANNER */}
      {activeTab === "sale" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Full Width Sale Banner</h2>
          <div className="mb-4">
            <ImageUploadButton label="Background Image" value={content.saleBanner.image}
              onChange={(url) => setContent({ ...content, saleBanner: { ...content.saleBanner, image: url } })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Subtitle</label>
              <input type="text" value={content.saleBanner.subtitle}
                onChange={(e) => setContent({ ...content, saleBanner: { ...content.saleBanner, subtitle: e.target.value } })}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Title (big text)</label>
              <input type="text" value={content.saleBanner.title}
                onChange={(e) => setContent({ ...content, saleBanner: { ...content.saleBanner, title: e.target.value } })}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input type="text" value={content.saleBanner.description}
                onChange={(e) => setContent({ ...content, saleBanner: { ...content.saleBanner, description: e.target.value } })}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Button Text</label>
              <input type="text" value={content.saleBanner.cta}
                onChange={(e) => setContent({ ...content, saleBanner: { ...content.saleBanner, cta: e.target.value } })}
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Button Link</label>
              <input type="text" value={content.saleBanner.link}
                onChange={(e) => setContent({ ...content, saleBanner: { ...content.saleBanner, link: e.target.value } })}
                className={inputClass} />
            </div>
          </div>
          {content.saleBanner.image && (
            <div className="mt-4 h-32 bg-gray-100 rounded overflow-hidden relative">
              <img src={content.saleBanner.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600/60 to-purple-600/40 flex items-center justify-center">
                <span className="text-white text-2xl font-serif">{content.saleBanner.title}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. INSTAGRAM GALLERY */}
      {activeTab === "instagram" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Instagram Posts ({content.instagramPosts.length})</h2>
            <button onClick={() => setContent({ ...content, instagramPosts: [...content.instagramPosts, { image: "", link: "" }] })}
              className="bg-gray-800 text-white px-3 py-1.5 rounded text-xs hover:bg-gray-700 flex items-center gap-1">
              <Plus size={12} /> Add Post
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">Upload the same image as your Instagram post and paste the post URL. Clicking the image on the website opens the Instagram post.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.instagramPosts.map((post, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500">Post {i + 1}</span>
                  <button onClick={() => setContent({ ...content, instagramPosts: content.instagramPosts.filter((_, j) => j !== i) })}
                    className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
                <ImageUploadButton value={post.image}
                  onChange={(url) => {
                    const posts = [...content.instagramPosts];
                    posts[i] = { ...posts[i], image: url };
                    setContent({ ...content, instagramPosts: posts });
                  }} />
                <div className="mt-3">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Instagram Post Link</label>
                  <input type="text" value={post.link}
                    onChange={(e) => {
                      const posts = [...content.instagramPosts];
                      posts[i] = { ...posts[i], link: e.target.value };
                      setContent({ ...content, instagramPosts: posts });
                    }}
                    placeholder="https://www.instagram.com/p/ABC123..."
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save button (bottom) */}
      <div className="mt-8 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className={`flex items-center gap-2 px-8 py-3 rounded text-sm font-medium transition-colors ${
            saved ? "bg-green-600 text-white" : "bg-gray-800 text-white hover:bg-gray-700"
          } disabled:opacity-50`}>
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> {saving ? "Saving..." : "Save All Changes"}</>}
        </button>
      </div>
    </div>
  );
}
