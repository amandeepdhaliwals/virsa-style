import { Heart, Gem, Truck, Scissors, MapPin, Phone } from "lucide-react";
const showroomImages = [
  { src: "/images/showroom/showroom-1.jpg", alt: "Our Luxury Boutique — Barnala, Punjab" },
  { src: "/images/showroom/showroom-2.jpg", alt: "Premium Suit Collection Display" },
  { src: "/images/showroom/showroom-3.jpg", alt: "Handpicked Fabrics & Materials" },
  { src: "/images/showroom/showroom-4.jpg", alt: "Stitching & Tailoring Section" },
  { src: "/images/showroom/showroom-5.jpg", alt: "Footwear Collection — Juttis, Boots & More" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-pastel-cream via-pastel-pink to-pastel-lavender">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-luxury-dark mb-6">
            ਵਿਰਸਾ Style Boutique
          </h1>
          <p className="text-luxury-text text-lg leading-relaxed max-w-2xl mx-auto">
            A luxury boutique in Barnala, Punjab — where tradition meets elegance.
            We craft bespoke Punjabi suits with expert tailoring and offer handcrafted
            juttis, boots, and chappals.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/products/salwar-1.jpg"
                alt="ਵਿਰਸਾ Style Boutique"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-accent mb-3">
                Since 2026 — Barnala, Punjab
              </p>
              <h2 className="font-serif text-3xl text-luxury-dark mb-6">
                Tradition Meets Elegance
              </h2>
              <div className="space-y-4 text-luxury-text leading-relaxed">
                <p>
                  &ldquo;ਵਿਰਸਾ&rdquo; (Virsa) means heritage — and that&apos;s
                  the heart of everything we do. We are a luxury boutique based in
                  Barnala, Punjab, specializing in premium unstitched suits with
                  expert custom tailoring.
                </p>
                <p>
                  When you shop with us, you don&apos;t just buy fabric — you get a
                  complete experience. Choose your suit, pick your design (V-neck,
                  Chinese collar, bell sleeves — anything you dream), send us your
                  measurements, and our master tailor crafts your perfect outfit.
                </p>
                <p>
                  We also offer a beautiful collection of handcrafted Punjabi juttis,
                  stylish boots, and everyday chappals — all curated with the same
                  attention to quality and heritage.
                </p>
                <p className="text-accent font-medium">
                  Visit us at Shop No. 26, Ganpati Square, Front of DMart, Barnala.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video */}
      <section className="py-20 bg-pastel-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Watch</p>
            <h2 className="font-serif text-3xl text-luxury-dark">Inside Our Boutique</h2>
            <p className="text-sm text-luxury-text/60 mt-2">
              Take a virtual tour of ਵਿਰਸਾ Style boutique
            </p>
          </div>
          <div className="relative aspect-video bg-luxury-dark overflow-hidden shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="ਵਿਰਸਾ Style Boutique Tour"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-center text-[10px] text-luxury-text/40 mt-4 tracking-wider">
            Subscribe to our YouTube channel for latest collections & styling tips
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">What We Offer</p>
            <h2 className="font-serif text-3xl text-luxury-dark">The Virsa Experience</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Scissors,
                title: "Custom Stitching",
                desc: "Choose neck, sleeve, and design. Send measurements or visit our shop. Our master tailor crafts your perfect suit.",
              },
              {
                icon: Gem,
                title: "Premium Fabrics",
                desc: "Handpicked unstitched suits in silk, georgette, cotton, Chanderi & Banarasi. Every fabric tells a story.",
              },
              {
                icon: Heart,
                title: "Handcrafted Juttis",
                desc: "Traditional Phulkari, Kundan & velvet juttis. Each pair handcrafted by artisans with love and skill.",
              },
              {
                icon: Truck,
                title: "Pan-India Delivery",
                desc: "Free shipping on orders above ₹999. Prepaid orders only. Fast delivery across India.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-pastel-cream p-8 border border-pastel-pink hover:shadow-lg transition-shadow duration-300"
              >
                <item.icon size={28} className="text-accent mb-4" />
                <h3 className="text-sm tracking-[0.15em] uppercase text-luxury-dark font-medium mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-luxury-text leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Stitching Works */}
      <section className="py-20 bg-pastel-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">How It Works</p>
            <h2 className="font-serif text-3xl text-luxury-dark">Custom Tailoring Process</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Choose Suit", desc: "Browse our collection and pick your favourite unstitched suit." },
              { step: "02", title: "Customize Design", desc: "Select neck style, sleeve type, and extras like lining or piping." },
              { step: "03", title: "Send Measurements", desc: "Fill in body measurements on website or share on WhatsApp." },
              { step: "04", title: "We Deliver", desc: "Our tailor stitches to perfection. Delivered in 3-6 days." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent font-serif text-xl">{item.step}</span>
                </div>
                <h3 className="text-sm tracking-wider uppercase text-luxury-dark font-medium mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-luxury-text leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Showroom Gallery */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Gallery</p>
            <h2 className="font-serif text-3xl text-luxury-dark">Our Showroom</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {showroomImages.map((img, i) => (
              <div
                key={i}
                className={`overflow-hidden group cursor-pointer ${
                  i === 0 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt || `Showroom ${i + 1}`}
                  className="w-full h-full object-cover aspect-square md:aspect-auto group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-16 bg-luxury-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-accent-light mb-3">Visit Our Boutique</p>
          <h2 className="font-serif text-3xl text-white mb-6">Come See Us in Person</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/70">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-accent-light" />
              <div className="text-left">
                <p className="text-sm text-white">Shop No. 26, Ganpati Square</p>
                <p className="text-xs">Front of DMart, Barnala, Punjab</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-accent-light" />
              <div className="text-left">
                <p className="text-sm text-white">+91 8289012150</p>
                <p className="text-xs">Mon-Sat, 10 AM - 8 PM</p>
              </div>
            </div>
          </div>
          <a
            href="https://wa.me/918289012150"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-sm tracking-wider uppercase transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat With Us on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
