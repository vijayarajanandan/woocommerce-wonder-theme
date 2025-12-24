import { Link } from "react-router-dom";
import { Candle } from "@/types/candle";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/currency";

interface CandleCardProps {
  candle: Candle;
  className?: string;
  index?: number;
}

export const CandleCard = ({ candle, className, index = 0 }: CandleCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(candle, 1);
  };

  return (
    <Link
      to={`/shop/${candle.slug}`}
      className={cn(
        "group block opacity-0 animate-fade-in",
        className
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/30 mb-6">
        <img
          src={candle.images[0]}
          alt={candle.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Quick add button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <Button
            onClick={handleAddToCart}
            variant="default"
            size="sm"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>

        {/* Badges */}
        {(candle.bestseller || candle.onSale || candle.stockStatus === 'limited') && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {candle.bestseller && (
              <span className="text-[9px] uppercase tracking-[0.15em] bg-primary text-primary-foreground px-3 py-1.5 font-medium">
                Bestseller
              </span>
            )}
            {candle.onSale && (
              <span className="text-[9px] uppercase tracking-[0.15em] bg-destructive text-destructive-foreground px-3 py-1.5 font-medium">
                Sale
              </span>
            )}
            {candle.stockStatus === 'limited' && !candle.onSale && !candle.bestseller && (
              <span className="text-[9px] uppercase tracking-[0.15em] bg-muted text-muted-foreground px-3 py-1.5 font-medium">
                Limited
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-center px-2">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary/80 mb-2 font-medium">
          {candle.collection}
        </p>
        <h3 className="font-display text-xl lg:text-2xl text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
          {candle.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
          {candle.tagline}
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm font-medium text-foreground">
            {formatPrice(candle.price)}
          </span>
          {candle.regularPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(candle.regularPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
