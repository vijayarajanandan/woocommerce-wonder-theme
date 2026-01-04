/**
 * Search Modal - WooCommerce Integrated
 * 
 * Searches products from WooCommerce API in real-time.
 * Falls back to showing popular collections if search is empty.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { Candle } from "@/types/candle";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { trackSiteSearch, trackEvent } from "@/lib/matomo";

// WooCommerce hooks
import { useSearchProducts, useCategories } from "@/hooks/useWooCommerce";
import { isWooCommerceConfigured } from "@/lib/woocommerce";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if WooCommerce is configured
  const wcConfigured = isWooCommerceConfigured();

  // Search products from WooCommerce
  const { 
    data: searchResults, 
    isLoading: isSearching 
  } = useSearchProducts(debouncedQuery, 6);

  // Get categories for popular searches fallback
  const { data: categories } = useCategories();

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
      
      // Track search after debounce
      if (query.trim().length >= 2) {
        trackSiteSearch(query.trim(), 'Products', searchResults?.length || 0);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard and scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSelect = useCallback((candle: Candle) => {
    // Track search result click
    trackEvent('Search', 'Result Click', candle.name);
    navigate(`/shop/${candle.slug}`);
    onClose();
    setQuery("");
    setDebouncedQuery("");
  }, [navigate, onClose]);

  const handlePopularSearch = useCallback((term: string) => {
    trackEvent('Search', 'Popular Search Click', term);
    setQuery(term);
  }, []);

  const handleCategoryClick = useCallback((slug: string, name: string) => {
    trackEvent('Search', 'Category Click', name);
    navigate(`/shop?collection=${slug}`);
    onClose();
    setQuery("");
    setDebouncedQuery("");
  }, [navigate, onClose]);

  if (!isOpen) return null;

  // Popular search terms (static, but could be dynamic in future)
  const popularTerms = ["Lavender", "Vanilla", "Coffee", "Ocean", "Forest"];

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 container mx-auto px-6 pt-24">
        <div className="max-w-2xl mx-auto bg-background border border-border shadow-2xl animate-scale-in">
          {/* Search Input */}
          <div className="relative border-b border-border">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={wcConfigured ? "Search for candles, scents, collections..." : "Search is not available"}
              disabled={!wcConfigured}
              className="w-full pl-14 pr-14 py-5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg disabled:opacity-50"
            />
            {isSearching && (
              <Loader2 className="absolute right-14 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
            )}
            <button
              onClick={onClose}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Not Configured State */}
          {!wcConfigured && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">Search is not available. Store is not connected.</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="text-primary hover:underline mt-2 inline-block"
              >
                Browse all candles →
              </Link>
            </div>
          )}

          {/* Results */}
          {wcConfigured && searchResults && searchResults.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto">
              {searchResults.map((candle) => (
                <button
                  key={candle.id}
                  onClick={() => handleSelect(candle)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left border-b border-border/50 last:border-0"
                >
                  <img
                    src={candle.images[0] || '/placeholder.jpg'}
                    alt={candle.name}
                    className="w-16 h-20 object-cover bg-secondary/30"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">
                      {candle.collection}
                    </p>
                    <h4 className="font-display text-lg text-foreground truncate">
                      {candle.name}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {candle.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{formatPrice(candle.price)}</p>
                    {candle.regularPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(candle.regularPrice)}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {wcConfigured && debouncedQuery.trim() !== "" && !isSearching && (!searchResults || searchResults.length === 0) && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No candles found for "{debouncedQuery}"</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="text-primary hover:underline mt-2 inline-block"
              >
                Browse all candles →
              </Link>
            </div>
          )}

          {/* Quick Links - Show when no query */}
          {wcConfigured && query.trim() === "" && (
            <div className="p-6">
              {/* Popular Searches */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularTerms.map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePopularSearch(term)}
                      className="px-3 py-1.5 text-sm border border-border hover:border-primary hover:text-primary transition-colors rounded-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collections */}
              {categories && categories.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Browse Collections
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 6).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.slug, category.name)}
                        className="px-3 py-1.5 text-sm bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-colors rounded-sm"
                      >
                        {category.name}
                        {category.productCount !== undefined && category.productCount > 0 && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({category.productCount})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};