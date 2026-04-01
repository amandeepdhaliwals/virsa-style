import Link from "next/link";
import { Metadata } from "next";
import { Globe, Truck, Clock, ShieldCheck, CreditCard, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "We Ship Worldwide | ਵਿਰਸਾ Style",
  description: "ਵਿਰਸਾ Style ships to Canada, Australia, New Zealand, UK, USA, UAE and 10+ countries. Free international shipping above ₹5,000.",
};

const SHIPPING_ZONES = [
  {
    region: "Punjab & North India",
    countries: ["Punjab, Haryana, HP, J&K, Delhi NCR"],
    delivery: "2-3 days",
    rate: "Free above ₹999",
    highlight: true,
  },
  {
    region: "Rest of India",
    countries: ["All states"],
    delivery: "4-5 days",
    rate: "Free above ₹999",
    highlight: false,
  },
  {
    region: "Canada & USA",
    countries: ["Canada", "United States"],
    delivery: "10-14 days",
    rate: "₹799 (Free above ₹5,000)",
    highlight: false,
  },
  {
    region: "Australia & New Zealand",
    countries: ["Australia", "New Zealand"],
    delivery: "12-16 days",
    rate: "₹799 (Free above ₹5,000)",
    highlight: false,
  },
  {
    region: "UK & Europe",
    countries: ["United Kingdom", "Germany", "Italy"],
    delivery: "10-14 days",
    rate: "₹799 (Free above ₹5,000)",
    highlight: false,
  },
  {
    region: "Middle East",
    countries: ["UAE / Dubai", "Saudi Arabia", "Kuwait", "Qatar"],
    delivery: "7-10 days",
    rate: "₹799 (Free above ₹5,000)",
    highlight: false,
  },
  {
    region: "Southeast Asia",
    countries: ["Singapore", "Malaysia"],
    delivery: "7-10 days",
    rate: "₹799 (Free above ₹5,000)",
    highlight: false,
  },
];

export default function WorldwideShippingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-pastel-cream via-pastel-pink to-pastel-lavender">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe size={32} className="text-accent" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-luxury-dark mb-6">
            We Ship Worldwide
          </h1>
          <p className="text-luxury-text text-lg leading-relaxed max-w-2xl mx-auto">
            ਵਿਰਸਾ Style delivers to <strong>15+ countries</strong> including Canada, Australia,
            New Zealand, UK, USA, UAE, and more. Punjabi fashion, straight from Barnala to your doorstep.
          </p>
        </div>
      </section>

      {/* Key highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: "15+ Countries", desc: "We deliver worldwide" },
              { icon: Truck, title: "Free Shipping", desc: "International above ₹5,000" },
              { icon: Clock, title: "7-16 Days", desc: "Depends on your location" },
              { icon: CreditCard, title: "Pay in Any Currency", desc: "Razorpay accepts all cards" },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon size={22} className="text-accent" />
                </div>
                <h3 className="text-sm font-medium text-luxury-dark">{item.title}</h3>
                <p className="text-xs text-luxury-text/60 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping rates table */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Shipping Rates</p>
            <h2 className="font-serif text-3xl text-luxury-dark">Delivery by Region</h2>
          </div>

          <div className="space-y-4">
            {SHIPPING_ZONES.map((zone) => (
              <div key={zone.region}
                className={`border p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  zone.highlight ? "border-accent bg-accent/5" : "border-pastel-pink"
                }`}>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-luxury-dark flex items-center gap-2">
                    {zone.region}
                    {zone.highlight && <span className="text-[10px] bg-accent text-white px-2 py-0.5 uppercase tracking-wider">Fastest</span>}
                  </h3>
                  <p className="text-xs text-luxury-text/60 mt-1">{zone.countries.join(", ")}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-luxury-text/50">Delivery</p>
                    <p className="text-sm font-medium text-luxury-dark">{zone.delivery}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-luxury-text/50">Shipping</p>
                    <p className="text-sm font-medium text-accent">{zone.rate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-luxury-text/40 text-center mt-6">
            All prices in Indian Rupees (₹). Your payment provider converts to your local currency automatically.
          </p>
        </div>
      </section>

      {/* How it works for NRI */}
      <section className="py-16 bg-pastel-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">For NRI Customers</p>
            <h2 className="font-serif text-3xl text-luxury-dark">Shopping from Abroad?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Buy Products */}
            <div className="bg-white border border-pastel-pink p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Package size={18} className="text-accent" />
                </div>
                <h3 className="text-sm font-medium text-luxury-dark uppercase tracking-wider">Buy Products</h3>
              </div>
              <ol className="space-y-3 text-sm text-luxury-text">
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">1</span>
                  Browse & add products to cart
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">2</span>
                  Select your country at checkout
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">3</span>
                  Pay with any international card (Visa/MC)
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">4</span>
                  We ship directly to your international address
                </li>
              </ol>
            </div>

            {/* Custom Stitching */}
            <div className="bg-white border border-pastel-pink p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <ShieldCheck size={18} className="text-accent" />
                </div>
                <h3 className="text-sm font-medium text-luxury-dark uppercase tracking-wider">Custom Stitching</h3>
              </div>
              <ol className="space-y-3 text-sm text-luxury-text">
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">1</span>
                  Place stitching order & pay online
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">2</span>
                  Courier your fabric from your country to our Barnala shop
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">3</span>
                  We stitch your suit (2 days)
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-accent text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">4</span>
                  We ship stitched outfit back to your country
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-luxury-dark mb-8 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What currency do I pay in?", a: "All prices are in Indian Rupees (₹). Your bank/card automatically converts to your local currency (CAD, AUD, GBP, etc.) at the current exchange rate." },
              { q: "Do I have to pay customs/import duty?", a: "Customs duties depend on your country's policies. For most countries, items under a certain value are duty-free. We declare the actual value on the customs form." },
              { q: "Which courier do you use for international shipping?", a: "We use India Post International (EMS), DTDC International, or FedEx depending on the destination and package weight." },
              { q: "Can I track my international shipment?", a: "Yes! We provide a tracking number once shipped. You can track it from your account or our tracking page." },
              { q: "What if my package is lost in transit?", a: "We'll investigate with the courier and either reship or refund. Contact us on WhatsApp immediately if your package is delayed beyond the estimated time." },
              { q: "Can I send fabric from abroad for stitching?", a: "Absolutely! Courier your fabric to our Barnala shop address. We stitch and ship back to your country. The stitching order page handles everything." },
            ].map((item) => (
              <div key={item.q} className="bg-white border border-pastel-pink p-5">
                <p className="text-sm font-medium text-luxury-dark mb-1">{item.q}</p>
                <p className="text-sm text-luxury-text">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-luxury-dark text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Globe size={40} className="mx-auto text-accent-light mb-4" />
          <h2 className="font-serif text-3xl text-white mb-4">Start Shopping from Anywhere</h2>
          <p className="text-white/60 text-sm mb-8">
            Punjabi fashion delivered worldwide. Same quality, same heritage, no matter where you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-accent hover:bg-accent-dark text-white px-8 py-4 text-sm tracking-wider uppercase transition-colors">
              Shop Now
            </Link>
            <Link href="/custom-stitching" className="border border-white/30 text-white px-8 py-4 text-sm tracking-wider uppercase hover:border-accent hover:text-accent transition-colors">
              Custom Stitching
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
