import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useWishlist } from "@/context/WishlistContext";
import { CandleCard } from "@/components/candle/CandleCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="py-16 lg:py-20 text-center border-b border-border/30">
          <div className="container mx-auto px-6 lg:px-12">
            <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium opacity-0 animate-fade-in">
              Your Favorites
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Wishlist
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {items.length > 0 
                ? `You have ${items.length} item${items.length > 1 ? 's' : ''} in your wishlist`
                : 'Your wishlist is empty'
              }
            </p>
          </div>
        </section>

        {/* Wishlist Items */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
                {items.map((candle, index) => (
                  <CandleCard key={candle.id} candle={candle} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
                <h2 className="font-display text-2xl text-foreground mb-4">No items in your wishlist</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Start exploring our collection and save your favorite candles for later.
                </p>
                <Button asChild size="lg">
                  <Link to="/shop">Browse Collection</Link>
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

export default Wishlist;
