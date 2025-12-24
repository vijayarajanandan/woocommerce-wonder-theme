import { useState } from "react";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { collections } from "@/data/candles";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface FilterState {
  priceRange: [number, number];
  collections: string[];
  scentTypes: string[];
  sizes: string[];
  inStock: boolean;
  onSale: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  minPrice: number;
  maxPrice: number;
}

const scentTypes = [
  "Floral",
  "Woody",
  "Fresh",
  "Spicy",
  "Sweet",
  "Fruity",
];

const sizes = ["4 oz", "6 oz", "8 oz", "12 oz"];

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-4 border-b border-border/30">
        <span className="text-sm font-medium text-foreground uppercase tracking-wider">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="py-4">{children}</CollapsibleContent>
    </Collapsible>
  );
};

const FilterContent = ({
  filters,
  onFiltersChange,
  onClearFilters,
  activeFilterCount,
  minPrice,
  maxPrice,
}: ProductFiltersProps) => {
  const handlePriceChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const handleCollectionToggle = (slug: string) => {
    const updated = filters.collections.includes(slug)
      ? filters.collections.filter((c) => c !== slug)
      : [...filters.collections, slug];
    onFiltersChange({ ...filters, collections: updated });
  };

  const handleScentToggle = (scent: string) => {
    const updated = filters.scentTypes.includes(scent)
      ? filters.scentTypes.filter((s) => s !== scent)
      : [...filters.scentTypes, scent];
    onFiltersChange({ ...filters, scentTypes: updated });
  };

  const handleSizeToggle = (size: string) => {
    const updated = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: updated });
  };

  return (
    <div className="space-y-2">
      {activeFilterCount > 0 && (
        <div className="pb-4 border-b border-border/30">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-primary hover:text-primary/80 p-0 h-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all ({activeFilterCount})
          </Button>
        </div>
      )}

      <FilterSection title="Price Range">
        <div className="space-y-4">
          <Slider
            value={[filters.priceRange[0], filters.priceRange[1]]}
            onValueChange={handlePriceChange}
            min={minPrice}
            max={maxPrice}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Collection">
        <div className="space-y-3">
          {collections.map((col) => (
            <label
              key={col.slug}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={filters.collections.includes(col.slug)}
                onCheckedChange={() => handleCollectionToggle(col.slug)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {col.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Scent Type" defaultOpen={false}>
        <div className="space-y-3">
          {scentTypes.map((scent) => (
            <label
              key={scent}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={filters.scentTypes.includes(scent)}
                onCheckedChange={() => handleScentToggle(scent)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {scent}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Size" defaultOpen={false}>
        <div className="space-y-3">
          {sizes.map((size) => (
            <label
              key={size}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={filters.sizes.includes(size)}
                onCheckedChange={() => handleSizeToggle(size)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {size}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability" defaultOpen={false}>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={filters.inStock}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, inStock: checked as boolean })
              }
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              In Stock Only
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <Checkbox
              checked={filters.onSale}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, onSale: checked as boolean })
              }
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              On Sale
            </span>
          </label>
        </div>
      </FilterSection>
    </div>
  );
};

export const ProductFilters = (props: ProductFiltersProps) => {
  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-[180px] max-h-[calc(100vh-200px)] overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin' }}>
          <h3 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </h3>
          <FilterContent {...props} />
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden sticky top-[96px] z-30 bg-background py-3 -mx-6 px-6 border-b border-border/30">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {props.activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {props.activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 flex flex-col">
            <SheetHeader>
              <SheetTitle className="text-left">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex-1 overflow-y-auto">
              <FilterContent {...props} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
