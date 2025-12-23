import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "Our Story", href: "/about" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { toggleCart, itemCount } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/30">
      <nav className="container mx-auto px-6 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          {/* Left - Navigation (Desktop) / Menu Button (Mobile) */}
          <div className="flex items-center gap-8 w-1/3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="hidden lg:flex lg:gap-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-[11px] font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="group">
              <span className="font-display text-2xl lg:text-3xl tracking-[0.2em] text-foreground group-hover:text-primary transition-colors duration-300">
                SCENTORA
              </span>
            </Link>
          </div>

          {/* Right - Icons */}
          <div className="flex items-center justify-end gap-2 w-1/3">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary hidden sm:flex"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Account */}
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary hidden sm:flex"
              asChild
            >
              <Link to="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Link>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="relative text-foreground hover:text-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {searchOpen && (
          <div className="py-4 border-t border-border/30 animate-fade-in">
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for candles..."
                autoFocus
                className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-8 border-t border-border/30 animate-fade-in">
            <div className="flex flex-col items-center space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center gap-6 pt-4 border-t border-border/30">
                <Link
                  to="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
