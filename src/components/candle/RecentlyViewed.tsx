import { Link } from "react-router-dom";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { CandleCard } from "@/components/candle/CandleCard";

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
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 lg:py-24 border-t border-border/30">
      <div className="container mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-12 lg:mb-16">
            <div className="text-center lg:text-left flex-1">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                Continue Browsing
              </p>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground">
                Recently Viewed
              </h2>
            </div>
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

        {/* Mobile: Scrollable like bestsellers, Desktop: Grid */}
        <div 
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-8 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 snap-x snap-mandatory lg:snap-none max-w-5xl lg:mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayItems.map((candle, index) => (
            <div key={candle.id} className="flex-shrink-0 w-[260px] lg:w-full snap-start">
              <CandleCard candle={candle} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};