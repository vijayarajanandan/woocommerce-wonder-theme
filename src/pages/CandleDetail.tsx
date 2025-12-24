import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Flame, Truck, RotateCcw, Shield, Heart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { getCandleBySlug, getFeaturedCandles } from "@/data/candles";
import { CandleCard } from "@/components/candle/CandleCard";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { ImageZoom } from "@/components/ui/image-zoom";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { RecentlyViewed } from "@/components/candle/RecentlyViewed";
import { FloatingProductCTA } from "@/components/candle/FloatingProductCTA";

const CandleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const candle = getCandleBySlug(slug || "");
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem: addToRecentlyViewed } = useRecentlyViewed();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const alsoLikeScrollRef = useRef<HTMLDivElement>(null);
  const addToCartRef = useRef<HTMLButtonElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (alsoLikeScrollRef.current) {
      const scrollAmount = 280;
      alsoLikeScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const relatedCandles = getFeaturedCandles().filter(c => c.slug !== slug).slice(0, 3);

  // Track recently viewed
  useEffect(() => {
    if (candle) {
      addToRecentlyViewed(candle);
    }
  }, [candle?.id]);

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
          {/* Breadcrumb */}
          <Link 
            to="/shop" 
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-10 text-xs uppercase tracking-[0.15em] transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" /> 
            Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <ScrollReveal direction="left">
              <div className="space-y-4">
                <ImageZoom
                  src={candle.images[selectedImage]}
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
                        className={`w-20 h-24 overflow-hidden border-2 transition-colors ${
                          selectedImage === i ? "border-primary" : "border-border/50 hover:border-border"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Details */}
            <ScrollReveal direction="right" delay={100}>
            <div className="lg:py-4">
              {/* Sleek Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {candle.bestseller && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] bg-background border border-primary/30 text-foreground px-3 py-1.5 font-medium rounded-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Bestseller
                  </span>
                )}
                {candle.onSale && candle.regularPrice && (
                  <span className="inline-flex items-center text-[10px] uppercase tracking-[0.08em] bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 font-medium rounded-sm">
                    Save {Math.round(((candle.regularPrice - candle.price) / candle.regularPrice) * 100)}%
                  </span>
                )}
                {candle.stockStatus === 'limited' && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] bg-muted border border-border text-muted-foreground px-3 py-1.5 font-medium rounded-sm">
                    Limited Stock
                  </span>
                )}
              </div>

              <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3 font-medium">
                {candle.collection}
              </p>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-3">
                {candle.name}
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground italic mb-6 lg:mb-8">
                {candle.tagline}
              </p>

              {/* Product Details - Show on mobile above price */}
              <div className="lg:hidden grid grid-cols-3 gap-2 mb-6">
                <div className="p-3 border border-border/30 text-center">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Size</p>
                  <p className="text-foreground font-medium text-sm">{candle.weight}</p>
                </div>
                <div className="p-3 border border-border/30 text-center">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Burn Time</p>
                  <p className="text-foreground font-medium text-sm">{candle.burnTime}</p>
                </div>
                <div className="p-3 border border-border/30 text-center">
                  <Flame className="h-4 w-4 mx-auto text-primary mb-1" />
                  <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Natural Soy</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 lg:gap-4 mb-4 lg:mb-6">
                <span className="font-display text-3xl lg:text-4xl text-foreground">{formatPrice(candle.price)}</span>
                {candle.regularPrice && (
                  <span className="text-lg lg:text-xl text-muted-foreground line-through">{formatPrice(candle.regularPrice)}</span>
                )}
              </div>

              {/* Mobile: Quantity & Add to Cart below price */}
              <div className="lg:hidden flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border/50">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-11 w-11 hover:text-primary"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-medium">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity((q) => q + 1)}
                      className="h-11 w-11 hover:text-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => toggleWishlist(candle)}
                    className={cn(
                      "px-4 h-11 flex-1",
                      isInWishlist(candle.id) && "text-primary border-primary/50 hover:text-primary"
                    )}
                  >
                    <Heart className={cn("h-5 w-5 mr-2", isInWishlist(candle.id) && "fill-current")} />
                    Wishlist
                  </Button>
                </div>
                <Button
                  ref={addToCartRef}
                  size="lg"
                  className="w-full h-12 text-base"
                  onClick={handleAddToCart}
                  disabled={candle.stockStatus === 'outofstock'}
                >
                  {candle.stockStatus === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>

              {/* Mobile: Trust Badges */}
              <div className="lg:hidden flex flex-wrap gap-4 py-4 border-y border-border/30 mb-6">
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

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6 lg:mb-8 text-sm lg:text-base">
                {candle.description}
              </p>

              {/* Fragrance Notes */}
              <div className="p-4 lg:p-6 bg-secondary/20 border border-border/30 mb-8">
                <h3 className="font-display text-base lg:text-lg text-foreground mb-4 lg:mb-5">Fragrance Notes</h3>
                <div className="space-y-3 lg:space-y-4 text-sm">
                  <div className="flex items-start">
                    <span className="w-16 lg:w-20 text-muted-foreground uppercase tracking-[0.15em] text-[10px] pt-0.5">Top</span>
                    <span className="text-foreground flex-1">{candle.fragranceNotes.top.join(" · ")}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-16 lg:w-20 text-muted-foreground uppercase tracking-[0.15em] text-[10px] pt-0.5">Heart</span>
                    <span className="text-foreground flex-1">{candle.fragranceNotes.heart.join(" · ")}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-16 lg:w-20 text-muted-foreground uppercase tracking-[0.15em] text-[10px] pt-0.5">Base</span>
                    <span className="text-foreground flex-1">{candle.fragranceNotes.base.join(" · ")}</span>
                  </div>
                </div>
              </div>

              {/* Desktop: Product Details after fragrance notes */}
              <div className="hidden lg:grid grid-cols-3 gap-3 mb-8">
                <div className="p-4 border border-border/30 text-center">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Size</p>
                  <p className="text-foreground font-medium">{candle.weight}</p>
                </div>
                <div className="p-4 border border-border/30 text-center">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Burn Time</p>
                  <p className="text-foreground font-medium">{candle.burnTime}</p>
                </div>
                <div className="p-4 border border-border/30 text-center">
                  <Flame className="h-5 w-5 mx-auto text-primary mb-2" />
                  <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">Natural Soy</p>
                </div>
              </div>

              {/* Desktop: Quantity & Add to Cart */}
              <div className="hidden lg:flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border/50">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-12 w-12 hover:text-primary"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity((q) => q + 1)}
                      className="h-12 w-12 hover:text-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => toggleWishlist(candle)}
                    className={cn(
                      "px-6 h-12",
                      isInWishlist(candle.id) && "text-primary border-primary/50 hover:text-primary"
                    )}
                  >
                    <Heart className={cn("h-5 w-5 mr-2", isInWishlist(candle.id) && "fill-current")} />
                    Wishlist
                  </Button>
                </div>
                <Button
                  ref={addToCartRef}
                  size="lg"
                  className="w-full h-14 text-base"
                  onClick={handleAddToCart}
                  disabled={candle.stockStatus === 'outofstock'}
                >
                  {candle.stockStatus === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>

              {/* Desktop: Trust Badges */}
              <div className="hidden lg:flex flex-wrap gap-4 py-6 border-y border-border/30 mt-6">
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
                  <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                    Discover More
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground">
                    You May Also Like
                  </h2>
                </div>
                <div className="flex gap-2 lg:hidden">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => scroll('left')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => scroll('right')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {/* Mobile: Scrollable, Desktop: Grid */}
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

        {/* Reviews Section */}
        <ReviewSection productId={candle.id} productName={candle.name} />

        {/* Recently Viewed */}
        <RecentlyViewed excludeId={candle.id} />
      </main>
      
      {/* Floating CTA */}
      <FloatingProductCTA candle={candle} triggerRef={addToCartRef} />
      
      <Footer />
    </div>
  );
};

export default CandleDetail;
