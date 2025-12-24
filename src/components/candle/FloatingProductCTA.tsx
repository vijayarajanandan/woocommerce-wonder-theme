import { useState, useEffect, useRef } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/currency";
import { Candle } from "@/types/candle";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface FloatingProductCTAProps {
  candle: Candle;
  triggerRef: React.RefObject<HTMLElement>;
}

export const FloatingProductCTA = ({ candle, triggerRef }: FloatingProductCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show floating CTA when the main CTA is NOT visible
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, [triggerRef]);

  const handleAddToCart = () => {
    addItem(candle, quantity);
    setQuantity(1);
  };

  if (!isVisible || candle.stockStatus === 'outofstock') return null;

  return (
    <>
      {/* Mobile Floating CTA - Simple */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 p-4 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm truncate">{candle.name}</p>
            <p className="text-primary font-display text-lg">{formatPrice(candle.price)}</p>
          </div>
          <Button
            size="lg"
            className="h-12 px-8"
            onClick={() => addItem(candle, 1)}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Desktop Floating CTA - With product info */}
      <div className={cn(
        "hidden lg:block fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-50 shadow-lg transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="container mx-auto px-12 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Product Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img 
                src={candle.images[0]} 
                alt={candle.name} 
                className="w-14 h-14 object-cover rounded"
              />
              <div className="min-w-0">
                <p className="font-display text-lg text-foreground truncate">{candle.name}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-xl text-primary">{formatPrice(candle.price)}</span>
                  {candle.regularPrice && (
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(candle.regularPrice)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border/50">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 hover:text-primary"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-10 w-10 hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="h-12 px-10"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
