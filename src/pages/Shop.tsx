import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CandleCard } from "@/components/candle/CandleCard";
import { candles, collections, getBestsellers, getCandlesByCollection } from "@/data/candles";
import { Button } from "@/components/ui/button";

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
        <section className="py-16 lg:py-24 text-center">
          <div className="container mx-auto px-6 lg:px-12">
            <p className="text-[11px] uppercase tracking-[0.4em] text-primary mb-4">
              Shop
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
              {pageTitle}
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {pageDescription}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="border-y border-border/50 py-6">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                variant={!collectionSlug && !showBestsellers ? "default" : "outline"}
                size="sm"
                onClick={clearFilters}
                className="text-xs uppercase tracking-wider"
              >
                All
              </Button>
              {collections.map((col) => (
                <Button
                  key={col.id}
                  variant={collectionSlug === col.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchParams({ collection: col.slug })}
                  className="text-xs uppercase tracking-wider"
                >
                  {col.name}
                </Button>
              ))}
              <Button
                variant={showBestsellers ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchParams({ bestsellers: "true" })}
                className="text-xs uppercase tracking-wider"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
                {displayCandles.map((candle, index) => (
                  <CandleCard key={candle.id} candle={candle} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No candles found in this collection.</p>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
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
