import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Use absolute path based on project root to ensure it works in production
const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd();
const CONTENT_FILE = join(PROJECT_ROOT, "homepage-content.json");

console.log("[Homepage Content] File path:", CONTENT_FILE);

export interface HeroSlide {
  desktopImage: string;  // Landscape 1600×900
  mobileImage: string;   // Portrait 600×900
  subtitle: string;
  title: string;
  description: string;
  cta: string;
  link: string;
}

export interface PromoBanner {
  image: string;
  subtitle: string;
  title: string;
  link: string;
}

export interface InstagramPost {
  image: string;
  link: string; // Instagram post URL
}

export interface HomepageContent {
  marquee: string;
  heroSlides: HeroSlide[];
  splitBanners: [PromoBanner, PromoBanner];
  saleBanner: {
    image: string;
    subtitle: string;
    title: string;
    description: string;
    cta: string;
    link: string;
  };
  instagramPosts: InstagramPost[];
}

const DEFAULT_CONTENT: HomepageContent = {
  marquee: "FREE SHIPPING ABOVE ₹999  ·  LUXURY BOUTIQUE — BARNALA, PUNJAB  ·  CUSTOM STITCHING & TAILORING  ·  UNSTITCHED & STITCHED SUITS  ·  PUNJABI JUTTIS & FOOTWEAR  ·  PREPAID ORDERS ONLY  ·  ",
  heroSlides: [
    {
      desktopImage: "/images/hero-1.jpg",
      mobileImage: "/images/hero-1.jpg",
      subtitle: "ਵਿਰਸਾ Style Boutique",
      title: "Tradition Meets\nElegance",
      description: "Premium unstitched suits with expert tailoring. Customize your perfect outfit.",
      cta: "Shop Suits",
      link: "/shop",
    },
    {
      desktopImage: "/images/hero-2.jpg",
      mobileImage: "/images/hero-2.jpg",
      subtitle: "Custom Stitching",
      title: "Your Design\nOur Craft",
      description: "Choose your fabric, select your design, send your measurements. We stitch perfection.",
      cta: "Explore Suits",
      link: "/shop?category=punjabi-salwar-suit",
    },
    {
      desktopImage: "/images/hero-3.jpg",
      mobileImage: "/images/hero-3.jpg",
      subtitle: "Handcrafted Heritage",
      title: "Punjabi Jutti\nCollection",
      description: "Traditional Phulkari & Kundan juttis handcrafted with love. Boots & chappals too.",
      cta: "Shop Footwear",
      link: "/shop?category=punjabi-jutti",
    },
    {
      desktopImage: "/images/hero-4.jpg",
      mobileImage: "/images/hero-4.jpg",
      subtitle: "Wedding Season",
      title: "Sharara &\nGharara Suits",
      description: "Royal suits for your special day. Heavy embroidery, silk fabrics, custom fitting.",
      cta: "Shop Bridal",
      link: "/shop?category=sharara-suit",
    },
  ],
  splitBanners: [
    {
      image: "/images/banner-suits.jpg",
      subtitle: "Wedding Collection",
      title: "Sharara & Gharara",
      link: "/shop?category=sharara-suit",
    },
    {
      image: "/images/banner-footwear.jpg",
      subtitle: "New Arrivals",
      title: "Punjabi Juttis",
      link: "/shop?category=punjabi-jutti",
    },
  ],
  saleBanner: {
    image: "/images/banner-sale.jpg",
    subtitle: "Limited Time Offer",
    title: "Season Sale",
    description: "Up to 40% off on selected items",
    cta: "Shop the Sale",
    link: "/shop",
  },
  instagramPosts: [
    { image: "/images/insta-1.jpg", link: "https://instagram.com/virsastyle" },
    { image: "/images/insta-2.jpg", link: "https://instagram.com/virsastyle" },
    { image: "/images/insta-3.jpg", link: "https://instagram.com/virsastyle" },
    { image: "/images/insta-4.jpg", link: "https://instagram.com/virsastyle" },
    { image: "/images/insta-5.jpg", link: "https://instagram.com/virsastyle" },
    { image: "/images/insta-6.jpg", link: "https://instagram.com/virsastyle" },
  ],
};

export function getHomepageContent(): HomepageContent {
  if (existsSync(CONTENT_FILE)) {
    try {
      return JSON.parse(readFileSync(CONTENT_FILE, "utf-8"));
    } catch {
      return DEFAULT_CONTENT;
    }
  }
  return DEFAULT_CONTENT;
}

export function saveHomepageContent(content: HomepageContent) {
  try {
    writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
    console.log("[Homepage Content] Saved successfully to:", CONTENT_FILE);
  } catch (error) {
    console.error("[Homepage Content] SAVE FAILED:", error);
    throw error;
  }
}
