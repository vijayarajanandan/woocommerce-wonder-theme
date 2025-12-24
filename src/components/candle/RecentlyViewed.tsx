import { Link } from "react-router-dom";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { formatPrice } from "@/lib/currency";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface RecentlyViewedProps {
  excludeId?: number;
}

export const RecentlyViewed = ({ excludeId }: RecentlyViewedProps) => {
  const { items } = useRecentlyViewed();

  const displayItems = items.filter((item) => item.id !== excludeId).slice(0, 4);

  if (displayItems.length === 0) return null;

  return (
    <section className="py-12 border-t border-border/30">
      <div className="container mx-auto px-6 lg:px-12">
        <ScrollReveal>
          <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-8">
            Recently Viewed
          </h3>
        </ScrollReveal>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {displayItems.map((candle, index) => (
            <ScrollReveal key={candle.id} delay={index * 50}>
              <Link
                to={`/shop/${candle.slug}`}
                className="flex-shrink-0 w-40 group"
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
