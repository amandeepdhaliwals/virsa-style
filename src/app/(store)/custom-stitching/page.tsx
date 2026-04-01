import Link from "next/link";
import { Metadata } from "next";
import { Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "Custom Stitching Service | ਵਿਰਸਾ Style",
  description: "Send your own fabric for expert tailoring. Choose your design, share measurements, and we'll stitch & deliver your perfect outfit.",
};

export default function CustomStitchingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-pastel-cream via-pastel-pink to-pastel-lavender">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-accent mb-4">Custom Tailoring</p>
          <h1 className="font-serif text-4xl md:text-5xl text-luxury-dark mb-6">
            Send Your Fabric,<br />We Stitch It
          </h1>
          <p className="text-luxury-text text-lg leading-relaxed max-w-2xl mx-auto">
            Already have fabric? Send it to us and our master tailor will stitch your dream
            outfit — any design, any style, perfect fitting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link
              href="/custom-stitching/order"
              className="bg-accent hover:bg-accent-dark text-white px-8 py-4 text-sm tracking-[0.15em] uppercase transition-colors inline-flex items-center gap-2"
            >
              <Scissors size={18} />
              Place Order Online
            </Link>
            <Link href="/shop" className="btn-outline-luxury">
              Or Buy Our Fabric + Stitching
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Simple Process</p>
            <h2 className="font-serif text-3xl text-luxury-dark">How It Works</h2>
          </div>

          <div className="space-y-0">
            {[
              {
                step: "1",
                title: "Contact Us on WhatsApp",
                desc: "Message us at +91 8289012150 and tell us you want to send your own fabric for stitching. We'll guide you through everything.",
                icon: "💬",
              },
              {
                step: "2",
                title: "Courier Your Fabric to Our Shop",
                desc: "Pack your fabric carefully and courier it to our boutique. We'll confirm receipt on WhatsApp with photos.",
                icon: "📦",
                address: true,
              },
              {
                step: "3",
                title: "Choose Your Design",
                desc: "Tell us your design preferences — neck type (V-neck, round, Chinese collar, etc.), sleeve style (full, 3/4, bell, etc.), and any other customization. You can send reference images too!",
                icon: "✂️",
              },
              {
                step: "4",
                title: "Share Your Measurements",
                desc: "Send us your body measurements (bust, waist, hip, shoulder, arm length, kameez length, bottom length). Not sure how to measure? We'll guide you on a video call!",
                icon: "📐",
              },
              {
                step: "5",
                title: "We Confirm & Start Stitching",
                desc: "Our tailor reviews everything and confirms on WhatsApp before cutting. No surprises. Once approved, stitching begins.",
                icon: "✅",
              },
              {
                step: "6",
                title: "Stitched & Delivered",
                desc: "Your perfectly stitched outfit is delivered to your doorstep within 5-8 working days. We share photos before shipping so you can see the final result.",
                icon: "🎉",
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-6 md:gap-8">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {item.icon}
                  </div>
                  {i < 5 && <div className="w-0.5 h-full bg-pastel-pink min-h-[40px]" />}
                </div>

                {/* Content */}
                <div className="pb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] tracking-wider uppercase text-accent font-medium">Step {item.step}</span>
                  </div>
                  <h3 className="text-lg font-medium text-luxury-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-luxury-text leading-relaxed">{item.desc}</p>

                  {item.address && (
                    <div className="mt-4 bg-pastel-cream border border-pastel-pink p-4">
                      <p className="text-xs tracking-wider uppercase text-accent mb-2 font-medium">Ship To</p>
                      <p className="text-sm text-luxury-dark font-medium">ਵਿਰਸਾ Style Boutique</p>
                      <p className="text-sm text-luxury-text">
                        Shop No. 26, Ganpati Square<br />
                        Front of DMart, Barnala<br />
                        Punjab — 148101
                      </p>
                      <p className="text-sm text-luxury-text mt-1">Phone: +91 8289012150</p>
                      <p className="text-[10px] text-luxury-text/50 mt-2">
                        Please write your name, phone number, and &quot;For Stitching&quot; on the parcel.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-pastel-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Transparent Pricing</p>
            <h2 className="font-serif text-3xl text-luxury-dark">Stitching Charges</h2>
            <p className="text-sm text-luxury-text/60 mt-2">
              No hidden fees. You only pay for stitching + return shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Salwar Suit",
                price: "₹700 - ₹1,000",
                includes: ["Kameez stitching", "Salwar / Patiala stitching", "Basic design included"],
                extras: "Boat neck +₹100, Bell sleeve +₹150, Lining +₹200",
              },
              {
                title: "Plazo / Pant Suit",
                price: "₹700 - ₹900",
                includes: ["Kameez stitching", "Plazo / Pant stitching", "Basic design included"],
                extras: "Chinese collar +₹150, Puff sleeve +₹200, Piping +₹150",
              },
              {
                title: "Sharara / Gharara",
                price: "₹1,000 - ₹1,200",
                includes: ["Kameez stitching", "Sharara / Gharara stitching", "Heavy suit design"],
                extras: "Canvas padding +₹250, Side pocket +₹100",
              },
              {
                title: "Return Delivery",
                price: "FREE",
                includes: ["Free delivery across India", "Punjab: 1-2 days", "Rest of India: 2-3 days"],
                extras: "We ship your stitched outfit back at no extra cost",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-pastel-pink p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm tracking-wider uppercase text-luxury-dark font-medium">{item.title}</h3>
                  <span className="text-lg font-medium text-accent">{item.price}</span>
                </div>
                <ul className="space-y-1.5 mb-3">
                  {item.includes.map((inc) => (
                    <li key={inc} className="text-xs text-luxury-text flex items-center gap-2">
                      <span className="text-green-500">✓</span> {inc}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-luxury-text/50 border-t border-pastel-pink pt-3">
                  <span className="font-medium">Add-ons:</span> {item.extras}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Options */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">Customization</p>
            <h2 className="font-serif text-3xl text-luxury-dark">Design Options Available</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-4 border-b border-pastel-pink pb-2">
                Neck Styles
              </h3>
              <ul className="space-y-2 text-sm text-luxury-text">
                {["Round Neck", "V-Neck", "Square Neck", "Boat Neck", "Chinese Collar", "Sweetheart Neck", "High Neck", "Any Custom Design"].map((n) => (
                  <li key={n} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" /> {n}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-4 border-b border-pastel-pink pb-2">
                Sleeve Styles
              </h3>
              <ul className="space-y-2 text-sm text-luxury-text">
                {["Full Sleeve", "3/4 Sleeve", "Half Sleeve", "Sleeveless", "Bell Sleeve", "Puff Sleeve", "Any Custom Design"].map((n) => (
                  <li key={n} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" /> {n}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs tracking-wider uppercase text-luxury-dark font-medium mb-4 border-b border-pastel-pink pb-2">
                Additional Options
              </h3>
              <ul className="space-y-2 text-sm text-luxury-text">
                {["Lining", "Canvas Padding", "Side Pockets", "Piping / Border", "Buttons / Hooks", "Custom Length", "Any Special Request"].map((n) => (
                  <li key={n} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" /> {n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 bg-pastel-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-luxury-dark mb-6 text-center">Important Notes</h2>
          <div className="space-y-4">
            {[
              { q: "How long does stitching take?", a: "3-6 days for stitching + 2-3 days for shipping. Total 5-8 working days." },
              { q: "Can I get my fabric back unstitched if I don't like the design?", a: "Once cutting starts, we cannot return uncut fabric. That's why we confirm everything on WhatsApp before cutting." },
              { q: "What if the stitching doesn't fit?", a: "We offer free alteration within 7 days of delivery. Just courier it back and we'll fix it." },
              { q: "Do you stitch men's clothes?", a: "Currently we only stitch women's suits — salwar, plazo, sharara, gharara, and pajami styles." },
              { q: "What payment methods do you accept?", a: "Prepaid only — UPI, card, or net banking. No COD for stitching orders." },
              { q: "Can I visit the shop for measurements?", a: "Absolutely! Walk into our boutique at Ganpati Square, Barnala. Our tailor will take perfect measurements in person." },
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
          <h2 className="font-serif text-3xl text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/60 text-sm mb-8">
            Message us on WhatsApp with your fabric details and we&apos;ll take it from there. It&apos;s that simple.
          </p>
          <Link
            href="/custom-stitching/order"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-10 py-4 text-sm tracking-wider uppercase transition-colors"
          >
            <Scissors size={18} />
            Place Your Order Now
          </Link>
          <p className="text-white/40 text-xs mt-4">
            Or call us at +91 8289012150 for any questions
          </p>
        </div>
      </section>
    </>
  );
}
