import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.stitchingOption.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.admin.deleteMany();

  // Create admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.create({
    data: { email: "admin@virsastyle.com", password: hashedPassword, name: "Admin" },
  });
  console.log("Admin created: admin@virsastyle.com / admin123");

  // ===== CATEGORIES =====
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Punjabi Salwar Suit", slug: "punjabi-salwar-suit", description: "Traditional Punjabi salwar kameez suits with handwork and embroidery", order: 1, image: "/images/categories/cat-salwar.jpg" },
    }),
    prisma.category.create({
      data: { name: "Pant Plazo Suit", slug: "pant-plazo-suit", description: "Modern pant and plazo style suits for a contemporary look", order: 2, image: "/images/categories/cat-plazo.jpg" },
    }),
    prisma.category.create({
      data: { name: "Straight Plazo Suit", slug: "straight-plazo-suit", description: "Elegant straight cut suits with plazo bottoms", order: 3, image: "/images/products/plazo-3.jpg" },
    }),
    prisma.category.create({
      data: { name: "Sharara Suit", slug: "sharara-suit", description: "Royal sharara suits for weddings and celebrations", order: 4, image: "/images/categories/cat-sharara.jpg" },
    }),
    prisma.category.create({
      data: { name: "Gharara Suit", slug: "gharara-suit", description: "Traditional gharara suits with heavy embroidery", order: 5, image: "/images/products/sharara-4.jpg" },
    }),
    prisma.category.create({
      data: { name: "Pajami Suit", slug: "pajami-suit", description: "Classic pajami suits with elegant cuts", order: 6, image: "/images/products/pajami-1.jpg" },
    }),
    prisma.category.create({
      data: { name: "Punjabi Jutti", slug: "punjabi-jutti", description: "Handcrafted traditional Punjabi juttis", order: 7, image: "/images/categories/cat-jutti.jpg" },
    }),
    prisma.category.create({
      data: { name: "Boots", slug: "boots", description: "Stylish and comfortable boots", order: 8, image: "/images/categories/cat-boots.jpg" },
    }),
    prisma.category.create({
      data: { name: "Chappals", slug: "chappals", description: "Everyday comfort chappals and sandals", order: 9, image: "/images/products/chappal-1.jpg" },
    }),
    prisma.category.create({
      data: { name: "Dresses", slug: "dresses", description: "Ready-made designer dresses", order: 10, image: "/images/categories/cat-dress.jpg" },
    }),
  ]);

  console.log("Categories created:", categories.length);
  const [salwarCat, pantPlazoCat, straightPlazoCat, shararaCat, ghararaCat, pajamiCat, juttiCat, bootsCat, chappalsCat, dressesCat] = categories;

  // ===== PRODUCTS =====
  const products = [
    // PUNJABI SALWAR SUITS
    {
      name: "Phulkari Embroidered Salwar Suit",
      description: "Traditional Phulkari embroidered Punjabi salwar suit with vibrant threadwork. Unstitched fabric with rich cotton blend. A celebration of Punjab's heritage craftsmanship.",
      price: 3499, comparePrice: 4999,
      images: ["/images/products/salwar-1.jpg", "/images/products/salwar-2.jpg"],
      fabricImages: ["/images/products/fabric-1.jpg", "/images/products/fabric-2.jpg"],
      colors: ["Red & Yellow", "Blue & Pink", "Green & Orange"],
      categoryId: salwarCat.id, featured: true, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 800,
      fabricType: "Cotton Blend", suitPieces: "Kameez + Salwar + Dupatta",
      workType: "Phulkari Embroidery", washCare: "Dry Clean Recommended", deliveryDays: 4, stock: 25,
    },
    {
      name: "Cotton Patiala Salwar Suit",
      description: "Comfortable pure cotton Patiala salwar suit with printed dupatta. Perfect for daily wear with traditional Punjabi charm.",
      price: 1999, comparePrice: 2999,
      images: ["/images/products/salwar-3.jpg", "/images/products/salwar-4.jpg"],
      fabricImages: ["/images/products/fabric-3.jpg"],
      colors: ["Sky Blue", "Peach", "Mustard"],
      categoryId: salwarCat.id, featured: true, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 700,
      fabricType: "Pure Cotton", suitPieces: "Kameez + Patiala Salwar + Dupatta",
      workType: "Block Print", washCare: "Machine Wash", deliveryDays: 3, stock: 40,
    },
    {
      name: "Silk Embroidered Salwar Suit",
      description: "Premium silk salwar suit with heavy embroidery and sequin work. Perfect for weddings and festive occasions.",
      price: 5999, comparePrice: 7999,
      images: ["/images/products/salwar-5.jpg", "/images/products/salwar-6.jpg"],
      fabricImages: ["/images/products/fabric-4.jpg"],
      colors: ["Maroon & Gold", "Navy & Silver", "Emerald"],
      categoryId: salwarCat.id, featured: true, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 1000,
      fabricType: "Pure Silk", suitPieces: "Kameez + Salwar + Dupatta",
      workType: "Heavy Embroidery & Sequin", washCare: "Dry Clean Only", deliveryDays: 5, stock: 15,
    },

    // PANT PLAZO SUITS
    {
      name: "Georgette Pant Plazo Suit",
      description: "Elegant georgette pant plazo suit with delicate thread embroidery. Modern silhouette with traditional work.",
      price: 4299, comparePrice: 5999,
      images: ["/images/products/plazo-1.jpg", "/images/products/plazo-2.jpg"],
      fabricImages: ["/images/products/fabric-1.jpg"],
      colors: ["Dusty Rose", "Sage Green", "Lavender"],
      categoryId: pantPlazoCat.id, featured: true, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 900,
      fabricType: "Georgette", suitPieces: "Kameez + Pant Plazo + Dupatta",
      workType: "Thread Embroidery", washCare: "Dry Clean Recommended", deliveryDays: 4, stock: 20,
    },
    {
      name: "Rayon Printed Pant Suit",
      description: "Trendy rayon printed pant suit perfect for casual outings. Lightweight with vibrant prints.",
      price: 2499,
      images: ["/images/products/plazo-3.jpg", "/images/products/plazo-4.jpg"],
      fabricImages: ["/images/products/fabric-2.jpg"],
      colors: ["Teal", "Coral", "White & Blue"],
      categoryId: pantPlazoCat.id, featured: false, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 700,
      fabricType: "Rayon", suitPieces: "Kameez + Pant + Dupatta",
      workType: "Digital Print", washCare: "Machine Wash", deliveryDays: 3, stock: 35,
    },

    // STRAIGHT PLAZO SUIT
    {
      name: "Chanderi Silk Straight Plazo Suit",
      description: "Handwoven Chanderi silk straight cut suit with plazo bottom. Effortless grace for every occasion.",
      price: 4999,
      images: ["/images/products/plazo-2.jpg", "/images/products/plazo-1.jpg"],
      fabricImages: ["/images/products/fabric-3.jpg"],
      colors: ["Peach & Gold", "Mint Green"],
      categoryId: straightPlazoCat.id, featured: true, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 900,
      fabricType: "Chanderi Silk", suitPieces: "Straight Kameez + Plazo + Dupatta",
      workType: "Handloom Weaving", washCare: "Dry Clean Only", deliveryDays: 4, stock: 18,
    },

    // SHARARA SUITS
    {
      name: "Royal Silk Sharara Suit",
      description: "Premium silk sharara suit with mirror work and sequin embellishments. Royal elegance for weddings.",
      price: 7999, comparePrice: 10999,
      images: ["/images/products/sharara-1.jpg", "/images/products/sharara-2.jpg"],
      fabricImages: ["/images/products/fabric-4.jpg"],
      colors: ["Royal Blue & Gold", "Rani Pink", "Deep Purple"],
      categoryId: shararaCat.id, featured: true, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 1200,
      fabricType: "Pure Silk", suitPieces: "Kameez + Sharara + Dupatta",
      workType: "Mirror Work & Sequin", washCare: "Dry Clean Only", deliveryDays: 5, stock: 12,
    },
    {
      name: "Georgette Sharara Suit",
      description: "Flowing georgette sharara suit with elegant zari border. Perfect for festive gatherings.",
      price: 5499, comparePrice: 7499,
      images: ["/images/products/sharara-3.jpg", "/images/products/sharara-4.jpg"],
      fabricImages: ["/images/products/fabric-1.jpg"],
      colors: ["Magenta", "Teal Green", "Wine"],
      categoryId: shararaCat.id, featured: true, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 1000,
      fabricType: "Georgette", suitPieces: "Kameez + Sharara + Dupatta",
      workType: "Zari Border & Thread Work", washCare: "Dry Clean Recommended", deliveryDays: 4, stock: 20,
    },

    // GHARARA SUIT
    {
      name: "Banarasi Gharara Suit",
      description: "Exquisite Banarasi gharara suit with gold zari weaving. A timeless piece for celebrations.",
      price: 8999, comparePrice: 12999,
      images: ["/images/products/sharara-4.jpg", "/images/products/sharara-2.jpg"],
      fabricImages: ["/images/products/fabric-4.jpg", "/images/products/fabric-2.jpg"],
      colors: ["Red & Gold", "Green & Gold", "White & Silver"],
      categoryId: ghararaCat.id, featured: true, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 1200,
      fabricType: "Banarasi Silk", suitPieces: "Kameez + Gharara + Dupatta",
      workType: "Banarasi Zari Weaving", washCare: "Dry Clean Only", deliveryDays: 6, stock: 10,
    },

    // PAJAMI SUITS
    {
      name: "Silk Pajami Suit with Dupatta",
      description: "Classic silk pajami suit with heavy dupatta. Elegant and regal for festive occasions.",
      price: 6499, comparePrice: 8999,
      images: ["/images/products/pajami-1.jpg", "/images/products/pajami-2.jpg"],
      fabricImages: ["/images/products/fabric-3.jpg"],
      colors: ["Rani Pink", "Navy Blue", "Bottle Green"],
      categoryId: pajamiCat.id, featured: true, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 900,
      fabricType: "Pure Silk", suitPieces: "Kameez + Pajami + Dupatta",
      workType: "Gota Patti Work", washCare: "Dry Clean Only", deliveryDays: 5, stock: 15,
    },
    {
      name: "Cotton Pajami Suit Casual",
      description: "Lightweight cotton pajami suit for everyday elegance. Comfortable with beautiful prints.",
      price: 2299,
      images: ["/images/products/pajami-2.jpg", "/images/products/salwar-4.jpg"],
      fabricImages: ["/images/products/fabric-2.jpg"],
      colors: ["Yellow", "Pastel Pink", "Light Blue"],
      categoryId: pajamiCat.id, featured: false, productType: "SUIT",
      stitchingAvailable: true, baseStitchingPrice: 600,
      fabricType: "Cotton", suitPieces: "Kameez + Pajami + Dupatta",
      workType: "Printed", washCare: "Machine Wash", deliveryDays: 3, stock: 30,
    },

    // PUNJABI JUTTI
    {
      name: "Traditional Phulkari Jutti",
      description: "Handcrafted Phulkari embroidered Punjabi jutti with traditional motifs. Perfect with ethnic outfits.",
      price: 1299, comparePrice: 1799,
      images: ["/images/products/jutti-1.jpg", "/images/products/jutti-2.jpg"],
      sizes: ["6", "7", "8", "9", "10"], colors: ["Multi-Color", "Gold & Red", "Blue & Green"],
      categoryId: juttiCat.id, featured: true, productType: "FOOTWEAR", stock: 50,
    },
    {
      name: "Bridal Kundan Jutti",
      description: "Premium bridal jutti with kundan and stone work. Handcrafted for the perfect wedding day.",
      price: 2499, comparePrice: 3499,
      images: ["/images/products/jutti-2.jpg", "/images/products/jutti-1.jpg"],
      sizes: ["6", "7", "8", "9", "10"], colors: ["Gold", "Red & Gold", "Silver"],
      categoryId: juttiCat.id, featured: true, productType: "FOOTWEAR", stock: 30,
    },
    {
      name: "Velvet Embroidered Jutti",
      description: "Luxurious velvet jutti with fine embroidery. Comfortable cushioned sole for all-day wear.",
      price: 1599,
      images: ["/images/products/jutti-1.jpg", "/images/products/jutti-2.jpg"],
      sizes: ["6", "7", "8", "9", "10", "11"], colors: ["Maroon", "Black", "Navy"],
      categoryId: juttiCat.id, featured: false, productType: "FOOTWEAR", stock: 40,
    },

    // BOOTS
    {
      name: "Leather Ankle Boots",
      description: "Premium leather ankle boots with side zipper. Stylish and durable for all seasons.",
      price: 3999, comparePrice: 5499,
      images: ["/images/products/boots-1.jpg", "/images/products/boots-2.jpg"],
      sizes: ["6", "7", "8", "9", "10"], colors: ["Brown", "Black", "Tan"],
      categoryId: bootsCat.id, featured: true, productType: "FOOTWEAR", stock: 25,
    },
    {
      name: "Block Heel Boots",
      description: "Comfortable block heel boots with cushioned insole. Perfect for long wear.",
      price: 2999,
      images: ["/images/products/boots-2.jpg", "/images/products/boots-1.jpg"],
      sizes: ["6", "7", "8", "9", "10"], colors: ["Black", "Wine"],
      categoryId: bootsCat.id, featured: false, productType: "FOOTWEAR", stock: 20,
    },

    // CHAPPALS
    {
      name: "Embroidered Flat Chappal",
      description: "Comfortable flat chappal with traditional embroidery. Everyday comfort with ethnic touch.",
      price: 899, comparePrice: 1299,
      images: ["/images/products/chappal-1.jpg", "/images/products/chappal-2.jpg"],
      sizes: ["6", "7", "8", "9", "10"], colors: ["Brown", "Black", "Cream"],
      categoryId: chappalsCat.id, featured: true, productType: "FOOTWEAR", stock: 60,
    },
    {
      name: "Kolhapuri Chappal",
      description: "Authentic Kolhapuri style leather chappal. Handcrafted with genuine leather.",
      price: 1499,
      images: ["/images/products/chappal-2.jpg", "/images/products/chappal-1.jpg"],
      sizes: ["6", "7", "8", "9", "10", "11"], colors: ["Natural Tan", "Brown"],
      categoryId: chappalsCat.id, featured: false, productType: "FOOTWEAR", stock: 35,
    },

    // DRESSES
    {
      name: "Anarkali Floor Length Dress",
      description: "Stunning Anarkali style floor length dress with heavy embroidery. Ready to wear for parties.",
      price: 6999, comparePrice: 9999,
      images: ["/images/products/dress-1.jpg", "/images/products/dress-2.jpg"],
      sizes: ["S", "M", "L", "XL"], colors: ["Royal Blue", "Maroon", "Black"],
      categoryId: dressesCat.id, featured: true, productType: "DRESS", stock: 15,
    },
    {
      name: "Floral Print Kurti Dress",
      description: "Beautiful floral print kurti style dress. Comfortable A-line cut for casual and festive wear.",
      price: 1999, comparePrice: 2999,
      images: ["/images/products/dress-2.jpg", "/images/products/dress-1.jpg"],
      sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Pink Floral", "Yellow Floral", "Blue Floral"],
      categoryId: dressesCat.id, featured: true, productType: "DRESS", stock: 30,
    },
  ];

  for (const product of products) {
    const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await prisma.product.create({
      data: { ...product, slug, sizes: product.sizes || [], fabricImages: product.fabricImages || [], inStock: true } as Parameters<typeof prisma.product.create>[0]["data"],
    });
  }
  console.log("Products created:", products.length);

  // ===== STITCHING OPTIONS =====
  const stitchingOptions = [
    { category: "NECK", name: "Round Neck", price: 0, isDefault: true, order: 1 },
    { category: "NECK", name: "V-Neck", price: 0, isDefault: false, order: 2 },
    { category: "NECK", name: "Square Neck", price: 0, isDefault: false, order: 3 },
    { category: "NECK", name: "Boat Neck", price: 100, isDefault: false, order: 4 },
    { category: "NECK", name: "Chinese Collar", price: 150, isDefault: false, order: 5 },
    { category: "NECK", name: "Sweetheart Neck", price: 100, isDefault: false, order: 6 },
    { category: "NECK", name: "High Neck", price: 100, isDefault: false, order: 7 },
    { category: "SLEEVE", name: "Full Sleeve", price: 0, isDefault: true, order: 1 },
    { category: "SLEEVE", name: "3/4 Sleeve", price: 0, isDefault: false, order: 2 },
    { category: "SLEEVE", name: "Half Sleeve", price: 0, isDefault: false, order: 3 },
    { category: "SLEEVE", name: "Sleeveless", price: 0, isDefault: false, order: 4 },
    { category: "SLEEVE", name: "Bell Sleeve", price: 150, isDefault: false, order: 5 },
    { category: "SLEEVE", name: "Puff Sleeve", price: 200, isDefault: false, order: 6 },
    { category: "EXTRA", name: "Lining", price: 200, isDefault: false, order: 1 },
    { category: "EXTRA", name: "Canvas Padding", price: 250, isDefault: false, order: 2 },
    { category: "EXTRA", name: "Side Pocket", price: 100, isDefault: false, order: 3 },
    { category: "EXTRA", name: "Piping", price: 150, isDefault: false, order: 4 },
  ];

  for (const opt of stitchingOptions) {
    await prisma.stitchingOption.create({ data: opt });
  }
  console.log("Stitching options created:", stitchingOptions.length);
  console.log("\n✅ Seed complete! Your boutique is ready.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
