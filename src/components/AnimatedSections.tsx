"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Animated section heading that reveals on scroll
export function AnimatedHeading({
  subtitle,
  title,
  className = "",
}: {
  subtitle: string;
  title: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const sub = ref.current!.querySelector(".anim-sub") as HTMLElement;
      const heading = ref.current!.querySelector(".anim-title") as HTMLElement;
      if (!sub || !heading) return;

      gsap.fromTo(
        sub,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        heading,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`text-center mb-12 ${className}`}>
      <p className="anim-sub text-xs tracking-[0.4em] uppercase text-accent mb-2">
        {subtitle}
      </p>
      <h2 className="anim-title font-serif text-3xl md:text-4xl text-luxury-dark">
        {title}
      </h2>
    </div>
  );
}

// Staggered grid animation for product cards and category cards
export function AnimatedGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const items = Array.from(ref.current!.children) as HTMLElement[];
      if (!items.length) return;

      gsap.fromTo(
        items,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Parallax image section (for split banners)
export function ParallaxBanner({
  image,
  children,
  className = "",
}: {
  image: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!ref.current || !imgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current!,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // Fade in content
      const content = ref.current!.querySelector(".parallax-content") as HTMLElement;
      if (!content) return;
      gsap.fromTo(
        content,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={image}
        alt=""
        className="absolute inset-0 w-full h-[120%] object-cover will-change-transform"
      />
      <div className="parallax-content relative z-10">{children}</div>
    </div>
  );
}

// Number counter animation
export function CounterSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const counters = ref.current!.querySelectorAll(".counter-value");
      if (!counters.length) return;

      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target") || "0");
        const obj = { value: 0 };

        gsap.to(obj, {
          value: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            counter.textContent = Math.round(obj.value).toLocaleString("en-IN");
          },
        });
      });

      // Fade in the whole section
      gsap.fromTo(
        Array.from(ref.current!.children) as HTMLElement[],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20 bg-luxury-dark">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
      >
        {[
          { value: 5000, label: "Happy Customers", suffix: "+" },
          { value: 500, label: "Premium Products", suffix: "+" },
          { value: 50, label: "Cities Delivered", suffix: "+" },
          { value: 98, label: "Satisfaction Rate", suffix: "%" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="font-serif text-3xl md:text-4xl text-accent-light mb-2">
              <span className="counter-value" data-target={stat.value}>
                0
              </span>
              {stat.suffix}
            </div>
            <p className="text-xs tracking-[0.2em] uppercase text-white/60">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Horizontal scroll reveal for Instagram section
export function HorizontalGallery({ posts, images }: { posts?: { image: string; link: string }[]; images?: string[] }) {
  // Support both old (images) and new (posts) format
  const items = posts || (images || []).map((img) => ({ image: img, link: "#" }));
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const items = Array.from(trackRef.current!.children) as HTMLElement[];
      if (!items.length) return;

      gsap.fromTo(
        items,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-16 overflow-hidden">
      <div
        ref={trackRef}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1"
      >
        {items.map((post, i) => (
          <a
            key={i}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square overflow-hidden group cursor-pointer relative block"
          >
            <img
              src={post.image}
              alt={`Style ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white opacity-0 group-hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// Reveal text animation for full-width sale banner
export function AnimatedSaleBanner({ content }: { content?: { image: string; subtitle: string; title: string; description: string; cta: string; link: string } }) {
  const saleData = content || { image: "/images/banner-sale.jpg", subtitle: "Limited Time Offer", title: "Season Sale", description: "Up to 40% off on selected items", cta: "Shop the Sale", link: "/shop" };
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const elements = ref.current!.querySelectorAll(".sale-anim");
      if (!elements.length) return;

      gsap.fromTo(
        elements,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Parallax bg
      const bg = ref.current!.querySelector(".sale-bg") as HTMLElement;
      if (!bg) return;
      gsap.fromTo(
        bg,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative h-[400px] overflow-hidden">
      <img
        src={saleData.image}
        alt="Sale Banner"
        className="sale-bg absolute inset-0 w-full h-[120%] object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-accent/80 to-accent-dark/70" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <p className="sale-anim text-xs tracking-[0.4em] uppercase text-white/80 mb-3">
          {saleData.subtitle}
        </p>
        <h2 className="sale-anim font-serif text-5xl md:text-7xl text-white mb-4">
          {saleData.title}
        </h2>
        <p className="sale-anim text-white/90 text-xl mb-6">
          {saleData.description}
        </p>
        <a
          href={saleData.link}
          className="sale-anim bg-white text-accent px-8 py-4 text-sm tracking-[0.2em] uppercase font-medium hover:bg-luxury-dark hover:text-white transition-colors duration-300"
        >
          {saleData.cta}
        </a>
      </div>
    </section>
  );
}

// WhatsApp CTA with scale animation
export function AnimatedWhatsAppCTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-pastel-pink via-pastel-lavender to-pastel-cream">
      <div ref={ref} className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-luxury-dark mb-4">
          Shop on WhatsApp
        </h2>
        <p className="text-luxury-text mb-8">
          Add your favorite items to cart and place your order directly via
          WhatsApp. Quick, easy, and personal.
        </p>
        <a
          href="https://wa.me/918289012150"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-luxury inline-flex items-center gap-2"
        >
          Chat With Us
        </a>
      </div>
    </section>
  );
}
