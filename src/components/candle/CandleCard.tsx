import { Link } from "react-router-dom";
import { Candle } from "@/types/candle";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/50 mb-6">
        <img
          src={candle.images[0]}
          alt={candle.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="bg-background/90 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Add to Cart
          </Button>
        </div>

        {/* Badges */}
        {(candle.bestseller || candle.onSale || candle.stockStatus === 'limited') && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {candle.bestseller && (
              <span className="text-[10px] uppercase tracking-[0.15em] bg-primary text-primary-foreground px-3 py-1">
                Bestseller
              </span>
            )}
            {candle.onSale && (
              <span className="text-[10px] uppercase tracking-[0.15em] bg-destructive text-destructive-foreground px-3 py-1">
                Sale
              </span>
            )}
            {candle.stockStatus === 'limited' && !candle.onSale && (
              <span className="text-[10px] uppercase tracking-[0.15em] bg-muted text-muted-foreground px-3 py-1">
                Limited
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
          {candle.collection}
        </p>
        <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors duration-300">
          {candle.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          {candle.tagline}
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-sm text-foreground">
            ${candle.price}
          </span>
          {candle.regularPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${candle.regularPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
