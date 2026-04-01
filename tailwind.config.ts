import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pastel: {
          pink: "#F8E8EE",
          lavender: "#E8E0F0",
          cream: "#FFF8F0",
          rose: "#F2D1D1",
          blush: "#FAE3E3",
          lilac: "#D4C5E2",
          peach: "#FDDCCC",
          soft: "#F9F5F0",
        },
        accent: {
          DEFAULT: "#C48B9F",
          dark: "#A06B7F",
          light: "#E8B4C8",
        },
        luxury: {
          gold: "#C9A96E",
          dark: "#2D2D2D",
          text: "#4A4A4A",
          light: "#F7F4EF",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
