import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/currency";

export const CartSidebar = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border/30 z-50 animate-slide-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-border/30">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl tracking-wider">
                Your Cart
              </h2>
              <span className="text-xs text-muted-foreground">({itemCount})</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={closeCart} 
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
              <div className="w-20 h-20 border border-border/50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="font-display text-2xl text-foreground mb-3">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-8">
                Discover our luxury candle collection
              </p>
              <Button onClick={closeCart} asChild variant="gold">
                <Link to="/shop">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-8">
                <div className="py-6 space-y-6">
                  {items.map((item) => (
                    <div key={item.candle.id} className="flex gap-5 pb-6 border-b border-border/20 last:border-0">
                      <Link 
                        to={`/shop/${item.candle.slug}`} 
                        onClick={closeCart}
                        className="w-24 h-32 bg-secondary/30 flex-shrink-0 overflow-hidden group"
                      >
                        <img
                          src={item.candle.images[0]}
                          alt={item.candle.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-primary/80 mb-1">
                          {item.candle.collection}
                        </p>
                        <Link 
                          to={`/shop/${item.candle.slug}`} 
                          onClick={closeCart}
                          className="font-display text-lg text-foreground hover:text-primary transition-colors block mb-1"
                        >
                          {item.candle.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mb-3">
                          {item.candle.size} · {item.candle.weight}
                        </p>
                        <p className="text-sm font-medium text-foreground mb-3">
                          {formatPrice(item.candle.price)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.candle.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.candle.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-auto text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.candle.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="border-t border-border/30 px-8 py-6 space-y-4 bg-secondary/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Subtotal</span>
                  <span className="font-display text-2xl text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout
                </p>
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full"
                  onClick={closeCart}
                >
                  <Link to="/checkout" className="flex items-center justify-center gap-2">
                    Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full" 
                  onClick={closeCart}
                  asChild
                >
                  <Link to="/cart">View Cart</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
