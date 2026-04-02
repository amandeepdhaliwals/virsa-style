"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const defaultSlides = [
  { desktopImage: "/images/hero-1.jpg", mobileImage: "/images/hero-1.jpg", subtitle: "ਵਿਰਸਾ Style Boutique", title: "Tradition Meets\nElegance", description: "Premium unstitched suits with expert tailoring.", cta: "Shop Suits", link: "/shop" },
  { desktopImage: "/images/hero-2.jpg", mobileImage: "/images/hero-2.jpg", subtitle: "Custom Stitching", title: "Your Design\nOur Craft", description: "Choose your fabric, select your design, send your measurements.", cta: "Explore Suits", link: "/shop?category=punjabi-salwar-suit" },
  { desktopImage: "/images/hero-3.jpg", mobileImage: "/images/hero-3.jpg", subtitle: "Handcrafted Heritage", title: "Punjabi Jutti\nCollection", description: "Traditional Phulkari & Kundan juttis handcrafted with love.", cta: "Shop Footwear", link: "/shop?category=punjabi-jutti" },
  { desktopImage: "/images/hero-4.jpg", mobileImage: "/images/hero-4.jpg", subtitle: "Wedding Season", title: "Sharara &\nGharara Suits", description: "Royal suits for your special day. Heavy embroidery, silk fabrics.", cta: "Shop Bridal", link: "/shop?category=sharara-suit" },
];

interface Slide {
  desktopImage: string;
  mobileImage: string;
  subtitle: string; title: string; description: string; cta: string; link: string;
  // Legacy support
  image?: string;
}

export default function AnimatedHero({ slides: propSlides }: { slides?: Slide[] }) {
  const slides = (propSlides && propSlides.length > 0 ? propSlides : defaultSlides).map((s) => ({
    ...s,
    desktopImage: s.desktopImage || s.image || "/images/hero-1.jpg",
    mobileImage: s.mobileImage || s.image || "/images/hero-1.jpg",
  }));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);

      // Animate text out
      if (textRef.current) {
        gsap.to(textRef.current.children, {
          y: -30,
          opacity: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setCurrent(index);
            // Animate text in
            if (textRef.current) {
              gsap.fromTo(
                textRef.current.children,
                { y: 40, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  stagger: 0.1,
                  duration: 0.6,
                  ease: "power3.out",
                  onComplete: () => setIsTransitioning(false),
                }
              );
            }
          },
        });
      }
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  const prev = useCallback(() => {
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [current, goToSlide]);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Initial animation
  useEffect(() => {
    if (!textRef.current) return;
    gsap.fromTo(
      textRef.current.children,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: "power3.out", delay: 0.5 }
    );
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".hero-images", {
        yPercent: 20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-content", {
        y: -80,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "20% top",
          end: "50% top",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const slide = slides[current];

  return (
    <section ref={containerRef} className="relative h-[85vh] md:h-[90vh] overflow-hidden">
      {/* Background images with crossfade */}
      <div className="hero-images absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Desktop image */}
            <img
              src={s.desktopImage}
              alt={s.title}
              className="hidden md:block w-full h-full object-cover scale-105"
            />
            {/* Mobile image */}
            <img
              src={s.mobileImage}
              alt={s.title}
              className="block md:hidden w-full h-full object-cover scale-105"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="hero-content relative h-full flex flex-col items-center justify-center text-center px-4">
        <div ref={textRef}>
          <p className="text-xs tracking-[0.5em] uppercase text-accent-light mb-6">
            {slide.subtitle}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-4 whitespace-pre-line">
            {slide.title}
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
            {slide.description}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={slide.link} className="btn-luxury">
              {slide.cta}
            </Link>
            <Link
              href="/shop"
              className="border border-white/40 text-white px-6 py-3 text-sm tracking-wider uppercase hover:bg-white/10 transition-all duration-300"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current ? "w-10 bg-accent-light" : "w-4 bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <span className="text-[9px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-white/40 to-transparent scroll-line" />
      </div>
    </section>
  );
}
