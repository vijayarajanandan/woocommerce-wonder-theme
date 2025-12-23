import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const discount = product.regularPrice
    ? Math.round(((product.regularPrice - product.price) / product.regularPrice) * 100)
    : 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn(
        "group block bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.onSale && (
            <Badge className="bg-sale text-sale-foreground hover:bg-sale/90">
              -{discount}%
            </Badge>
          )}
          {product.featured && !product.onSale && (
            <Badge variant="secondary">Featured</Badge>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            onClick={handleAddToCart}
            className="h-10 w-10 rounded-full shadow-lg"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {product.averageRating > 0 && (
            <>
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-xs text-muted-foreground">
                {product.averageRating} ({product.reviewCount})
              </span>
            </>
          )}
        </div>
        
        <h3 className="font-display text-base font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
          {product.shortDescription}
        </p>
        
        <div className="mt-3 flex items-center gap-2">
          <span className="font-semibold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          {product.regularPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.regularPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
