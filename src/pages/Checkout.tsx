import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingBag, Lock, Truck, Package, CreditCard } from "lucide-react";
import { toast } from "sonner";
import scentoraLogo from "@/assets/scentora-logo.png";
import { useCreateOrder } from "@/hooks/useWooCommerce";
import { isWooCommerceConfigured } from "@/lib/woocommerce";

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

const initialFormData: FormData = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

// Load Razorpay script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  const createOrder = useCreateOrder();

  // Calculate shipping
  const shippingCost = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = (): boolean => {
    const required = ["email", "phone", "firstName", "lastName", "address", "city", "state", "pincode"];
    for (const field of required) {
      if (!formData[field as keyof FormData]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`);
        return false;
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    return true;
  };

  const createWooCommerceOrder = async () => {
    const addressData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      address_1: formData.address,
      address_2: formData.apartment,
      city: formData.city,
      state: formData.state,
      postcode: formData.pincode,
      country: "IN",
      email: formData.email,
      phone: formData.phone,
    };

    const order = await createOrder.mutateAsync({
      billing: addressData,
      shipping: addressData,
      lineItems: items.map((item) => ({
        productId: item.candle.id,
        quantity: item.quantity,
      })),
      paymentMethod: paymentMethod === "razorpay" ? "razorpay" : "cod",
      paymentMethodTitle: paymentMethod === "razorpay" ? "Razorpay" : "Cash on Delivery",
    });

    return order;
  };

  const handleRazorpayPayment = async (orderId: number, orderKey: string) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      return false;
    }

    return new Promise<boolean>((resolve) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100), // Razorpay expects paise
        currency: "INR",
        name: "Scentora",
        description: `Order #${orderId}`,
        order_id: orderKey, // This should ideally be a Razorpay order ID from your backend
        handler: function (response: any) {
          console.log("Payment successful:", response);
          resolve(true);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#D4AF37",
        },
        modal: {
          ondismiss: function () {
            resolve(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if WooCommerce is configured
    if (!isWooCommerceConfigured()) {
      toast.error("Store is not configured. Please contact support.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create WooCommerce order
      const order = await createWooCommerceOrder();
      console.log("Order created:", order);

      if (paymentMethod === "razorpay") {
        // Process Razorpay payment
        const paymentSuccess = await handleRazorpayPayment(order.id, order.order_key);

        if (paymentSuccess) {
          toast.success("Payment successful! Order placed.");
          clearCart();
          navigate(`/order-confirmation?order=${order.id}`);
        } else {
          toast.error("Payment cancelled. Your order is saved. You can retry payment.");
          navigate(`/order-confirmation?order=${order.id}&pending=true`);
        }
      } else {
        // COD order
        toast.success("Order placed successfully!");
        clearCart();
        navigate(`/order-confirmation?order=${order.id}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-8">
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
    <div className="min-h-screen bg-background pt-8 pb-16">
      <div className="flex justify-center py-6 border-b border-border/30 mb-8">
        <Link to="/">
          <img src={scentoraLogo} alt="Scentora" className="h-12 w-auto" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
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
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
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
                      <Input
                        id="firstName"
                        required
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        required
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      required
                      placeholder="Street address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input
                      id="apartment"
                      placeholder="Apartment, suite, unit, etc."
                      value={formData.apartment}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        required
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        required
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        required
                        placeholder="PIN code"
                        value={formData.pincode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              {/* Payment Method */}
              <div className="space-y-4">
                <h2 className="font-display text-xl text-foreground">Payment Method</h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "razorpay"
                        ? "border-primary bg-primary/5"
                        : "border-border/30 hover:border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "razorpay" ? "border-primary" : "border-muted-foreground"
                      }`}
                    >
                      {paymentMethod === "razorpay" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Pay Online</p>
                      <p className="text-xs text-muted-foreground">
                        Credit/Debit Card, UPI, Net Banking, Wallets
                      </p>
                    </div>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/5"
                        : "border-border/30 hover:border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "cod" ? "border-primary" : "border-muted-foreground"
                      }`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <Package className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </label>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                {isProcessing
                  ? "Processing..."
                  : paymentMethod === "razorpay"
                  ? `Pay ${formatPrice(total)}`
                  : `Place Order · ${formatPrice(total)}`}
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
                <p className="text-xs text-muted-foreground">All taxes are inclusive</p>
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