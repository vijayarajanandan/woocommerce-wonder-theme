import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { candles } from "@/data/candles";
import { Candle } from "@/types/candle";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Candle[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = candles.filter(
      (candle) =>
        candle.name.toLowerCase().includes(searchTerm) ||
        candle.tagline.toLowerCase().includes(searchTerm) ||
        candle.collection.toLowerCase().includes(searchTerm) ||
        candle.description.toLowerCase().includes(searchTerm) ||
        candle.fragranceNotes.top.some((note) => note.toLowerCase().includes(searchTerm)) ||
        candle.fragranceNotes.heart.some((note) => note.toLowerCase().includes(searchTerm)) ||
        candle.fragranceNotes.base.some((note) => note.toLowerCase().includes(searchTerm))
    );

    setResults(filtered.slice(0, 6));
  }, [query]);

  const handleSelect = (slug: string) => {
    navigate(`/shop/${slug}`);
    onClose();
    setQuery("");
  };

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

  if (!isOpen) return null;

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
              placeholder="Search for candles, scents, collections..."
              className="w-full pl-14 pr-14 py-5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
            />
            <button
              onClick={onClose}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto">
              {results.map((candle) => (
                <button
                  key={candle.id}
                  onClick={() => handleSelect(candle.slug)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left border-b border-border/50 last:border-0"
                >
                  <img
                    src={candle.images[0]}
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
          {query.trim() !== "" && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No candles found for "{query}"</p>
              <Link
                to="/shop"
                onClick={onClose}
                className="text-primary hover:underline mt-2 inline-block"
              >
                Browse all candles →
              </Link>
            </div>
          )}

          {/* Quick Links */}
          {query.trim() === "" && (
            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Lavender", "Vanilla", "Coffee", "Ocean", "Forest"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-sm border border-border hover:border-primary hover:text-primary transition-colors rounded-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
