import { Link } from "react-router-dom";
import { Category } from "@/types/product";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export const CategoryCard = ({ category, className }: CategoryCardProps) => {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className={cn(
        "group relative block aspect-[4/5] overflow-hidden rounded-lg bg-muted",
        className
      )}
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display text-xl font-semibold text-background">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-background/80">
          {category.count} products
        </p>
      </div>
    </Link>
  );
};
