import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingBag, Lock, Truck, Package } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/");
      setIsProcessing(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-24 h-24 border border-border/50 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h1 className="font-display text-4xl text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add some products to your cart before checking out.
          </p>
          <Button asChild variant="gold" size="lg">
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Checkout Form */}
          <div>
            <h1 className="font-display text-4xl text-foreground mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="font-display text-xl text-foreground">Contact Information</h2>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required placeholder="your@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" required placeholder="+91 98765 43210" />
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Shipping Address */}
              <div className="space-y-4">
                <h2 className="font-display text-xl text-foreground">Shipping Address</h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required placeholder="First name" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required placeholder="Last name" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" required placeholder="Street address" />
                  </div>
                  <div>
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input id="apartment" placeholder="Apartment, suite, unit, etc." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required placeholder="City" />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" required placeholder="State" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input id="pincode" required placeholder="PIN code" />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" required defaultValue="India" placeholder="Country" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Payment - Placeholder */}
              <div className="space-y-4">
                <h2 className="font-display text-xl text-foreground">Payment</h2>
                <div className="bg-secondary/30 border border-border/30 rounded-lg p-6 text-center">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Payment integration coming soon. Currently accepts COD.
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Place Order · ${formatPrice(total)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:pl-8 lg:border-l border-border/30">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.candle.id} className="flex gap-4">
                    <div className="relative w-20 h-24 bg-secondary/30 flex-shrink-0 overflow-hidden rounded">
                      <img
                        src={item.candle.images[0]}
                        alt={item.candle.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-primary/80">
                        {item.candle.collection}
                      </p>
                      <p className="font-display text-foreground">{item.candle.name}</p>
                      <p className="text-xs text-muted-foreground">{item.candle.size}</p>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {formatPrice(item.candle.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="bg-border/30 mb-6" />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Shipping
                  </span>
                  <span className="text-foreground">
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-primary">
                    Add {formatPrice(2000 - subtotal)} more for free shipping
                  </p>
                )}
                <Separator className="bg-border/30" />
                <div className="flex justify-between">
                  <span className="font-display text-lg text-foreground">Total</span>
                  <span className="font-display text-2xl text-foreground">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-border/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Package className="h-5 w-5 text-primary" />
                    <span>Secure Packaging</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Truck className="h-5 w-5 text-primary" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
