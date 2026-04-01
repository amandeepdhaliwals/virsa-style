"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Check, Ruler, Flame, Scissors, Package } from "lucide-react";
import { useCartStore } from "@/store/cart";
import ProductCard from "./ProductCard";
import ReviewSection from "./ReviewSection";
import WishlistButton from "./WishlistButton";
import ImageLightbox from "./ImageLightbox";
import ShareProduct from "./ShareProduct";
import DeliveryEstimate from "./DeliveryEstimate";
import StitchingCustomizer from "./StitchingCustomizer";
import MeasurementForm from "./MeasurementForm";
import WhatsAppReference from "./WhatsAppReference";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string[];
  fabricImages?: string[];
  sizes: string[];
  colors: string[];
  category: string;
  inStock: boolean;
  stock?: number;
  createdAt?: string;
  productType?: string;
  stitchingAvailable?: boolean;
  baseStitchingPrice?: number;
  fabricType?: string;
  suitPieces?: string;
  workType?: string;
  washCare?: string;
  deliveryDays?: number;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  category: string;
}

interface Props {
  product: Product;
  relatedProducts: RelatedProduct[];
}

export default function ProductDetail({ product, relatedProducts }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showFabricImages, setShowFabricImages] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // Stitching state
  const [stitchingData, setStitchingData] = useState({
    wantStitching: false,
    stitchingPrice: 0,
    customizations: {} as Record<string, string>,
  });
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [designReference, setDesignReference] = useState("");

  const isSuit = product.productType === "SUIT";
  const isFootwear = product.productType === "FOOTWEAR";

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const isNew = product.createdAt
    ? (Date.now() - new Date(product.createdAt).getTime()) < 14 * 24 * 60 * 60 * 1000
    : false;
  const lowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 10;

  // Total price calculation
  const basePrice = product.price;
  const stitchingPrice = stitchingData.wantStitching ? stitchingData.stitchingPrice : 0;
  const totalPrice = basePrice + stitchingPrice;

  // Combined images for display
  const displayImages = showFabricImages && product.fabricImages?.length
    ? product.fabricImages
    : product.images;
  const allImages = [...product.images, ...(product.fabricImages || [])];

  const handleAddToCart = () => {
    const cartItem: Parameters<typeof addItem>[0] & {
      wantStitching?: boolean;
      stitchingPrice?: number;
      customizations?: string;
      measurements?: string;
      designReference?: string;
    } = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: totalPrice,
      image: product.images[0] || "",
      size: isFootwear ? selectedSize : undefined,
      color: selectedColor,
      quantity,
    };

    if (isSuit && stitchingData.wantStitching) {
      cartItem.wantStitching = true;
      cartItem.stitchingPrice = stitchingData.stitchingPrice;
      cartItem.customizations = JSON.stringify(stitchingData.customizations);
      cartItem.measurements = JSON.stringify(measurements);
      cartItem.designReference = designReference;
    }

    addItem(cartItem);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-luxury-text/50 mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="hover:text-accent transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-luxury-dark truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-[3/4] bg-pastel-cream overflow-hidden mb-4 group cursor-pointer">
              <img
                src={displayImages[selectedImage] || product.images[0] || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                {discount > 0 && (
                  <span className="bg-accent text-white text-[10px] tracking-wider uppercase px-3 py-1">
                    {discount}% Off
                  </span>
                )}
                {isNew && (
                  <span className="bg-green-600 text-white text-[10px] tracking-wider uppercase px-3 py-1">
                    New
                  </span>
                )}
                {isSuit && (
                  <span className="bg-luxury-dark text-white text-[10px] tracking-wider uppercase px-3 py-1 flex items-center gap-1">
                    <Scissors size={10} /> Stitching Available
                  </span>
                )}
              </div>
              <ImageLightbox
                images={allImages}
                selectedIndex={selectedImage}
                productName={product.name}
              />
            </div>

            {/* Image toggles for suits */}
            {isSuit && product.fabricImages && product.fabricImages.length > 0 && (
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => { setShowFabricImages(false); setSelectedImage(0); }}
                  className={`text-[10px] tracking-wider uppercase px-4 py-2 transition-colors ${
                    !showFabricImages ? "bg-accent text-white" : "bg-pastel-cream text-luxury-text hover:bg-pastel-pink"
                  }`}
                >
                  Stitched Look
                </button>
                <button
                  onClick={() => { setShowFabricImages(true); setSelectedImage(0); }}
                  className={`text-[10px] tracking-wider uppercase px-4 py-2 transition-colors ${
                    showFabricImages ? "bg-accent text-white" : "bg-pastel-cream text-luxury-text hover:bg-pastel-pink"
                  }`}
                >
                  Fabric / Material
                </button>
              </div>
            )}

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square bg-pastel-cream overflow-hidden ${
                      i === selectedImage ? "ring-2 ring-accent" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-xs tracking-[0.3em] uppercase text-accent mb-2">
              {product.category}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-luxury-dark mb-4">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-medium text-luxury-dark">
                ₹{basePrice.toLocaleString("en-IN")}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-lg text-luxury-text/40 line-through">
                    ₹{product.comparePrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm bg-accent/10 text-accent font-medium px-2 py-0.5">
                    {discount}% Off
                  </span>
                </>
              )}
            </div>

            {/* Price label */}
            {isSuit && (
              <p className="text-xs text-luxury-text/50 mb-4">
                {stitchingData.wantStitching
                  ? <>Fabric ₹{basePrice.toLocaleString("en-IN")} + Stitching ₹{stitchingPrice.toLocaleString("en-IN")} = <strong className="text-luxury-dark">₹{totalPrice.toLocaleString("en-IN")}</strong></>
                  : "Unstitched fabric price"
                }
              </p>
            )}

            {/* Low stock */}
            {lowStock && (
              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 mb-4">
                <Flame size={16} />
                Hurry! Only {product.stock} left in stock
              </div>
            )}

            {product.description && (
              <p className="text-luxury-text leading-relaxed mb-4 text-sm">
                {product.description}
              </p>
            )}

            {/* Suit Details */}
            {isSuit && (
              <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                {product.fabricType && (
                  <div className="bg-pastel-cream px-3 py-2.5">
                    <span className="text-luxury-text/50 block">Fabric</span>
                    <span className="text-luxury-dark font-medium">{product.fabricType}</span>
                  </div>
                )}
                {product.suitPieces && (
                  <div className="bg-pastel-cream px-3 py-2.5">
                    <span className="text-luxury-text/50 block">Includes</span>
                    <span className="text-luxury-dark font-medium">{product.suitPieces}</span>
                  </div>
                )}
                {product.workType && (
                  <div className="bg-pastel-cream px-3 py-2.5">
                    <span className="text-luxury-text/50 block">Work</span>
                    <span className="text-luxury-dark font-medium">{product.workType}</span>
                  </div>
                )}
                {product.washCare && (
                  <div className="bg-pastel-cream px-3 py-2.5">
                    <span className="text-luxury-text/50 block">Wash Care</span>
                    <span className="text-luxury-dark font-medium">{product.washCare}</span>
                  </div>
                )}
              </div>
            )}

            {/* Sizes — only for footwear */}
            {isFootwear && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs tracking-[0.2em] uppercase text-luxury-text">
                    Size {selectedSize && <span className="text-accent ml-1">— {selectedSize}</span>}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] h-12 px-3 text-sm border transition-colors ${
                        selectedSize === size
                          ? "border-accent bg-accent text-white"
                          : "border-pastel-rose text-luxury-text hover:border-accent"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mb-5">
                <p className="text-xs tracking-[0.2em] uppercase text-luxury-text mb-3">
                  Color {selectedColor && <span className="text-accent ml-1">— {selectedColor}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedColor === color
                          ? "border-accent bg-accent text-white"
                          : "border-pastel-rose text-luxury-text hover:border-accent"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stitching Customizer — only for suits */}
            {isSuit && product.stitchingAvailable && product.baseStitchingPrice && (
              <>
                <StitchingCustomizer
                  productId={product.id}
                  baseStitchingPrice={product.baseStitchingPrice}
                  onStitchingChange={setStitchingData}
                />

                {/* Measurement form — shows when stitching is selected */}
                {stitchingData.wantStitching && (
                  <>
                    <MeasurementForm onMeasurementsChange={setMeasurements} />
                    <WhatsAppReference
                      productName={product.name}
                      onReferenceNote={setDesignReference}
                    />
                  </>
                )}
              </>
            )}

            {/* Delivery time for suits */}
            {isSuit && stitchingData.wantStitching && product.deliveryDays && (
              <div className="flex items-center gap-2 text-xs text-luxury-text bg-pastel-cream px-3 py-2 mt-3">
                <Package size={14} className="text-accent" />
                Estimated delivery: <strong>{product.deliveryDays}-{product.deliveryDays + 2} days</strong> (includes stitching time)
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-6 mb-4">
              <WishlistButton productId={product.id} size={20} className="p-3 border border-pastel-rose hover:border-accent transition-colors" />
              <ShareProduct name={product.name} slug={product.slug} price={product.price} />
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-pastel-rose">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-luxury-text hover:text-accent"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 h-12 flex items-center justify-center text-sm border-x border-pastel-rose">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-luxury-text hover:text-accent"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm tracking-[0.2em] uppercase transition-all duration-300 ${
                  added
                    ? "bg-green-600 text-white"
                    : product.inStock
                    ? "bg-accent text-white hover:bg-accent-dark"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {added ? (
                  <><Check size={16} /> Added to Cart</>
                ) : product.inStock ? (
                  <><ShoppingBag size={16} /> Add to Cart</>
                ) : (
                  "Out of Stock"
                )}
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-4 mt-6 text-[11px] text-luxury-text/50">
              <span className="flex items-center gap-1">✓ Free shipping above ₹999</span>
              <span className="flex items-center gap-1">✓ Prepaid orders only</span>
              {isFootwear && <span className="flex items-center gap-1">✓ 7-day easy returns</span>}
              {isSuit && <span className="flex items-center gap-1">✗ No returns on stitched suits</span>}
              {isSuit && <span className="flex items-center gap-1">✓ Expert tailoring</span>}
              {!isSuit && !isFootwear && <span className="flex items-center gap-1">✓ 7-day returns</span>}
            </div>
            {isSuit && (
              <p className="text-[10px] text-orange-600/70 mt-2">
                Note: Stitched suits are custom-made and non-returnable. Unstitched fabric can be returned within 7 days if unused.
              </p>
            )}

            {/* Delivery Estimate */}
            <DeliveryEstimate />
          </div>
        </div>

        {/* Reviews */}
        <ReviewSection productId={product.id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-2xl text-luxury-dark mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug}
                  price={p.price} comparePrice={p.comparePrice} image={p.image} category={p.category} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile Add to Cart — sits above bottom nav */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-pastel-pink p-3 flex items-center gap-3 z-40 lg:hidden">
        <div className="flex-1">
          <p className="text-lg font-medium text-luxury-dark">
            ₹{totalPrice.toLocaleString("en-IN")}
          </p>
          {isSuit && stitchingData.wantStitching && (
            <p className="text-[10px] text-accent">incl. stitching</p>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`px-8 py-3 flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-colors ${
            added ? "bg-green-600 text-white"
              : product.inStock ? "bg-accent text-white hover:bg-accent-dark"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          {added ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add to Cart</>}
        </button>
      </div>
      <div className="h-36 lg:hidden" />
    </>
  );
}
