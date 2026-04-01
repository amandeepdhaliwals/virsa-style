import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";

export const dynamic = "force-dynamic";

const PRODUCTS_PER_PAGE = 12;

interface Props {
  searchParams: {
    category?: string;
    sort?: string;
    search?: string;
    size?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}

export default async function ShopPage({ searchParams }: Props) {
  const { category, sort, search, size, color, minPrice, maxPrice, page } = searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  // Build where clause
  const where: Record<string, unknown> = { inStock: true, status: "ACTIVE" };

  if (category) {
    where.category = { slug: category };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (size) {
    where.sizes = { has: size };
  }
  if (color) {
    where.colors = { has: color };
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
  }

  // Sort
  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  // Get total count for pagination
  const totalProducts = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
    skip: (currentPage - 1) * PRODUCTS_PER_PAGE,
    take: PRODUCTS_PER_PAGE,
  });

  // Get all available sizes and colors for filters
  const allProducts = await prisma.product.findMany({
    where: { inStock: true, status: "ACTIVE" },
    select: { sizes: true, colors: true },
  });

  const allSizes = [...new Set(allProducts.flatMap((p) => p.sizes))].sort();
  const allColors = [...new Set(allProducts.flatMap((p) => p.colors))].sort();

  // Build pagination URLs
  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (search) params.set("search", search);
    if (size) params.set("size", size);
    if (color) params.set("color", color);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (p > 1) params.set("page", p.toString());
    return `/shop?${params.toString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.4em] uppercase text-accent mb-2">
          Collection
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark">
          {search
            ? `Results for "${search}"`
            : category
            ? categories.find((c) => c.slug === category)?.name || "Shop"
            : "All Products"}
        </h1>
        <p className="text-luxury-text/60 mt-2 text-sm">
          {totalProducts} {totalProducts === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Filters */}
      <ShopFilters
        categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
        currentCategory={category}
        currentSort={sort}
        allSizes={allSizes}
        allColors={allColors}
        currentSize={size}
        currentColor={color}
        currentMinPrice={minPrice}
        currentMaxPrice={maxPrice}
      />

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                comparePrice={product.comparePrice}
                image={product.images[0] || ""}
                category={product.category.name}
                stock={product.stock}
                createdAt={product.createdAt.toISOString()}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {currentPage > 1 && (
                <Link
                  href={buildPageUrl(currentPage - 1)}
                  className="px-4 py-2 text-xs tracking-wider uppercase border border-pastel-pink text-luxury-text hover:border-accent hover:text-accent transition-colors"
                >
                  Previous
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildPageUrl(p)}
                  className={`w-10 h-10 flex items-center justify-center text-xs transition-colors ${
                    p === currentPage
                      ? "bg-accent text-white"
                      : "border border-pastel-pink text-luxury-text hover:border-accent"
                  }`}
                >
                  {p}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link
                  href={buildPageUrl(currentPage + 1)}
                  className="px-4 py-2 text-xs tracking-wider uppercase border border-pastel-pink text-luxury-text hover:border-accent hover:text-accent transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-luxury-text/60 text-lg mb-4">No products found.</p>
          {(category || search || size || color || minPrice || maxPrice) && (
            <Link href="/shop" className="btn-outline-luxury inline-block">
              Clear Filters
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
