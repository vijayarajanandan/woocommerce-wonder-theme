import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

export const CartSidebar = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border z-50 animate-slide-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl tracking-wider">
                Your Cart ({itemCount})
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={closeCart} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-6" />
              <p className="font-display text-xl text-foreground mb-2">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mb-8">
                Discover our luxury candle collection
              </p>
              <Button onClick={closeCart} asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/shop">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 px-8">
                <div className="py-6 space-y-6">
                  {items.map((item) => (
                    <div key={item.candle.id} className="flex gap-4">
                      <div className="w-24 h-32 bg-secondary/50 flex-shrink-0">
                        <img
                          src={item.candle.images[0]}
                          alt={item.candle.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                          {item.candle.collection}
                        </p>
                        <h3 className="font-display text-lg text-foreground mt-1">
                          {item.candle.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.candle.size} · {item.candle.weight}
                        </p>
                        <p className="text-sm text-foreground mt-2">
                          ${item.candle.price}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-border"
                            onClick={() => updateQuantity(item.candle.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-border"
                            onClick={() => updateQuantity(item.candle.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.candle.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="border-t border-border px-8 py-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-wider text-muted-foreground">Subtotal</span>
                  <span className="font-display text-xl text-foreground">
                    ${subtotal}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping calculated at checkout
                </p>
                <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={closeCart}>
                  <Link to="/checkout">Checkout</Link>
                </Button>
                <Button variant="ghost" size="lg" className="w-full text-muted-foreground hover:text-foreground" onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
