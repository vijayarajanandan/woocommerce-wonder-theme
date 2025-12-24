import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CandleCard } from "@/components/candle/CandleCard";
import { candles, collections, getBestsellers } from "@/data/candles";
import { Button } from "@/components/ui/button";
import { ProductFilters, FilterState } from "@/components/shop/ProductFilters";
import shopBanner from "@/assets/shop-banner.jpg";

const defaultFilters: FilterState = {
  priceRange: [0, 2000],
  collections: [],
  scentTypes: [],
  sizes: [],
  inStock: false,
  onSale: false,
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionSlug = searchParams.get("collection");
  const showBestsellers = searchParams.get("bestsellers") === "true";

  const [filters, setFilters] = useState<FilterState>(() => {
    const initial = { ...defaultFilters };
    if (collectionSlug) {
      initial.collections = [collectionSlug];
    }
    return initial;
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) count++;
    if (filters.collections.length > 0) count += filters.collections.length;
    if (filters.scentTypes.length > 0) count += filters.scentTypes.length;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    return count;
  }, [filters]);

  const displayCandles = useMemo(() => {
    let result = showBestsellers ? getBestsellers() : [...candles];

    // Apply price filter
    result = result.filter(
      (c) => c.price >= filters.priceRange[0] && c.price <= filters.priceRange[1]
    );

    // Apply collection filter
    if (filters.collections.length > 0) {
      result = result.filter((c) => {
        const col = collections.find((col) => col.name === c.collection);
        return col && filters.collections.includes(col.slug);
      });
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      result = result.filter((c) => filters.sizes.includes(c.size));
    }

    // Apply stock filter
    if (filters.inStock) {
      result = result.filter((c) => c.stockStatus === "instock");
    }

    // Apply sale filter
    if (filters.onSale) {
      result = result.filter((c) => c.onSale);
    }

    return result;
  }, [filters, showBestsellers]);

  let pageTitle = "All Candles";
  let pageDescription = "Discover our complete collection of luxury scented candles";

  if (showBestsellers) {
    pageTitle = "Bestsellers";
    pageDescription = "Our most loved fragrances, chosen by our community";
  } else if (filters.collections.length === 1) {
    const collection = collections.find((c) => c.slug === filters.collections[0]);
    if (collection) {
      pageTitle = collection.name;
      pageDescription = collection.description;
    }
  }

  const clearFilters = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Update URL if single collection selected
    if (newFilters.collections.length === 1) {
      setSearchParams({ collection: newFilters.collections[0] });
    } else if (newFilters.collections.length === 0 && !showBestsellers) {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[137px]">
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

        {/* Quick Filters */}
        <section className="py-6 border-b border-border/30 bg-secondary/10 sticky top-[137px] z-40 backdrop-blur-sm">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant={!collectionSlug && !showBestsellers && filters.collections.length === 0 ? "default" : "outline"}
                size="sm"
                onClick={clearFilters}
              >
                All
              </Button>
              {collections.map((col) => (
                <Button
                  key={col.id}
                  variant={filters.collections.includes(col.slug) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFiltersChange({ ...filters, collections: [col.slug] })}
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

        {/* Products Grid with Sidebar */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex gap-12">
              {/* Filters Sidebar */}
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
              />

              {/* Products */}
              <div className="flex-1">
                {displayCandles.length > 0 ? (
                  <>
                    <p className="text-xs text-muted-foreground text-center lg:text-left mb-12 uppercase tracking-wider">
                      {displayCandles.length} {displayCandles.length === 1 ? 'product' : 'products'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                      {displayCandles.map((candle, index) => (
                        <CandleCard key={candle.id} candle={candle} index={index} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <p className="font-display text-2xl text-foreground mb-4">No candles found</p>
                    <p className="text-muted-foreground mb-8">Try adjusting your filters</p>
                    <Button onClick={clearFilters} variant="gold">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
