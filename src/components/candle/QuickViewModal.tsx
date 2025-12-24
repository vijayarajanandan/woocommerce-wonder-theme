import { useState } from "react";
import { Candle } from "@/types/candle";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Minus, Plus, Heart, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface QuickViewModalProps {
  candle: Candle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuickViewModal = ({ candle, open, onOpenChange }: QuickViewModalProps) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!candle) return null;

  const inWishlist = isInWishlist(candle.id);

  const handleAddToCart = () => {
    addItem(candle, quantity);
    setQuantity(1);
    onOpenChange(false);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(candle);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">{candle.name} - Quick View</DialogTitle>
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-secondary/30">
            <img
              src={candle.images[selectedImage]}
              alt={candle.name}
              className="w-full h-full object-cover"
            />
            {candle.images.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                {candle.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      selectedImage === i ? "bg-primary" : "bg-background/60"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {candle.bestseller && (
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] bg-background border border-primary/30 text-foreground px-2.5 py-1 font-medium rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Bestseller
                </span>
              )}
              {candle.onSale && (
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 font-medium rounded-sm">
                  Save {Math.round(((candle.regularPrice! - candle.price) / candle.regularPrice!) * 100)}%
                </span>
              )}
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2 font-medium">
              {candle.collection}
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-2">
              {candle.name}
            </h2>
            <p className="text-muted-foreground italic mb-4">
              {candle.tagline}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-2xl text-foreground">{formatPrice(candle.price)}</span>
              {candle.regularPrice && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(candle.regularPrice)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
              {candle.description}
            </p>

            {/* Fragrance Notes Preview */}
            <div className="mb-6 text-sm">
              <span className="text-muted-foreground">Notes: </span>
              <span className="text-foreground">
                {[...candle.fragranceNotes.top, ...candle.fragranceNotes.heart.slice(0, 1)].join(", ")}
              </span>
            </div>

            <div className="mt-auto space-y-4">
              {/* Quantity & Add to Cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border/50">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 hover:text-primary"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-medium text-sm">{quantity}</span>
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
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={candle.stockStatus === 'outofstock'}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {candle.stockStatus === 'outofstock' ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleWishlist}
                  className={cn(
                    "h-10 w-10 shrink-0",
                    inWishlist && "text-primary border-primary/50 hover:text-primary"
                  )}
                >
                  <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
                </Button>
              </div>

              {/* View Full Details */}
              <Button
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link to={`/shop/${candle.slug}`} onClick={() => onOpenChange(false)}>
                  View Full Details →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
