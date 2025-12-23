import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, Minus, Plus, Flame, Truck, RotateCcw, Shield } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { getCandleBySlug, getFeaturedCandles } from "@/data/candles";
import { CandleCard } from "@/components/candle/CandleCard";

const CandleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const candle = getCandleBySlug(slug || "");
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const relatedCandles = getFeaturedCandles().filter(c => c.slug !== slug).slice(0, 3);

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
      <main className="flex-1 pt-20">
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
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-secondary/30 overflow-hidden">
                <img
                  src={candle.images[selectedImage]}
                  alt={candle.name}
                  className="w-full h-full object-cover"
                />
              </div>
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

            {/* Details */}
            <div className="lg:py-4">
              {/* Badges */}
              <div className="flex gap-3 mb-6">
                {candle.bestseller && (
                  <span className="text-[9px] uppercase tracking-[0.15em] bg-primary text-primary-foreground px-3 py-1.5 font-medium">
                    Bestseller
                  </span>
                )}
                {candle.onSale && (
                  <span className="text-[9px] uppercase tracking-[0.15em] bg-destructive text-destructive-foreground px-3 py-1.5 font-medium">
                    Sale
                  </span>
                )}
                {candle.stockStatus === 'limited' && (
                  <span className="text-[9px] uppercase tracking-[0.15em] bg-muted text-muted-foreground px-3 py-1.5 font-medium">
                    Limited Stock
                  </span>
                )}
              </div>

              <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3 font-medium">
                {candle.collection}
              </p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
                {candle.name}
              </h1>
              <p className="text-lg text-muted-foreground italic mb-8">
                {candle.tagline}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-border/30">
                <span className="font-display text-4xl text-foreground">${candle.price}</span>
                {candle.regularPrice && (
                  <span className="text-xl text-muted-foreground line-through">${candle.regularPrice}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {candle.description}
              </p>

              {/* Fragrance Notes */}
              <div className="mb-8 p-6 bg-secondary/20 border border-border/30">
                <h3 className="font-display text-lg text-foreground mb-5">Fragrance Notes</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <span className="w-20 text-muted-foreground uppercase tracking-[0.15em] text-[10px] pt-0.5">Top</span>
                    <span className="text-foreground flex-1">{candle.fragranceNotes.top.join(" · ")}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-20 text-muted-foreground uppercase tracking-[0.15em] text-[10px] pt-0.5">Heart</span>
                    <span className="text-foreground flex-1">{candle.fragranceNotes.heart.join(" · ")}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-20 text-muted-foreground uppercase tracking-[0.15em] text-[10px] pt-0.5">Base</span>
                    <span className="text-foreground flex-1">{candle.fragranceNotes.base.join(" · ")}</span>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-3 gap-3 mb-8">
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

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
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
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={candle.stockStatus === 'outofstock'}
                >
                  {candle.stockStatus === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/30">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-wider">Free Ship $100+</span>
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
          </div>
        </div>

        {/* Related Products */}
        {relatedCandles.length > 0 && (
          <section className="py-24 border-t border-border/30 bg-secondary/10">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-16">
                <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                  Discover More
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-foreground">
                  You May Also Like
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
                {relatedCandles.map((c, index) => (
                  <CandleCard key={c.id} candle={c} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CandleDetail;
