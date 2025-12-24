import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CandleCard } from "@/components/candle/CandleCard";
import { candles, collections, getBestsellers, getCandlesByCollection } from "@/data/candles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import shopBanner from "@/assets/shop-banner.jpg";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionSlug = searchParams.get("collection");
  const showBestsellers = searchParams.get("bestsellers") === "true";

  let displayCandles = candles;
  let pageTitle = "All Candles";
  let pageDescription = "Discover our complete collection of luxury scented candles";

  if (showBestsellers) {
    displayCandles = getBestsellers();
    pageTitle = "Bestsellers";
    pageDescription = "Our most loved fragrances, chosen by our community";
  } else if (collectionSlug) {
    displayCandles = getCandlesByCollection(collectionSlug);
    const collection = collections.find((c) => c.slug === collectionSlug);
    pageTitle = collection?.name || "Collection";
    pageDescription = collection?.description || "";
  }

  const clearFilters = () => setSearchParams({});

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative py-20 lg:py-28 text-center border-b border-border/30 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url(${shopBanner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium opacity-0 animate-fade-in">
              Shop
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
              {pageTitle}
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {pageDescription}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-border/30 bg-secondary/10 sticky top-20 z-40 backdrop-blur-sm">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant={!collectionSlug && !showBestsellers ? "default" : "outline"}
                size="sm"
                onClick={clearFilters}
              >
                All
              </Button>
              {collections.map((col) => (
                <Button
                  key={col.id}
                  variant={collectionSlug === col.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchParams({ collection: col.slug })}
                >
                  {col.name}
                </Button>
              ))}
              <Button
                variant={showBestsellers ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchParams({ bestsellers: "true" })}
              >
                Bestsellers
              </Button>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            {displayCandles.length > 0 ? (
              <>
                <p className="text-xs text-muted-foreground text-center mb-12 uppercase tracking-wider">
                  {displayCandles.length} {displayCandles.length === 1 ? 'product' : 'products'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
                  {displayCandles.map((candle, index) => (
                    <CandleCard key={candle.id} candle={candle} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-foreground mb-4">No candles found</p>
                <p className="text-muted-foreground mb-8">Try selecting a different collection</p>
                <Button onClick={clearFilters} variant="gold">
                  View All Candles
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
