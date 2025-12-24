import { Link } from "react-router-dom";
import { ArrowRight, Flame, Truck, Leaf, Award, Hand, Droplets, Timer, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CandleCard } from "@/components/candle/CandleCard";
import { getFeaturedCandles, getBestsellers, collections, candles } from "@/data/candles";
import { useRef } from "react";

// Import product images for banners
import coffeeEmber1 from "@/assets/products/coffee-ember-1-enhanced.jpg";
import coffeeEmber2 from "@/assets/products/coffee-ember-2-enhanced.jpg";

// Themed collection images
import signatureCollection from "@/assets/collections/signature-collection.jpg";
import noirCollection from "@/assets/collections/noir-collection.jpg";
import botanicalCollection from "@/assets/collections/botanical-collection.jpg";
import limitedCollection from "@/assets/collections/limited-collection.jpg";

const Index = () => {
  const featuredCandles = getFeaturedCandles();
  const bestsellers = getBestsellers();
  const featuredScrollRef = useRef<HTMLDivElement>(null);
  const bestsellersScrollRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Collection themed images using candle flames
  const collectionImages: Record<string, string> = {
    'signature': signatureCollection,
    'noir': noirCollection,
    'botanical': botanicalCollection,
    'limited': limitedCollection,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 luxury-gradient" />
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url(${coffeeEmber2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <div className="opacity-0 animate-fade-in">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-8 font-medium">
                Luxury Scented Candles
              </p>
            </div>
            <h1 
              className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground leading-[1.1] mb-8 opacity-0 animate-fade-in" 
              style={{ animationDelay: '200ms' }}
            >
              Illuminate Your <br />
              <span className="italic text-primary">Sanctuary</span>
            </h1>
            <p 
              className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in" 
              style={{ animationDelay: '400ms' }}
            >
              Handcrafted with rare ingredients and timeless artistry. 
              Each flame tells a story of elegance and refinement.
            </p>
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in" 
              style={{ animationDelay: '600ms' }}
            >
              <Button asChild size="lg" variant="default">
                <Link to="/shop">Explore Collection</Link>
              </Button>
              <Button asChild size="lg" variant="luxury">
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 animate-fade-in" 
            style={{ animationDelay: '1000ms' }}
          >
            <Flame className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Discover</span>
          </div>
        </section>

        {/* Features Strip */}
        <section className="py-8 border-y border-border/30 bg-secondary/20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x divide-border/30">
              <div className="flex items-center justify-center gap-4 py-4">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Free Shipping Over $100</span>
              </div>
              <div className="flex items-center justify-center gap-4 py-4">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">100% Natural Soy Wax</span>
              </div>
              <div className="flex items-center justify-center gap-4 py-4">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Handcrafted Quality</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collection - Scrollable */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                  Curated Selection
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-foreground">
                  Featured Candles
                </h2>
              </div>
              <div className="hidden md:flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => scroll(featuredScrollRef, 'left')}
                  className="border-border/50 hover:border-primary hover:bg-primary/5"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => scroll(featuredScrollRef, 'right')}
                  className="border-border/50 hover:border-primary hover:bg-primary/5"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div 
              ref={featuredScrollRef}
              className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredCandles.map((candle, index) => (
                <div key={candle.id} className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start">
                  <CandleCard candle={candle} index={index} />
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="gold" size="lg">
                <Link to="/shop" className="flex items-center gap-3">
                  View All Candles 
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Strip - Using Product Image */}
        <section className="py-24 lg:py-32 bg-secondary/20 border-y border-border/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                  The Scentora Difference
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8 leading-tight">
                  Crafted with <br />
                  <span className="italic text-primary">Intention</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-10">
                  Every Scentora candle is hand-poured in small batches using 100% natural soy wax 
                  and premium fragrance oils. Our wicks are lead-free cotton for a clean, even burn.
                </p>
                
                {/* Feature Points with Icons */}
                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 border border-primary/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                      <Droplets className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg text-foreground mb-1">100% Natural Soy Wax</h4>
                      <p className="text-sm text-muted-foreground">Clean-burning, sustainable, and eco-friendly sourced from renewable resources.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 border border-primary/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                      <Hand className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg text-foreground mb-1">Hand-Poured with Care</h4>
                      <p className="text-sm text-muted-foreground">Each candle is crafted in small batches by skilled artisans.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 border border-primary/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg text-foreground mb-1">Premium Fragrance Oils</h4>
                      <p className="text-sm text-muted-foreground">Expertly blended using the finest ingredients for lasting scent throw.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 border border-primary/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                      <Timer className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg text-foreground mb-1">60+ Hours Burn Time</h4>
                      <p className="text-sm text-muted-foreground">Long-lasting enjoyment with an even, clean burn every time.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={coffeeEmber1}
                    alt="Scentora candle crafting"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-primary/30" />
                <div className="absolute -top-6 -right-6 w-32 h-32 border border-primary/30" />
              </div>
            </div>
          </div>
        </section>

        {/* Bestsellers - Scrollable */}
        {bestsellers.length > 0 && (
          <section className="py-24 lg:py-32">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                    Most Loved
                  </p>
                  <h2 className="font-display text-4xl md:text-5xl text-foreground">
                    Bestsellers
                  </h2>
                </div>
                <div className="hidden md:flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => scroll(bestsellersScrollRef, 'left')}
                    className="border-border/50 hover:border-primary hover:bg-primary/5"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => scroll(bestsellersScrollRef, 'right')}
                    className="border-border/50 hover:border-primary hover:bg-primary/5"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div 
                ref={bestsellersScrollRef}
                className="flex gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {bestsellers.map((candle, index) => (
                  <div key={candle.id} className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start">
                    <CandleCard candle={candle} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Collections Preview - Using Product Images */}
        <section className="py-24 lg:py-32 bg-secondary/20 border-y border-border/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                Discover
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground">
                Our Collections
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection, index) => (
                <Link
                  key={collection.id}
                  to={`/shop?collection=${collection.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={collectionImages[collection.slug] || collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-background/60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-background/20" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                      {collection.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {collection.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12 max-w-2xl text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
              Stay Illuminated
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Join Our Circle
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Be the first to discover new collections, exclusive offers, and the art of scent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 bg-secondary/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
              />
              <Button variant="default">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No spam, unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
