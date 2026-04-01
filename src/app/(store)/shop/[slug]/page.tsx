import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "@/components/ProductDetail";

interface Props {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) return { title: "Product Not Found | ਵਿਰਸਾ Style" };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return {
    title: `${product.name} | ਵਿਰਸਾ Style`,
    description: product.description || `Shop ${product.name} from ${product.category.name} collection at ਵਿਰਸਾ Style. Premium women's fashion.`,
    openGraph: {
      title: `${product.name} — ₹${product.price.toLocaleString("en-IN")}${discount > 0 ? ` (${discount}% off)` : ""}`,
      description: product.description || `Premium ${product.category.name} from ਵਿਰਸਾ Style`,
      images: product.images[0] ? [{ url: product.images[0], width: 800, height: 1000 }] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      inStock: true,
    },
    include: { category: true },
    take: 4,
  });

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    category: product.category.name,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice,
          images: product.images,
          fabricImages: product.fabricImages,
          sizes: product.sizes,
          colors: product.colors,
          category: product.category.name,
          inStock: product.inStock,
          stock: product.stock,
          createdAt: product.createdAt.toISOString(),
          productType: product.productType,
          stitchingAvailable: product.stitchingAvailable,
          baseStitchingPrice: product.baseStitchingPrice,
          fabricType: product.fabricType,
          suitPieces: product.suitPieces,
          workType: product.workType,
          washCare: product.washCare,
          deliveryDays: product.deliveryDays,
        }}
        relatedProducts={relatedProducts.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          comparePrice: p.comparePrice,
          image: p.images[0] || "",
          category: p.category.name,
        }))}
      />
    </>
  );
}
