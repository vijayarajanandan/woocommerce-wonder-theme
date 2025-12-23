import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { collections } from "@/data/candles";
import { ArrowRight } from "lucide-react";

const Collections = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-24 lg:py-32">
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

            <div className="grid md:grid-cols-2 gap-8">
              {collections.map((collection, index) => (
                <Link
                  key={collection.id}
                  to={`/shop?collection=${collection.slug}`}
                  className="group relative aspect-[4/5] overflow-hidden opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
                      Collection
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl text-foreground group-hover:text-primary transition-colors duration-300 mb-3">
                      {collection.name}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {collection.description}
                    </p>
                    <span className="inline-flex items-center text-xs uppercase tracking-[0.15em] text-primary group-hover:gap-3 gap-2 transition-all">
                      Explore Collection
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
