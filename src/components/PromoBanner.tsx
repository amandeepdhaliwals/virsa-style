import Link from "next/link";

export function MarqueeBanner({ text: propText }: { text?: string }) {
  const text = propText || "FREE SHIPPING ABOVE ₹999  ·  LUXURY BOUTIQUE — BARNALA, PUNJAB  ·  CUSTOM STITCHING & TAILORING  ·  UNSTITCHED & STITCHED SUITS  ·  PUNJABI JUTTIS & FOOTWEAR  ·  PREPAID ORDERS ONLY  ·  ";
  return (
    <div className="bg-accent text-white overflow-hidden py-2">
      <div className="animate-marquee whitespace-nowrap flex">
        {[0, 1, 2].map((i) => (
          <span key={i} className="text-[11px] tracking-[0.25em] uppercase mx-8">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SplitBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Banner */}
        <Link
          href="/shop?category=punjabi-suits"
          className="group relative overflow-hidden h-[400px]"
        >
          <img
            src="/images/banner-suits.jpg"
            alt="Punjabi Suits"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-accent-light mb-2">
              Heritage Collection
            </p>
            <h3 className="font-serif text-3xl text-white mb-3">Punjabi Suits</h3>
            <span className="text-white/80 text-sm border-b border-white/40 pb-0.5 group-hover:border-accent-light transition-colors">
              Shop Collection →
            </span>
          </div>
        </Link>

        {/* Right Banner */}
        <Link
          href="/shop?category=footwear"
          className="group relative overflow-hidden h-[400px]"
        >
          <img
            src="/images/banner-footwear.jpg"
            alt="Footwear"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-accent-light mb-2">
              New Arrivals
            </p>
            <h3 className="font-serif text-3xl text-white mb-3">Luxury Footwear</h3>
            <span className="text-white/80 text-sm border-b border-white/40 pb-0.5 group-hover:border-accent-light transition-colors">
              Shop Collection →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

export function FullWidthBanner() {
  return (
    <section className="relative h-[350px] overflow-hidden">
      <img
        src="/images/banner-sale.jpg"
        alt="Sale Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-accent/80 to-accent-dark/70" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="text-xs tracking-[0.4em] uppercase text-white/80 mb-3">
          Limited Time Offer
        </p>
        <h2 className="font-serif text-4xl md:text-6xl text-white mb-4">
          Season Sale
        </h2>
        <p className="text-white/90 text-xl mb-6">Up to 40% off on selected items</p>
        <Link
          href="/shop"
          className="bg-white text-accent px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-luxury-dark hover:text-white transition-colors duration-300"
        >
          Shop the Sale
        </Link>
      </div>
    </section>
  );
}

export function TrustBadges() {
  return (
    <section className="bg-white py-10 border-y border-pastel-pink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { title: "Free Shipping", desc: "On orders above ₹999", icon: "🚚" },
            { title: "Custom Stitching", desc: "Your design, our craft", icon: "✂️" },
            { title: "WhatsApp Support", desc: "Quick & personal", icon: "💬" },
            { title: "Luxury Boutique", desc: "Barnala, Punjab", icon: "🏪" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              <span className="text-2xl mb-2">{item.icon}</span>
              <h4 className="text-xs tracking-[0.2em] uppercase text-luxury-dark font-medium">
                {item.title}
              </h4>
              <p className="text-[11px] text-luxury-text/50 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
