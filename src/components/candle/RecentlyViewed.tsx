import { Link } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { formatPrice } from "@/lib/currency";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";

interface RecentlyViewedProps {
  excludeId?: number;
}

export const RecentlyViewed = ({ excludeId }: RecentlyViewedProps) => {
  const { items } = useRecentlyViewed();
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayItems = items.filter((item) => item.id !== excludeId).slice(0, 4);

  if (displayItems.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 border-t border-border/30">
      <div className="container mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Recently Viewed
            </h3>
            <div className="flex gap-2 lg:hidden">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile: Scrollable, Desktop: 3-column centered grid */}
        <div 
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-8 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none max-w-3xl lg:mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayItems.map((candle, index) => (
            <ScrollReveal key={candle.id} delay={index * 50}>
              <Link
                to={`/shop/${candle.slug}`}
                className="flex-shrink-0 w-[160px] lg:w-full group snap-start"
              >
                <div className="aspect-[3/4] bg-secondary/30 mb-3 overflow-hidden">
                  <img
                    src={candle.images[0]}
                    alt={candle.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate">
                  {candle.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(candle.price)}
                </p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
