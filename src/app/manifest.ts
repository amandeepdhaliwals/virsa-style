import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ਵਿਰਸਾ Style — Luxury Boutique",
    short_name: "ਵਿਰਸਾ Style",
    description: "Premium unstitched suits with custom tailoring, Punjabi juttis & footwear. Barnala, Punjab.",
    start_url: "/",
    display: "standalone",
    background_color: "#F9F5F0",
    theme_color: "#C48B9F",
    orientation: "portrait",
    categories: ["shopping", "fashion", "lifestyle"],
    icons: [
      {
        src: "/images/logo-vs.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/logo-vs.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
