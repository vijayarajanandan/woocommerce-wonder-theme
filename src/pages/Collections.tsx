/**
 * Collections Page - WooCommerce Integrated
 * 
 * Fetches collections (categories) from WooCommerce with product counts.
 */

import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

// WooCommerce hooks
import { useCategories } from "@/hooks/useWooCommerce";
import { isWooCommerceConfigured } from "@/lib/woocommerce";

// Themed collection images (fallbacks)
import signatureCollection from "@/assets/collections/signature-collection.jpg";
import noirCollection from "@/assets/collections/noir-collection.jpg";
import botanicalCollection from "@/assets/collections/botanical-collection.jpg";
import limitedCollection from "@/assets/collections/limited-collection.jpg";

const collectionImages: Record<string, string> = {
  'signature': signatureCollection,
  'noir': noirCollection,
  'botanical': botanicalCollection,
  'limited': limitedCollection,
};

// Collection card skeleton
const CollectionCardSkeleton = ({ large = false }: { large?: boolean }) => (
  <div className={`relative overflow-hidden rounded-lg ${large ? 'aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]' : 'aspect-[3/4]'}`}>
    <Skeleton className="w-full h-full" />
  </div>
);

// Error state
const ErrorState = ({ onRetry }: { onRetry?: () => void }) => (
  <div className="text-center py-20">
    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
      <AlertCircle className="h-8 w-8 text-red-500" />
    </div>
    <h2 className="font-display text-2xl text-foreground mb-4">Unable to Load Collections</h2>
    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
      We couldn't fetch the collections. Please try again.
    </p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    )}
  </div>
);

// Not configured state
const NotConfiguredState = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Header />
    <main className="flex-1 pt-20 flex items-center justify-center">
      <div className="text-center px-6">
        <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
        <h1 className="font-display text-3xl text-foreground mb-4">Store Not Connected</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Collections are not available. Please configure WooCommerce.
        </p>
        <Button asChild variant="outline">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </main>
    <Footer />
  </div>
);

const Collections = () => {
  // Check if WooCommerce is configured
  const wcConfigured = isWooCommerceConfigured();

  // Fetch categories from WooCommerce
  const { 
    data: collections, 
    isLoading, 
    error,
    refetch 
  } = useCategories();

  // If WooCommerce is not configured
  if (!wcConfigured) {
    return <NotConfiguredState />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                Explore
              </p>
              <h1 className="font-display text-5xl md:text-6xl text-foreground mb-6">
                Our <span className="italic text-primary">Collections</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover our curated collections, each crafted to evoke 
                distinct moods and memories.
              </p>
            </div>

            {/* Error State */}
            {error && !isLoading && (
              <ErrorState onRetry={() => refetch()} />
            )}

            {/* Loading State */}
            {isLoading && (
              <>
                <div className="mb-8">
                  <CollectionCardSkeleton large />
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <CollectionCardSkeleton key={i} />
                  ))}
                </div>
              </>
            )}

            {/* Collections Display */}
            {!isLoading && !error && collections && collections.length > 0 && (
              <>
                {/* Featured Collection - First one larger */}
                <div className="mb-8">
                  <Link
                    to={`/shop?collection=${collections[0].slug}`}
                    className="group relative block overflow-hidden rounded-lg opacity-0 animate-fade-in aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
                    style={{ animationFillMode: "forwards" }}
                  >
                    <img
                      src={collectionImages[collections[0].slug] || collections[0].image || signatureCollection}
                      alt={collections[0].name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90"
                    />
                    <div className="absolute inset-0 bg-background/50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/30" />
                    <div className="absolute inset-0 flex items-end lg:items-center">
                      <div className="p-6 sm:p-8 md:p-12 max-w-xl">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
                          Featured Collection
                        </p>
                        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                          {collections[0].name}
                        </h2>
                        <p className="text-muted-foreground mb-2">
                          {collections[0].description}
                        </p>
                        {collections[0].productCount !== undefined && (
                          <p className="text-sm text-primary/80 mb-6">
                            {collections[0].productCount} Products
                          </p>
                        )}
                        <span className="inline-flex items-center text-xs uppercase tracking-[0.15em] text-primary group-hover:gap-3 gap-2 transition-all">
                          Shop Collection
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Other Collections Grid */}
                {collections.length > 1 && (
                  <div className="grid md:grid-cols-3 gap-6">
                    {collections.slice(1).map((collection, index) => (
                      <Link
                        key={collection.id}
                        to={`/shop?collection=${collection.slug}`}
                        className="group relative aspect-[3/4] overflow-hidden rounded-lg opacity-0 animate-fade-in"
                        style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: 'forwards' }}
                      >
                        <img
                          src={collectionImages[collection.slug] || collection.image || signatureCollection}
                          alt={collection.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90"
                        />
                        <div className="absolute inset-0 bg-background/40" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          {collection.productCount !== undefined && (
                            <p className="text-[9px] uppercase tracking-[0.3em] text-primary mb-2">
                              {collection.productCount} Products
                            </p>
                          )}
                          <h2 className="font-display text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                            {collection.name}
                          </h2>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {collection.description}
                          </p>
                          <span className="inline-flex items-center text-xs uppercase tracking-[0.15em] text-primary group-hover:gap-3 gap-2 transition-all">
                            Explore
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!isLoading && !error && (!collections || collections.length === 0) && (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-8">No collections available yet.</p>
                <Button asChild variant="gold">
                  <Link to="/shop">Browse All Products</Link>
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

export default Collections;