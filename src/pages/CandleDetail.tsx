/**
 * Candle Detail Page - WooCommerce Enabled
 * 
 * Uses WooCommerce hooks with fallback to static data.
 * All original UI preserved exactly.
 */

import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Flame, Truck, RotateCcw, Shield, Heart, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { CandleCard } from "@/components/candle/CandleCard";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { ImageZoom } from "@/components/ui/image-zoom";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { RecentlyViewed } from "@/components/candle/RecentlyViewed";
import { FloatingProductCTA } from "@/components/candle/FloatingProductCTA";

// Import both static and WooCommerce data sources
import { getCandleBySlug as getStaticCandle, getFeaturedCandles as getStaticFeatured, isWooCommerceEnabled } from "@/data/candles";
import { useProductBySlug, useFeaturedProducts, useRelatedProducts } from "@/hooks/useWooCommerce";

// Loading skeleton for the product detail
const ProductDetailSkeleton = () => (
  <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="flex gap-3">
        <Skeleton className="w-20 h-24" />
        <Skeleton className="w-20 h-24" />
        <Skeleton className="w-20 h-24" />
      </div>
    </div>
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 flex-1" />
        <Skeleton className="h-12 w-12" />
      </div>
    </div>
  </div>
);

const CandleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem: addToRecentlyViewed } = useRecentlyViewed();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const alsoLikeScrollRef = useRef<HTMLDivElement>(null);
  const addToCartRef = useRef<HTMLButtonElement>(null);

  // Check if WooCommerce is enabled
  const isWC = isWooCommerceEnabled();

  // Fetch from WooCommerce if enabled
  const { 
    data: wcCandle, 
    isLoading: isLoadingWC,
    error: wcError,
  } = useProductBySlug(slug);
  
  const { 
    data: wcFeatured,
    isLoading: isLoadingRelated,
  } = useFeaturedProducts(4);

  // Use WooCommerce data if available, otherwise static
  const candle = isWC && wcCandle ? wcCandle : getStaticCandle(slug || "");
  const isLoading = isWC && isLoadingWC;

  // Get related candles
  const relatedCandles = (() => {
    if (isWC && wcFeatured) {
      return wcFeatured.filter(c => c.slug !== slug).slice(0, 3);
    }
    return getStaticFeatured().filter(c => c.slug !== slug).slice(0, 3);
  })();

  const scroll = (direction: 'left' | 'right') => {
    if (alsoLikeScrollRef.current) {
      const scrollAmount = 280;
      alsoLikeScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Add to recently viewed when candle loads
  useEffect(() => {
    if (candle) {
      addToRecentlyViewed(candle);
    }
  }, [candle?.id]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-[137px]">
          <div className="container mx-auto px-6 lg:px-12 py-12">
            <Skeleton className="h-4 w-32 mb-10" />
            <ProductDetailSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!candle) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="font-display text-4xl text-foreground mb-4">Candle not found</h1>
            <p className="text-muted-foreground mb-8">The candle you're looking for doesn't exist.</p>
            <Button asChild variant="gold">
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(candle, quantity);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[137px]">
        <div className="container mx-auto px-6 lg:px-12 py-12">
          <Link 
            to="/shop" 
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-10 text-xs uppercase tracking-[0.15em] transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" /> 
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <ScrollReveal direction="left">
              <div className="space-y-4">
                <ImageZoom 
                  src={candle.images[selectedImage] || '/placeholder.jpg'} 
                  alt={candle.name} 
                  className="aspect-[3/4] bg-secondary/30" 
                  zoomScale={2.5} 
                />
                {candle.images.length > 1 && (
                  <div className="flex gap-3">
                    {candle.images.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedImage(i)} 
                        className={`w-20 h-24 overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-primary" : "border-border/50 hover:border-border"}`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={100}>
              <div className="lg:py-4">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {candle.bestseller && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] bg-background border border-primary/30 text-foreground px-3 py-1.5 font-medium rounded-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />Bestseller
                    </span>
                  )}
                  {candle.onSale && candle.regularPrice && (
                    <span className="inline-flex items-center text-[10px] uppercase tracking-[0.08em] bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 font-medium rounded-sm">
                      Save {Math.round(((candle.regularPrice - candle.price) / candle.regularPrice) * 100)}%
                    </span>
                  )}
                  {isWC && (
                    <span className="inline-flex items-center text-[10px] uppercase tracking-[0.08em] bg-green-500/10 border border-green-500/20 text-green-500 px-3 py-1.5 font-medium rounded-sm">
                      Live Stock
                    </span>
                  )}
                </div>

                <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3 font-medium">{candle.collection}</p>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-3">{candle.name}</h1>
                <p className="text-base lg:text-lg text-muted-foreground italic mb-6 lg:mb-8">{candle.tagline}</p>

                <div className="flex flex-col gap-6">
                  {/* Price */}
                  <div className="order-1">
                    <div className="flex items-baseline gap-3 lg:gap-4">
                      <span className="font-display text-2xl lg:text-4xl text-foreground">{formatPrice(candle.price)}</span>
                      {candle.regularPrice && (
                        <span className="text-base lg:text-xl text-muted-foreground line-through">{formatPrice(candle.regularPrice)}</span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="order-2 lg:order-4">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="flex items-center border border-border/50 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="h-10 w-10 lg:h-12 lg:w-12 hover:text-primary"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 lg:w-12 text-center font-medium text-sm">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="h-10 w-10 lg:h-12 lg:w-12 hover:text-primary"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        ref={addToCartRef}
                        size="lg"
                        className="flex-1 h-10 lg:h-12 text-xs lg:text-base px-3 lg:px-6"
                        onClick={handleAddToCart}
                        disabled={candle.stockStatus === "outofstock"}
                      >
                        {candle.stockStatus === "outofstock" ? "Out of Stock" : "Add to Cart"}
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleWishlist(candle)}
                        className={cn(
                          "h-10 w-10 lg:h-12 lg:w-12 shrink-0",
                          isInWishlist(candle.id) && "text-primary border-primary/50 hover:text-primary"
                        )}
                      >
                        <Heart className={cn("h-4 w-4 lg:h-5 lg:w-5", isInWishlist(candle.id) && "fill-current")} />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="order-3 lg:order-2 text-muted-foreground leading-relaxed text-sm lg:text-base">
                    {candle.description}
                  </p>

                  {/* Fragrance Profile */}
                  <div className="order-4 lg:order-3">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                      Fragrance Profile
                    </h3>

                    {/* Mobile layout */}
                    <div className="lg:hidden grid grid-cols-3 gap-2">
                      <div className="p-2 bg-secondary/20 border border-border/20 text-center">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-primary/80 mb-1">Top</p>
                        <p className="text-[10px] text-foreground leading-snug">{candle.fragranceNotes.top.join(", ")}</p>
                      </div>
                      <div className="p-2 bg-secondary/20 border border-border/20 text-center">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-primary/80 mb-1">Heart</p>
                        <p className="text-[10px] text-foreground leading-snug">{candle.fragranceNotes.heart.join(", ")}</p>
                      </div>
                      <div className="p-2 bg-secondary/20 border border-border/20 text-center">
                        <p className="text-[9px] uppercase tracking-[0.15em] text-primary/80 mb-1">Base</p>
                        <p className="text-[10px] text-foreground leading-snug">{candle.fragranceNotes.base.join(", ")}</p>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden lg:block border border-border/20 bg-secondary/20 p-6">
                      <div className="text-center mb-4 pb-4 border-b border-border/20">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-primary mb-2">Top</p>
                        <p className="text-base text-foreground leading-snug">{candle.fragranceNotes.top.join(", ")}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-primary/80 mb-2">Heart</p>
                          <p className="text-sm text-foreground leading-snug">{candle.fragranceNotes.heart.join(", ")}</p>
                        </div>
                        <div className="text-center border-l border-border/20 pl-4">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-primary/80 mb-2">Base</p>
                          <p className="text-sm text-foreground leading-snug">{candle.fragranceNotes.base.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-3 gap-2 lg:gap-3 mt-6 lg:mt-8 mb-6">
                  <div className="p-3 lg:p-4 border border-border/30 text-center">
                    <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1 lg:mb-2">Size</p>
                    <p className="text-foreground font-medium text-sm">{candle.weight}</p>
                  </div>
                  <div className="p-3 lg:p-4 border border-border/30 text-center">
                    <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1 lg:mb-2">Burn Time</p>
                    <p className="text-foreground font-medium text-sm">{candle.burnTime}</p>
                  </div>
                  <div className="p-3 lg:p-4 border border-border/30 text-center">
                    <Flame className="h-4 w-4 lg:h-5 lg:w-5 mx-auto text-primary mb-1 lg:mb-2" />
                    <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Natural Soy</p>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 py-4 lg:py-6 border-y border-border/30">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span className="text-[10px] uppercase tracking-wider">Free Ship ₹2000+</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RotateCcw className="h-4 w-4" />
                    <span className="text-[10px] uppercase tracking-wider">Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span className="text-[10px] uppercase tracking-wider">Secure Checkout</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Related Products */}
        {relatedCandles.length > 0 && (
          <section className="py-16 lg:py-24 border-t border-border/30 bg-secondary/10">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="flex items-center justify-between mb-12 lg:mb-16">
                <div className="text-center lg:text-left flex-1">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">Discover More</p>
                  <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground">You May Also Like</h2>
                </div>
                <div className="flex gap-2 lg:hidden">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => scroll('left')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => scroll('right')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div 
                ref={alsoLikeScrollRef} 
                className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-8 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none max-w-5xl lg:mx-auto" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {relatedCandles.map((c, index) => (
                  <div key={c.id} className="flex-shrink-0 w-[260px] lg:w-full snap-start">
                    <CandleCard candle={c} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <ReviewSection productId={candle.id} productName={candle.name} />
        <RecentlyViewed excludeId={candle.id} />
      </main>
      
      <FloatingProductCTA candle={candle} triggerRef={addToCartRef} />
      <Footer />
    </div>
  );
};

export default CandleDetail;
