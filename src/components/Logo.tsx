import Link from "next/link";

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "white" | "accent";
  href?: string;
  className?: string;
}

const sizes = {
  sm: { gurmukhi: "text-xl", style: "text-sm", gap: "gap-1" },
  md: { gurmukhi: "text-2xl md:text-3xl", style: "text-base md:text-lg", gap: "gap-1.5" },
  lg: { gurmukhi: "text-3xl md:text-4xl", style: "text-xl md:text-2xl", gap: "gap-2" },
  xl: { gurmukhi: "text-4xl md:text-5xl", style: "text-2xl md:text-3xl", gap: "gap-2" },
};

const variants = {
  dark: { gurmukhi: "text-luxury-dark", style: "text-accent" },
  white: { gurmukhi: "text-white", style: "text-accent-light" },
  accent: { gurmukhi: "text-accent", style: "text-accent-dark" },
};

export default function Logo({ size = "md", variant = "dark", href = "/", className = "" }: Props) {
  const s = sizes[size];
  const v = variants[variant];

  const content = (
    <span className={`flex items-baseline ${s.gap} ${className}`}>
      <span
        className={`${s.gurmukhi} ${v.gurmukhi} leading-none`}
        style={{ fontFamily: "'Gurmukhi', 'Noto Sans Gurmukhi', sans-serif", fontWeight: 600 }}
      >
        ਵਿਰਸਾ
      </span>
      <span
        className={`${s.style} ${v.style} leading-none`}
        style={{ fontFamily: "'PlayfairItalic', 'Playfair Display', Georgia, serif", fontStyle: "italic" }}
      >
        Style
      </span>
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
