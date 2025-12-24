import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail } from "lucide-react";
import scentoraIcon from "@/assets/scentora-icon.png";

export const Footer = () => {
  return (
    <footer className="bg-secondary/20 border-t border-border/30">
      <div className="container mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block group">
              <img 
                src={scentoraIcon} 
                alt="Scentora" 
                className="h-16 w-auto transition-opacity duration-300 group-hover:opacity-80"
              />
            </Link>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Handcrafted luxury candles, thoughtfully created to transform your space 
              into a sanctuary of scent and serenity. Natural wax, non-toxic, handmade with love.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              www.thescentora.com
            </p>
            <div className="mt-8 flex gap-4">
              <a
                href="https://instagram.com/thescentora"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@thescentora.com"
                className="w-10 h-10 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.25em] text-foreground mb-6">
              Shop
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Candles
                </Link>
              </li>
              <li>
                <Link to="/shop?collection=signature" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Signature Collection
                </Link>
              </li>
              <li>
                <Link to="/shop?collection=noir" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Noir Collection
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
            <h4 className="font-display text-sm uppercase tracking-[0.25em] text-foreground mb-6">
              Help
            </h4>
            <ul className="space-y-4">
              <li>
                <Link to="/shipping-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground tracking-wider">
            © {new Date().getFullYear()} SCENTORA. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-wider">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="text-xs text-muted-foreground hover:text-primary transition-colors tracking-wider">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
