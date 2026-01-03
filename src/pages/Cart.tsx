import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";
import scentoraLogo from "@/assets/scentora-logo.png";
import { trackPromoCode } from "@/lib/matomo";

const Cart = () => {
  const { items, subtotal, itemCount, removeItem, updateQuantity } = useCart();
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");

  // Calculate discount amount based on type
  const discountAmount = promoCode 
    ? (discountType === "percent" 
        ? Math.round(subtotal * (discount / 100)) 
        : discount)
    : 0;
  const estimatedTotal = subtotal - discountAmount;

  const handleApplyPromo = (discountValue: number, code: string, type: "percent" | "fixed") => {
    setDiscount(discountValue);
    setPromoCode(code);
    setDiscountType(type);
    
    // Track promo code in Matomo
    trackPromoCode(code, discountValue, subtotal);
  };

  const handleRemovePromo = () => {
    setDiscount(0);
    setPromoCode(null);
    setDiscountType("percent");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-8">
        {/* Logo Header */}
        <div className="flex justify-center py-6 border-b border-border/30">
          <Link to="/">
            <img src={scentoraLogo} alt="Scentora" className="h-12 w-auto" />
          </Link>
        </div>
        <div className="max-w-2xl mx-auto px-6 text-center pt-24">
          <div className="w-24 h-24 border border-border/50 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h1 className="font-display text-4xl text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Discover our luxury candle collection and find your perfect scent.
          </p>
          <Button asChild variant="gold" size="lg">
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      {/* Logo Header */}
      <div className="flex justify-center py-6 border-b border-border/30 mb-8">
        <Link to="/">
          <img src={scentoraLogo} alt="Scentora" className="h-12 w-auto" />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="font-display text-4xl text-foreground mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {items.map((item) => (
              <div 
                key={item.candle.id} 
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-6 bg-secondary/20 border border-border/30 rounded-lg"
              >
                <Link 
                  to={`/shop/${item.candle.slug}`}
                  className="w-full sm:w-24 h-32 sm:h-36 bg-secondary/30 flex-shrink-0 overflow-hidden rounded group"
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
                    className="font-display text-lg sm:text-xl text-foreground hover:text-primary transition-colors block mb-1"
                  >
                    {item.candle.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mb-3 sm:mb-4">
                    {item.candle.size} · {item.candle.weight}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() => updateQuantity(item.candle.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <span className="text-sm w-6 sm:w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() => updateQuantity(item.candle.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 sm:gap-6">
                      <p className="font-display text-lg sm:text-xl text-foreground">
                        {formatPrice(item.candle.price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.candle.id)}
                      >
                        <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary/20 border border-border/30 rounded-lg p-6 sticky top-32">
              <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping & taxes calculated at checkout
                </p>
              </div>

              <Separator className="bg-border/30 mb-6" />

              {/* Promo Code */}
              <div className="mb-6">
                <PromoCodeInput
                  onApply={handleApplyPromo}
                  onRemove={handleRemovePromo}
                  appliedCode={promoCode}
                  discount={discount}
                  cartSubtotal={subtotal}
                />
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-primary">
                    Discount ({promoCode})
                  </span>
                  <span className="text-primary">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between mb-6">
                <span className="font-display text-lg text-foreground">Estimated Total</span>
                <span className="font-display text-2xl text-foreground">{formatPrice(estimatedTotal)}</span>
              </div>

              <Button asChild size="lg" className="w-full">
                <Link to="/checkout" className="flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;