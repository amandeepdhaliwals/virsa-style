import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/components/Providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "ਵਿਰਸਾ Style | Luxury Boutique — Suits, Juttis & Custom Stitching",
    template: "%s | ਵਿਰਸਾ Style",
  },
  description:
    "ਵਿਰਸਾ Style — Luxury boutique in Barnala, Punjab. Shop premium unstitched suits with custom tailoring, Punjabi juttis, boots & chappals. Free shipping above ₹999.",
  keywords: [
    "Punjabi suits",
    "custom stitching",
    "unstitched suits",
    "Punjabi jutti",
    "sharara suit",
    "gharara suit",
    "salwar suit",
    "Barnala boutique",
    "women's clothing Punjab",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "ਵਿਰਸਾ Style",
    title: "ਵਿਰਸਾ Style | Luxury Boutique — Suits, Juttis & Custom Stitching",
    description:
      "Luxury boutique in Barnala, Punjab. Premium unstitched suits with custom tailoring, handcrafted Punjabi juttis & footwear.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#C48B9F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/images/logo-vs.png" />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <GoogleAnalytics />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
