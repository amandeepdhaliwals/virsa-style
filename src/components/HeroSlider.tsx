"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/images/hero-1.jpg",
    subtitle: "New Collection 2026",
    title: "Elegance\nRedefined",
    description: "Discover our curated collection of premium women's clothing and footwear.",
    cta: "Shop Now",
    link: "/shop",
    align: "left" as const,
  },
  {
    image: "/images/hero-2.jpg",
    subtitle: "Traditional Heritage",
    title: "Punjabi Suits\nCollection",
    description: "Authentic Phulkari, Patiala & Designer suits celebrating Punjab's rich culture.",
    cta: "Explore",
    link: "/shop?category=punjabi-suits",
    align: "center" as const,
  },
  {
    image: "/images/hero-3.jpg",
    subtitle: "Exclusive Styles",
    title: "Summer\nEssentials",
    description: "Lightweight, breathable fabrics designed for the modern woman.",
    cta: "Shop Dresses",
    link: "/shop?category=dresses",
    align: "right" as const,
  },
  {
    image: "/images/hero-4.jpg",
    subtitle: "Festive Season",
    title: "Ethnic Wear\nSale",
    description: "Up to 40% off on designer ethnic wear. Limited time offer.",
    cta: "Shop Ethnic",
    link: "/shop?category=ethnic-wear",
    align: "left" as const,
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  const prev = useCallback(() => {
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [current, goToSlide]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const alignClass =
    slide.align === "center"
      ? "items-center text-center"
      : slide.align === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
        <div className={`flex flex-col justify-center max-w-2xl ${alignClass}`}>
          <p
            className="text-xs tracking-[0.4em] uppercase text-accent-light mb-4 animate-fade-in"
            key={`sub-${current}`}
          >
            {slide.subtitle}
          </p>
          <h1
            className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6 whitespace-pre-line animate-slide-up"
            key={`title-${current}`}
          >
            {slide.title}
          </h1>
          <p
            className="text-white/80 text-lg mb-8 max-w-md animate-fade-in"
            key={`desc-${current}`}
          >
            {slide.description}
          </p>
          <Link
            href={slide.link}
            className="btn-luxury inline-block w-fit animate-fade-in"
            key={`cta-${current}`}
          >
            {slide.cta}
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
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
    </section>
  );
}
