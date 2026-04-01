import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import SmoothScroll from "@/components/SmoothScroll";
import AnimatedHero from "@/components/AnimatedHero";
import {
  AnimatedHeading,
  AnimatedGrid,
  ParallaxBanner,
  CounterSection,
  HorizontalGallery,
  AnimatedSaleBanner,
  AnimatedWhatsAppCTA,
} from "@/components/AnimatedSections";
import { MarqueeBanner, TrustBadges } from "@/components/PromoBanner";
import { ArrowRight } from "lucide-react";
import { getHomepageContent } from "@/lib/homepage-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const hpContent = getHomepageContent();
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true, inStock: true },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  const newArrivals = await prisma.product.findMany({
    where: { inStock: true },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <SmoothScroll>
      {/* Marquee Banner */}
      <MarqueeBanner text={hpContent.marquee} />

      {/* Animated Hero with Parallax */}
      <AnimatedHero slides={hpContent.heroSlides} />

      {/* Trust Badges */}
      <TrustBadges />

      {/* How It Works — USP Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">How It Works</p>
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-dark">Your Suit, Your Way</h2>
            <p className="text-sm text-luxury-text/60 mt-3 max-w-xl mx-auto">
              We don&apos;t just sell fabric — we craft your dream outfit. Choose a suit, customize the design, and we stitch it to your measurements.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                step: "01",
                icon: "🛍️",
                title: "Choose Your Suit",
                desc: "Browse our collection of premium unstitched suits — salwar, sharara, gharara, plazo & more.",
              },
              {
                step: "02",
                icon: "✂️",
                title: "Pick Your Design",
                desc: "Select neck style, sleeve type, and extras. Or send us a reference image on WhatsApp.",
              },
              {
                step: "03",
                icon: "📐",
                title: "Send Measurements",
                desc: "Fill your body measurements on our website or share them on WhatsApp. Our tailor confirms before stitching.",
              },
              {
                step: "04",
                icon: "📦",
                title: "We Stitch & Deliver",
                desc: "Expert tailoring in 3-6 days. Stitched to perfection and delivered to your doorstep across India.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-pastel-cream border border-pastel-pink rounded-full flex items-center justify-center mx-auto group-hover:bg-accent/10 group-hover:border-accent/30 transition-colors duration-300">
                    <span className="text-2xl md:text-3xl">{item.icon}</span>
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xs md:text-sm tracking-[0.15em] uppercase text-luxury-dark font-medium mb-2">
                  {item.title}
                </h3>
                <p className="text-[11px] md:text-xs text-luxury-text/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shop?category=punjabi-salwar-suit" className="btn-luxury inline-flex items-center gap-2">
              Shop Suits <ArrowRight size={16} />
            </Link>
            <Link href="/custom-stitching" className="btn-outline-luxury inline-flex items-center gap-2">
              Send Your Own Fabric →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedHeading subtitle="Browse" title="Shop by Category" />
            <AnimatedGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative overflow-hidden aspect-[3/4] bg-pastel-cream"
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pastel-pink to-pastel-lavender" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/60 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-sm tracking-[0.15em] uppercase font-medium">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </AnimatedGrid>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <AnimatedHeading
                subtitle="Handpicked"
                title="Featured Collection"
                className="!text-left !mb-0"
              />
              <Link
                href="/shop"
                className="hidden md:flex items-center gap-2 text-sm tracking-wider uppercase text-accent hover:text-accent-dark transition-colors"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <AnimatedGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  comparePrice={product.comparePrice}
                  image={product.images[0] || ""}
                  category={product.category.name}
                />
              ))}
            </AnimatedGrid>
            <div className="text-center mt-8 md:hidden">
              <Link href="/shop" className="btn-outline-luxury">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Split Parallax Banners — dynamic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hpContent.splitBanners.map((banner, i) => (
            <Link key={i} href={banner.link} className="group relative overflow-hidden h-[400px]">
              <ParallaxBanner image={banner.image} className="h-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-accent-light mb-2">{banner.subtitle}</p>
                  <h3 className="font-serif text-3xl text-white mb-3">{banner.title}</h3>
                  <span className="text-white/80 text-sm border-b border-white/40 pb-0.5 group-hover:border-accent-light transition-colors">Shop Collection →</span>
                </div>
              </ParallaxBanner>
            </Link>
          ))}
        </AnimatedGrid>
      </section>

      {/* Animated Sale Banner — dynamic */}
      <AnimatedSaleBanner content={hpContent.saleBanner} />

      {/* Stats Counter */}
      <CounterSection />

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20 bg-pastel-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedHeading subtitle="Just Dropped" title="New Arrivals" />
            <AnimatedGrid className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  comparePrice={product.comparePrice}
                  image={product.images[0] || ""}
                  category={product.category.name}
                />
              ))}
            </AnimatedGrid>
          </div>
        </section>
      )}

      {/* Instagram / Gallery Section with Animation */}
      <div>
        <div className="text-center pt-16 mb-10">
          <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">
            @virsastyle
          </p>
          <h2 className="font-serif text-3xl text-luxury-dark">
            Follow Our Style
          </h2>
        </div>
        <HorizontalGallery posts={hpContent.instagramPosts} />
      </div>

      {/* WhatsApp CTA */}
      <AnimatedWhatsAppCTA />
    </SmoothScroll>
  );
}
