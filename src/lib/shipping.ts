// Shipping rates and delivery estimates

export const COUNTRIES = [
  { code: "IN", name: "India", zone: "domestic" },
  { code: "CA", name: "Canada", zone: "international" },
  { code: "US", name: "United States", zone: "international" },
  { code: "AU", name: "Australia", zone: "international" },
  { code: "NZ", name: "New Zealand", zone: "international" },
  { code: "GB", name: "United Kingdom", zone: "international" },
  { code: "AE", name: "UAE / Dubai", zone: "international" },
  { code: "SG", name: "Singapore", zone: "international" },
  { code: "MY", name: "Malaysia", zone: "international" },
  { code: "DE", name: "Germany", zone: "international" },
  { code: "IT", name: "Italy", zone: "international" },
  { code: "KW", name: "Kuwait", zone: "international" },
  { code: "QA", name: "Qatar", zone: "international" },
  { code: "SA", name: "Saudi Arabia", zone: "international" },
  { code: "OTHER", name: "Other Country", zone: "international" },
];

export type ShippingZone = "domestic" | "international";

export function getShippingZone(country: string): ShippingZone {
  if (!country || country === "India" || country === "IN") return "domestic";
  return "international";
}

export function getShippingRate(country: string, subtotal: number): { rate: number; freeAbove: number | null; label: string } {
  const zone = getShippingZone(country);

  if (zone === "domestic") {
    // India: Free above ₹999, else ₹79
    return {
      rate: subtotal >= 999 ? 0 : 79,
      freeAbove: 999,
      label: subtotal >= 999 ? "Free Shipping" : "₹79 (Free above ₹999)",
    };
  }

  // International: Flat ₹799, Free above ₹5000
  return {
    rate: subtotal >= 5000 ? 0 : 799,
    freeAbove: 5000,
    label: subtotal >= 5000 ? "Free International Shipping" : "₹799 (Free above ₹5,000)",
  };
}

export function getDeliveryEstimate(country: string): { min: number; max: number; label: string } {
  const zone = getShippingZone(country);

  if (zone === "domestic") {
    return { min: 3, max: 5, label: "3-5 business days" };
  }

  // International estimates by region
  const code = COUNTRIES.find((c) => c.name === country)?.code || "OTHER";

  const estimates: Record<string, { min: number; max: number }> = {
    CA: { min: 10, max: 14 },
    US: { min: 10, max: 14 },
    AU: { min: 12, max: 16 },
    NZ: { min: 12, max: 16 },
    GB: { min: 10, max: 14 },
    AE: { min: 7, max: 10 },
    SG: { min: 7, max: 10 },
    MY: { min: 7, max: 10 },
    KW: { min: 7, max: 10 },
    QA: { min: 7, max: 10 },
    SA: { min: 7, max: 10 },
    OTHER: { min: 14, max: 21 },
  };

  const est = estimates[code] || estimates.OTHER;
  return { ...est, label: `${est.min}-${est.max} business days` };
}

export function getStitchingDeliveryEstimate(country: string): string {
  const zone = getShippingZone(country);
  if (zone === "domestic") return "4-5 working days";
  return "Stitching 2 days + International shipping 10-16 days";
}
