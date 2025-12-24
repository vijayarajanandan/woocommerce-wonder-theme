import { Link } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User, Heart, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { SearchModal } from "@/components/search/SearchModal";
import { AnnouncementBar } from "./AnnouncementBar";
import scentoraLogo from "@/assets/scentora-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigation = [
  { name: "Shop", href: "/shop" },
];

const collections = [
  { name: "All Collections", href: "/collections" },
  { name: "Signature Collection", href: "/shop?collection=signature" },
  { name: "Noir Collection", href: "/shop?collection=noir" },
  { name: "Botanical Garden", href: "/shop?collection=botanical" },
  { name: "Limited Edition", href: "/shop?collection=limited" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const { toggleCart, itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 41);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AnnouncementBar />
      <header className={`fixed left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/30 transition-all duration-300 ${isScrolled ? 'top-0' : 'top-[41px]'}`}>
        <nav className="container mx-auto px-6 lg:px-12">
          <div className="flex h-24 items-center justify-between">
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

              <div className="hidden lg:flex lg:gap-x-8 lg:items-center">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-[11px] font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Collections Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-[11px] font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-300">
                      Collections
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-background border border-border/50">
                    {collections.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link
                          to={item.href}
                          className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
                        >
                          {item.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link
                  to="/about"
                  className="text-[11px] font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Our Story
                </Link>
              </div>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center">
              <Link to="/" className="group py-2">
                <img 
                  src={scentoraLogo} 
                  alt="Scentora" 
                  className="h-12 lg:h-14 w-auto transition-opacity duration-300 group-hover:opacity-80"
                />
              </Link>
            </div>

            {/* Right - Icons */}
            <div className="flex items-center justify-end gap-1 w-1/3">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-primary hidden sm:flex"
                onClick={() => setSearchOpen(true)}
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

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground hover:text-primary"
                asChild
              >
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="sr-only">Wishlist</span>
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

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-8 border-t border-border/30 animate-fade-in">
              <div className="flex flex-col items-center space-y-6">
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                >
                  Shop
                </Link>

                {/* Mobile Collections Dropdown */}
                <Collapsible open={collectionsOpen} onOpenChange={setCollectionsOpen}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-sm font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
                    Collections
                    <ChevronDown className={`h-4 w-4 transition-transform ${collectionsOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-3 text-center">
                    {collections.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                >
                  Our Story
                </Link>

                <div className="flex items-center gap-6 pt-4 border-t border-border/30 w-full justify-center overflow-x-auto">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-body uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 whitespace-nowrap"
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

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};