import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-border/50">
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/">
              <span className="font-display text-2xl tracking-[0.15em] text-foreground">
                SCENTORA
              </span>
            </Link>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-md">
              Handcrafted luxury candles, thoughtfully created to transform your space 
              into a sanctuary of scent and serenity.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-foreground mb-6">
              Shop
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Candles
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/shop?bestsellers=true" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-foreground mb-6">
              Help
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/candle-care" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Candle Care
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} SCENTORA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
