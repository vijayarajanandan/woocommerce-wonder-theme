import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, Minus, Plus, Flame } from "lucide-react";
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
          <div className="text-center">
            <h1 className="font-display text-3xl mb-4">Candle not found</h1>
            <Button asChild><Link to="/shop">Back to Shop</Link></Button>
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
          {/* Back Link */}
          <Link to="/shop" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 text-sm uppercase tracking-wider transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-secondary/50 overflow-hidden">
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
                      className={`w-20 h-24 overflow-hidden border transition-colors ${
                        selectedImage === i ? "border-primary" : "border-border"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:py-8">
              {/* Badges */}
              <div className="flex gap-3 mb-4">
                {candle.bestseller && (
                  <span className="text-[10px] uppercase tracking-[0.15em] bg-primary text-primary-foreground px-3 py-1">
                    Bestseller
                  </span>
                )}
                {candle.stockStatus === 'limited' && (
                  <span className="text-[10px] uppercase tracking-[0.15em] bg-muted text-muted-foreground px-3 py-1">
                    Limited Stock
                  </span>
                )}
              </div>

              <p className="text-[11px] uppercase tracking-[0.3em] text-primary mb-2">
                {candle.collection}
              </p>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-2">
                {candle.name}
              </h1>
              <p className="text-lg text-muted-foreground italic mb-6">
                {candle.tagline}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-display text-3xl text-foreground">${candle.price}</span>
                {candle.regularPrice && (
                  <span className="text-lg text-muted-foreground line-through">${candle.regularPrice}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {candle.description}
              </p>

              {/* Fragrance Notes */}
              <div className="mb-8 p-6 bg-secondary/30 border border-border/50">
                <h3 className="font-display text-lg text-foreground mb-4">Fragrance Notes</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <span className="w-16 text-muted-foreground uppercase tracking-wider text-xs">Top</span>
                    <span className="text-foreground">{candle.fragranceNotes.top.join(", ")}</span>
                  </div>
                  <div className="flex">
                    <span className="w-16 text-muted-foreground uppercase tracking-wider text-xs">Heart</span>
                    <span className="text-foreground">{candle.fragranceNotes.heart.join(", ")}</span>
                  </div>
                  <div className="flex">
                    <span className="w-16 text-muted-foreground uppercase tracking-wider text-xs">Base</span>
                    <span className="text-foreground">{candle.fragranceNotes.base.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-4 border border-border/50">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Size</p>
                  <p className="text-foreground">{candle.weight}</p>
                </div>
                <div className="p-4 border border-border/50">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Burn Time</p>
                  <p className="text-foreground">{candle.burnTime}</p>
                </div>
                <div className="p-4 border border-border/50">
                  <Flame className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-xs text-muted-foreground">Natural Soy</p>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => q + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleAddToCart}
                  disabled={candle.stockStatus === 'outofstock'}
                >
                  {candle.stockStatus === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Free shipping on orders over $100
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedCandles.length > 0 && (
          <section className="py-24 border-t border-border/50">
            <div className="container mx-auto px-6 lg:px-12">
              <h2 className="font-display text-3xl text-foreground text-center mb-12">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
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
