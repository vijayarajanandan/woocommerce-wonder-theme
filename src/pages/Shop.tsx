import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CandleCard } from "@/components/candle/CandleCard";
import { Button } from "@/components/ui/button";
import { ProductFilters, FilterState } from "@/components/shop/ProductFilters";
import { Skeleton } from "@/components/ui/skeleton";
import shopBanner from "@/assets/shop-banner.jpg";
import { trackFilterUsage } from "@/lib/matomo";

// WooCommerce hooks
import { useProducts, useCategories } from "@/hooks/useWooCommerce";
import { isWooCommerceConfigured } from "@/lib/woocommerce";

// Fallback static data
import { 
  candles as staticCandles, 
  collections as staticCollections, 
  getBestsellers as getStaticBestsellers,
  getMinMaxPrice,
} from "@/data/candles";

// Get price range for filters
const { min: defaultMinPrice, max: defaultMaxPrice } = getMinMaxPrice();

const defaultFilters: FilterState = {
  priceRange: [defaultMinPrice, defaultMaxPrice],
  collections: [],
  scentTypes: [],
  sizes: [],
  inStock: false,
  onSale: false,
};

// Loading skeleton for products
const ProductSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-square w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

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

  // Check if WooCommerce is configured
  const wcConfigured = isWooCommerceConfigured();

  // Fetch from WooCommerce if configured
  const { data: wcData, isLoading: productsLoading } = useProducts({ per_page: 100 });
  const { data: wcCategories, isLoading: categoriesLoading } = useCategories();

  // Use WooCommerce data if available, otherwise fallback to static
  const allCandles = wcConfigured && wcData?.candles ? wcData.candles : staticCandles;
  const displayCollections = wcConfigured && wcCategories ? wcCategories : staticCollections;
  const bestsellers = allCandles.filter(c => c.bestseller);

  const isLoading = wcConfigured && (productsLoading || categoriesLoading);

  // Calculate min/max price from actual data
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = allCandles.map(c => c.price);
    if (prices.length === 0) return { minPrice: defaultMinPrice, maxPrice: defaultMaxPrice };
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [allCandles]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count++;
    if (filters.collections.length > 0) count += filters.collections.length;
    if (filters.scentTypes.length > 0) count += filters.scentTypes.length;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.inStock) count++;
    if (filters.onSale) count++;
    return count;
  }, [filters, minPrice, maxPrice]);

  // Apply filters to candles
  const displayCandles = useMemo(() => {
    let result = showBestsellers ? bestsellers : [...allCandles];

    // Apply price filter
    result = result.filter(
      (c) => c.price >= filters.priceRange[0] && c.price <= filters.priceRange[1]
    );

    // Apply collection filter
    if (filters.collections.length > 0) {
      result = result.filter((c) => {
        const col = displayCollections.find((col) => col.name === c.collection);
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
  }, [filters, showBestsellers, allCandles, bestsellers, displayCollections]);

  // Page title and description
  let pageTitle = "All Candles";
  let pageDescription = "Discover our complete collection of luxury scented candles";

  if (showBestsellers) {
    pageTitle = "Bestsellers";
    pageDescription = "Our most loved fragrances, chosen by our community";
  } else if (filters.collections.length === 1) {
    const collection = displayCollections.find((c) => c.slug === filters.collections[0]);
    if (collection) {
      pageTitle = collection.name;
      pageDescription = collection.description;
    }
  }

  const clearFilters = () => {
    setFilters({ ...defaultFilters, priceRange: [minPrice, maxPrice] });
    setSearchParams({});
    
    // Track filter clear
    trackFilterUsage('Clear', 'All Filters');
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    // Track filter changes
    if (newFilters.collections.length !== filters.collections.length) {
      const added = newFilters.collections.filter(c => !filters.collections.includes(c));
      const removed = filters.collections.filter(c => !newFilters.collections.includes(c));
      added.forEach(c => trackFilterUsage('Collection', c));
      removed.forEach(c => trackFilterUsage('Collection Removed', c));
    }
    
    if (newFilters.sizes.length !== filters.sizes.length) {
      const added = newFilters.sizes.filter(s => !filters.sizes.includes(s));
      added.forEach(s => trackFilterUsage('Size', s));
    }
    
    if (newFilters.inStock !== filters.inStock) {
      trackFilterUsage('In Stock', newFilters.inStock ? 'Enabled' : 'Disabled');
    }
    
    if (newFilters.onSale !== filters.onSale) {
      trackFilterUsage('On Sale', newFilters.onSale ? 'Enabled' : 'Disabled');
    }
    
    if (newFilters.priceRange[0] !== filters.priceRange[0] || 
        newFilters.priceRange[1] !== filters.priceRange[1]) {
      trackFilterUsage('Price Range', `${newFilters.priceRange[0]}-${newFilters.priceRange[1]}`);
    }
    
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

        {/* Quick Filters - Hidden on mobile since we have sidebar filter */}
        <section className="hidden lg:block py-6 border-b border-border/30 bg-secondary/10">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant={!collectionSlug && !showBestsellers && filters.collections.length === 0 ? "default" : "outline"}
                size="sm"
                onClick={clearFilters}
              >
                All
              </Button>
              {displayCollections.map((col) => (
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
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Filters Sidebar */}
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />

              {/* Products */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                    {[...Array(6)].map((_, i) => (
                      <ProductSkeleton key={i} />
                    ))}
                  </div>
                ) : displayCandles.length > 0 ? (
                  <>
                    <p className="text-xs text-muted-foreground text-center lg:text-left mb-8 lg:mb-12 uppercase tracking-wider">
                      {displayCandles.length} {displayCandles.length === 1 ? 'product' : 'products'}
                      {wcConfigured && <span className="ml-2 text-primary">• Live from store</span>}
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
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