import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { collections, candles } from "@/data/candles";
import { ArrowRight } from "lucide-react";

// Themed collection images
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

const Collections = () => {
  // Get product count per collection
  const getProductCount = (collectionName: string) => {
    return candles.filter((c) => c.collection === collectionName).length;
  };

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

            {/* Featured Collection - First one larger */}
            <div className="mb-8">
              <Link
                to={`/shop?collection=${collections[0].slug}`}
                className="group relative block overflow-hidden rounded-lg opacity-0 animate-fade-in aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
                style={{ animationFillMode: "forwards" }}
              >
                <img
                  src={collectionImages[collections[0].slug] || collections[0].image}
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
                    <p className="text-sm text-primary/80 mb-6">
                      {getProductCount(collections[0].name)} Products
                    </p>
                    <span className="inline-flex items-center text-xs uppercase tracking-[0.15em] text-primary group-hover:gap-3 gap-2 transition-all">
                      Shop Collection
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Other Collections Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {collections.slice(1).map((collection, index) => (
                <Link
                  key={collection.id}
                  to={`/shop?collection=${collection.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-lg opacity-0 animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <img
                    src={collectionImages[collection.slug] || collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-90"
                  />
                  <div className="absolute inset-0 bg-background/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[9px] uppercase tracking-[0.3em] text-primary mb-2">
                      {getProductCount(collection.name)} Products
                    </p>
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;
