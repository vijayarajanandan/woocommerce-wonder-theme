import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CandleCard } from "@/components/candle/CandleCard";
import { getFeaturedCandles, getBestsellers, collections } from "@/data/candles";

const Index = () => {
  const featuredCandles = getFeaturedCandles().slice(0, 4);
  const bestsellers = getBestsellers();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 luxury-gradient" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1602607434763-6b9f36c2bc58?w=1600')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.4em] text-primary mb-6 opacity-0 animate-fade-in">
              Luxury Scented Candles
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[1.1] mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
              Illuminate Your <br />
              <span className="italic text-primary">Sanctuary</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
              Handcrafted with rare ingredients and timeless artistry. 
              Each flame tells a story of elegance and refinement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                <Link to="/shop">Explore Collection</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-foreground/20 text-foreground hover:bg-foreground/5 px-8">
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-muted-foreground animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <Flame className="h-5 w-5 text-primary animate-pulse" />
          </div>
        </section>

        {/* Featured Collection */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-[11px] uppercase tracking-[0.4em] text-primary mb-4">
                Curated Selection
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground">
                Featured Candles
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {featuredCandles.map((candle, index) => (
                <CandleCard key={candle.id} candle={candle} index={index} />
              ))}
            </div>
            <div className="text-center mt-16">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/shop" className="flex items-center gap-2">
                  View All Candles <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Strip */}
        <section className="py-24 lg:py-32 bg-secondary/30 border-y border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-primary mb-4">
                  The Scentora Difference
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                  Crafted with <br />
                  <span className="italic">Intention</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Every Scentora candle is hand-poured in small batches using 100% natural soy wax 
                  and premium fragrance oils. Our wicks are lead-free cotton for a clean, even burn. 
                  We source only the finest ingredients to create fragrances that transform your space 
                  into a sanctuary of calm and sophistication.
                </p>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <p className="font-display text-3xl text-primary">60+</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Hours Burn Time</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-3xl text-primary">100%</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Natural Soy</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-3xl text-primary">Hand</p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Poured</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800"
                  alt="Scentora candle crafting"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border border-primary/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        {bestsellers.length > 0 && (
          <section className="py-24 lg:py-32">
            <div className="container mx-auto px-6 lg:px-12">
              <div className="text-center mb-16">
                <p className="text-[11px] uppercase tracking-[0.4em] text-primary mb-4">
                  Most Loved
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-foreground">
                  Bestsellers
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
                {bestsellers.map((candle, index) => (
                  <CandleCard key={candle.id} candle={candle} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Collections Preview */}
        <section className="py-24 lg:py-32 bg-secondary/30 border-y border-border/50">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-[11px] uppercase tracking-[0.4em] text-primary mb-4">
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
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                    <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                      {collection.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2">
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
            <p className="text-[11px] uppercase tracking-[0.4em] text-primary mb-4">
              Stay Illuminated
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
              Join Our Circle
            </h2>
            <p className="text-muted-foreground mb-8">
              Be the first to discover new collections, exclusive offers, and the art of scent.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
