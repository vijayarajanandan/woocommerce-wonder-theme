import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingBag, Lock, Truck, Package, CreditCard, Wallet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import scentoraLogo from "@/assets/scentora-logo.png";
import { useCreateOrder } from "@/hooks/useWooCommerce";
import { isWooCommerceConfigured } from "@/lib/woocommerce";
import { trackOrder, trackCartUpdate, trackPaymentMethodSelected } from "@/lib/matomo";

// =============================================================================
// SECURITY UTILITIES
// =============================================================================

const sanitizeAlphanumeric = (str: string, maxLength: number = 50): string => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, maxLength).replace(/^_+|_+$/g, '');
};

const sanitizeEmail = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase().substring(0, 254);
};

const sanitizePhone = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-10);
};

const sanitizeName = (name: string, maxLength: number = 100): string => {
  if (!name || typeof name !== 'string') return '';
  return name.replace(/[^a-zA-Z\s\-'\.]/g, '').replace(/\s+/g, ' ').trim().substring(0, maxLength);
};

const sanitizeAddress = (address: string, maxLength: number = 200): string => {
  if (!address || typeof address !== 'string') return '';
  return address.replace(/[<>\"'`]/g, '').replace(/\s+/g, ' ').trim().substring(0, maxLength);
};

const sanitizePincode = (pincode: string): string => {
  if (!pincode || typeof pincode !== 'string') return '';
  return pincode.replace(/\D/g, '').substring(0, 6);
};

const generateCustomerId = (email: string): string => {
  const emailPrefix = sanitizeAlphanumeric(email.split('@')[0], 20);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `cust_${emailPrefix || 'user'}_${timestamp}_${random}`;
};

// =============================================================================
// PAYMENT GATEWAY TYPES AND CONFIG
// =============================================================================

declare global {
  interface Window {
    Razorpay: any;
    Cashfree: any;
  }
}

const PAYMENT_CONFIG = {
  cashfree: {
    enabled: import.meta.env.VITE_CASHFREE_ENABLED === 'true',
    env: import.meta.env.VITE_CASHFREE_ENV || 'sandbox',
  },
  razorpay: {
    enabled: import.meta.env.VITE_RAZORPAY_ENABLED === 'true',
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID,
  },
  cod: {
    enabled: true,
  },
};

const getDefaultPaymentMethod = (): "cashfree" | "razorpay" | "cod" => {
  if (PAYMENT_CONFIG.cashfree.enabled) return "cashfree";
  if (PAYMENT_CONFIG.razorpay.enabled) return "razorpay";
  return "cod";
};

// =============================================================================
// FORM TYPES
// =============================================================================

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

interface FormErrors {
  [key: string]: string;
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

// =============================================================================
// SCRIPT LOADERS
// =============================================================================

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

const loadCashfreeScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// =============================================================================
// CASHFREE API TYPES
// =============================================================================

interface CashfreeOrderResponse {
  payment_session_id: string;
  order_id: string;
  cf_order_id: string;
}

interface CashfreeCartItem {
  item_id: string;
  item_name: string;
  item_description?: string;
  item_image_url?: string;
  item_details_url?: string;
  item_original_unit_price: number;
  item_discounted_unit_price: number;
  item_quantity: number;
  item_currency: string;
}

// =============================================================================
// CASHFREE API - CREATE ORDER WITH CART_DETAILS AT ROOT
// =============================================================================

const createCashfreeOrder = async (
  orderId: number,
  amount: number,
  customerDetails: {
    customerId: string;
    customerEmail: string;
    customerPhone: string;
    customerName: string;
  },
  cartItems: CashfreeCartItem[],
  shippingCharges: number
): Promise<{ success: true; data: CashfreeOrderResponse } | { success: false; error: string }> => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    if (!backendUrl) {
      return { success: false, error: "Payment system not configured. Please contact support." };
    }

    if (!amount || amount <= 0) {
      return { success: false, error: "Invalid order amount." };
    }

    if (!customerDetails.customerEmail || !customerDetails.customerPhone) {
      return { success: false, error: "Customer details are incomplete." };
    }

    const response = await fetch(`${backendUrl}/wp-json/scentora/v1/cashfree/create-order`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: `SCNT_${orderId}_${Date.now()}`,
        order_amount: Number(amount.toFixed(2)),
        order_currency: "INR",
        customer_details: {
          customerId: customerDetails.customerId,
          customerEmail: customerDetails.customerEmail,
          customerPhone: customerDetails.customerPhone,
          customerName: customerDetails.customerName,
        },
        order_meta: {
          return_url: `${window.location.origin}/order-confirmation?order=${orderId}&cf_order_id={order_id}`,
          notify_url: `${backendUrl}/wp-json/scentora/v1/cashfree/webhook`,
        },
        order_note: `Scentora Order #${orderId}`,
        // cart_details at ROOT level (plugin will pass it correctly to Cashfree)
        cart_details: {
          cart_items: cartItems,
          shipping_charges: shippingCharges,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.message || "Payment initialization failed.";
      console.error("Cashfree API error:", data);
      return { success: false, error: errorMessage };
    }
    
    if (!data.payment_session_id) {
      return { success: false, error: "Invalid response from payment gateway." };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Cashfree order creation error:", error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { success: false, error: "Unable to connect to payment server. Please check your internet connection." };
    }
    
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
};

// =============================================================================
// CASHFREE API - VERIFY PAYMENT STATUS
// =============================================================================

const verifyCashfreePayment = async (cfOrderId: string): Promise<{ success: boolean; status: string }> => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const response = await fetch(`${backendUrl}/wp-json/scentora/v1/cashfree/verify/${cfOrderId}`);
    const data = await response.json();
    
    console.log("Payment verification response:", data);
    
    if (response.ok) {
      // Cashfree order statuses: ACTIVE, PAID, EXPIRED
      return { 
        success: data.order_status === 'PAID', 
        status: data.order_status 
      };
    }
    return { success: false, status: 'ERROR' };
  } catch (error) {
    console.error("Payment verification error:", error);
    return { success: false, status: 'ERROR' };
  }
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const Checkout = () => {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<"cashfree" | "razorpay" | "cod">(getDefaultPaymentMethod());
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const createOrder = useCreateOrder();

  const shippingCost = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shippingCost;

  const handlePaymentMethodChange = (method: "cashfree" | "razorpay" | "cod") => {
    setPaymentMethod(method);
    setPaymentError(null);
    const methodNames = {
      cashfree: "Online Payment (Cashfree)",
      razorpay: "Online Payment (Razorpay)",
      cod: "Cash on Delivery",
    };
    trackPaymentMethodSelected(methodNames[method]);
  };

  useEffect(() => {
    if (items.length > 0) {
      trackCartUpdate(
        items.map((item) => ({
          id: item.candle.id,
          name: item.candle.name,
          category: item.candle.collection || 'Candles',
          price: item.candle.price,
          quantity: item.quantity,
        })),
        total
      );
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // =============================================================================
  // VALIDATION
  // =============================================================================

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    const email = sanitizeEmail(formData.email);
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    const phone = sanitizePhone(formData.phone);
    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (phone.length !== 10) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    } else if (!/^[6-9]/.test(phone)) {
      errors.phone = "Please enter a valid Indian mobile number";
    }

    const firstName = sanitizeName(formData.firstName);
    const lastName = sanitizeName(formData.lastName);
    if (!firstName) {
      errors.firstName = "First name is required";
    } else if (firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }
    if (!lastName) {
      errors.lastName = "Last name is required";
    } else if (lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    const address = sanitizeAddress(formData.address);
    if (!address) {
      errors.address = "Address is required";
    } else if (address.length < 10) {
      errors.address = "Please enter a complete address";
    }

    const city = sanitizeName(formData.city);
    if (!city) {
      errors.city = "City is required";
    }

    const state = sanitizeName(formData.state);
    if (!state) {
      errors.state = "State is required";
    }

    const pincode = sanitizePincode(formData.pincode);
    if (!pincode) {
      errors.pincode = "PIN code is required";
    } else if (pincode.length !== 6) {
      errors.pincode = "Please enter a valid 6-digit PIN code";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  // =============================================================================
  // CREATE WOOCOMMERCE ORDER
  // =============================================================================

  const createWooCommerceOrder = async () => {
    const sanitizedData = {
      first_name: sanitizeName(formData.firstName),
      last_name: sanitizeName(formData.lastName),
      address_1: sanitizeAddress(formData.address),
      address_2: sanitizeAddress(formData.apartment),
      city: sanitizeName(formData.city),
      state: sanitizeName(formData.state),
      postcode: sanitizePincode(formData.pincode),
      country: "IN",
      email: sanitizeEmail(formData.email),
      phone: sanitizePhone(formData.phone),
    };

    const paymentMethodMap = {
      cashfree: { method: "cashfree", title: "Cashfree" },
      razorpay: { method: "razorpay", title: "Razorpay" },
      cod: { method: "cod", title: "Cash on Delivery" },
    };

    const order = await createOrder.mutateAsync({
      billing: sanitizedData,
      shipping: sanitizedData,
      lineItems: items.map((item) => ({
        productId: item.candle.id,
        quantity: item.quantity,
      })),
      paymentMethod: paymentMethodMap[paymentMethod].method,
      paymentMethodTitle: paymentMethodMap[paymentMethod].title,
    });

    return order;
  };

  const trackOrderInMatomo = (orderId: number) => {
    trackOrder({
      orderId: orderId.toString(),
      total: total,
      subtotal: subtotal,
      tax: 0,
      shipping: shippingCost,
      items: items.map((item) => ({
        id: item.candle.id,
        name: item.candle.name,
        category: item.candle.collection || 'Candles',
        price: item.candle.price,
        quantity: item.quantity,
      })),
    });
  };

  // =============================================================================
  // RAZORPAY PAYMENT HANDLER
  // =============================================================================

  const handleRazorpayPayment = async (orderId: number): Promise<{ success: boolean; error?: string }> => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      return { success: false, error: "Failed to load payment gateway. Please refresh and try again." };
    }

    if (!PAYMENT_CONFIG.razorpay.keyId) {
      return { success: false, error: "Payment gateway not configured. Please contact support." };
    }

    return new Promise((resolve) => {
      const options = {
        key: PAYMENT_CONFIG.razorpay.keyId,
        amount: Math.round(total * 100),
        currency: "INR",
        name: "Scentora",
        description: `Order #${orderId}`,
        handler: function (response: any) {
          console.log("Razorpay payment successful:", response);
          resolve({ success: true });
        },
        prefill: {
          name: `${sanitizeName(formData.firstName)} ${sanitizeName(formData.lastName)}`,
          email: sanitizeEmail(formData.email),
          contact: sanitizePhone(formData.phone),
        },
        theme: { color: "#D4AF37" },
        modal: {
          ondismiss: function () {
            resolve({ success: false, error: "Payment was cancelled." });
          },
          escape: false,
          backdropclose: false,
        },
      };

      try {
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', function (response: any) {
          console.error("Razorpay payment failed:", response.error);
          resolve({ 
            success: false, 
            error: response.error?.description || "Payment failed. Please try again." 
          });
        });
        razorpay.open();
      } catch (error) {
        console.error("Razorpay initialization error:", error);
        resolve({ success: false, error: "Failed to initialize payment. Please try again." });
      }
    });
  };

  // =============================================================================
  // CASHFREE PAYMENT HANDLER - WITH PROPER VERIFICATION
  // =============================================================================

  const handleCashfreePayment = async (orderId: number): Promise<{ success: boolean; error?: string }> => {
    setProcessingStep("Loading payment gateway...");
    
    const scriptLoaded = await loadCashfreeScript();
    if (!scriptLoaded) {
      return { success: false, error: "Failed to load payment gateway. Please refresh and try again." };
    }

    setProcessingStep("Creating payment session...");

    const customerDetails = {
      customerId: generateCustomerId(formData.email),
      customerEmail: sanitizeEmail(formData.email),
      customerPhone: sanitizePhone(formData.phone),
      customerName: `${sanitizeName(formData.firstName)} ${sanitizeName(formData.lastName)}`.trim(),
    };

    // Build cart items with CORRECT Cashfree structure
    const cartItems: CashfreeCartItem[] = items.map(item => ({
      item_id: `SCNT-${item.candle.id}`,
      item_name: item.candle.name.substring(0, 50),
      item_description: (item.candle.collection || 'Luxury Candle').substring(0, 200),
      item_image_url: item.candle.images?.[0] || '',
      item_details_url: `${window.location.origin}/candle/${item.candle.id}`,
      item_original_unit_price: item.candle.price,
      item_discounted_unit_price: item.candle.price,
      item_quantity: item.quantity,
      item_currency: "INR",
    }));

    const result = await createCashfreeOrder(orderId, total, customerDetails, cartItems, shippingCost);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    setProcessingStep("Opening payment window...");

    // Store cf_order_id for verification
    const cfOrderId = result.data.order_id;
    console.log("Cashfree order created:", cfOrderId);

    return new Promise((resolve) => {
      try {
        const cashfree = window.Cashfree({
          mode: PAYMENT_CONFIG.cashfree.env === "production" ? "production" : "sandbox",
        });

        cashfree.checkout({
          paymentSessionId: result.data.payment_session_id,
          redirectTarget: "_modal",
        }).then(async (checkoutResult: any) => {
          console.log("Cashfree checkout result:", checkoutResult);

          // CASE 1: Explicit error from SDK
          if (checkoutResult.error) {
            console.error("Cashfree payment error:", checkoutResult.error);
            resolve({ 
              success: false, 
              error: checkoutResult.error.message || "Payment failed. Please try again." 
            });
            return;
          }
          
          // CASE 2: paymentDetails with explicit paymentStatus
          if (checkoutResult.paymentDetails?.paymentStatus) {
            const status = checkoutResult.paymentDetails.paymentStatus;
            console.log("Payment status from SDK:", status);
            
            if (status === "SUCCESS") {
              resolve({ success: true });
            } else {
              resolve({ 
                success: false, 
                error: `Payment ${status.toLowerCase()}. Please try again.` 
              });
            }
            return;
          }
          
          // CASE 3: "Payment finished. Check status." - VERIFY VIA API
          if (checkoutResult.paymentDetails?.paymentMessage) {
            console.log("Payment message received, verifying via API...");
            setProcessingStep("Verifying payment status...");
            
            // Wait for payment to process on Cashfree's end
            await new Promise(r => setTimeout(r, 2000));
            
            // Verify payment status via API
            const verification = await verifyCashfreePayment(cfOrderId);
            console.log("Verification result:", verification);
            
            if (verification.success || verification.status === 'PAID') {
              resolve({ success: true });
            } else if (verification.status === 'ACTIVE') {
              // Payment still pending - might need more time
              setProcessingStep("Payment processing, please wait...");
              await new Promise(r => setTimeout(r, 3000));
              
              // Try verification again
              const retryVerification = await verifyCashfreePayment(cfOrderId);
              console.log("Retry verification result:", retryVerification);
              
              if (retryVerification.success || retryVerification.status === 'PAID') {
                resolve({ success: true });
              } else {
                resolve({ 
                  success: false, 
                  error: "Payment is still being processed. Please check your order status or try again." 
                });
              }
            } else {
              resolve({ 
                success: false, 
                error: "Payment was not completed. Please try again." 
              });
            }
            return;
          }
          
          // CASE 4: Redirect happened (unlikely with modal)
          if (checkoutResult.redirect) {
            console.log("Redirect detected");
            resolve({ success: true });
            return;
          }
          
          // CASE 5: Modal closed without payment info - verify anyway
          console.log("No explicit status, verifying payment...");
          setProcessingStep("Checking payment status...");
          
          await new Promise(r => setTimeout(r, 1500));
          const finalVerification = await verifyCashfreePayment(cfOrderId);
          
          if (finalVerification.success || finalVerification.status === 'PAID') {
            resolve({ success: true });
          } else {
            resolve({ success: false, error: "Payment was cancelled or not completed." });
          }
          
        }).catch((error: any) => {
          console.error("Cashfree checkout error:", error);
          resolve({ success: false, error: "Payment failed. Please try again." });
        });
      } catch (error) {
        console.error("Cashfree initialization error:", error);
        resolve({ success: false, error: "Failed to initialize payment. Please try again." });
      }
    });
  };

  // =============================================================================
  // FORM SUBMISSION
  // =============================================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!validateForm()) {
      return;
    }

    if (!isWooCommerceConfigured()) {
      toast.error("Store is not configured. Please contact support.");
      return;
    }

    if (paymentMethod === "cashfree" && !PAYMENT_CONFIG.cashfree.enabled) {
      toast.error("Online payment is not available. Please select another payment method.");
      return;
    }

    if (paymentMethod === "razorpay" && !PAYMENT_CONFIG.razorpay.enabled) {
      toast.error("Online payment is not available. Please select another payment method.");
      return;
    }

    setIsProcessing(true);
    setProcessingStep("Creating your order...");

    let order: any = null;

    try {
      order = await createWooCommerceOrder();
      console.log("WooCommerce order created:", order.id);

      if (paymentMethod === "cod") {
        setProcessingStep("Confirming order...");
        trackOrderInMatomo(order.id);
        toast.success("Order placed successfully!");
        clearCart();
        navigate(`/order-confirmation?order=${order.id}`);
        return;
      }

      setProcessingStep("Processing payment...");
      
      let paymentResult: { success: boolean; error?: string };

      if (paymentMethod === "cashfree") {
        paymentResult = await handleCashfreePayment(order.id);
      } else if (paymentMethod === "razorpay") {
        paymentResult = await handleRazorpayPayment(order.id);
      } else {
        paymentResult = { success: false, error: "Invalid payment method selected." };
      }

      if (paymentResult.success) {
        trackOrderInMatomo(order.id);
        toast.success("Payment successful! Order placed.");
        clearCart();
        navigate(`/order-confirmation?order=${order.id}`);
      } else {
        const errorMessage = paymentResult.error || "Payment failed. Please try again.";
        setPaymentError(errorMessage);
        toast.error(errorMessage);
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      } else if (error.message?.includes('timeout')) {
        errorMessage = "Request timed out. Please try again.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setPaymentError(errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // =============================================================================
  // RENDER - EMPTY CART
  // =============================================================================

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-8">
        <div className="flex justify-center py-6 border-b border-border/30">
          <Link to="/"><img src={scentoraLogo} alt="Scentora" className="h-12 w-auto" /></Link>
        </div>
        <div className="max-w-2xl mx-auto px-6 text-center pt-24">
          <div className="w-24 h-24 border border-border/50 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h1 className="font-display text-4xl text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some products to your cart before checking out.</p>
          <Button asChild variant="gold" size="lg"><Link to="/shop">Shop Now</Link></Button>
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDER - CHECKOUT FORM
  // =============================================================================

  return (
    <div className="min-h-screen bg-background pt-8 pb-16">
      <div className="flex justify-center py-6 border-b border-border/30 mb-8">
        <Link to="/"><img src={scentoraLogo} alt="Scentora" className="h-12 w-auto" /></Link>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" />Back to Cart
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Checkout Form */}
          <div>
            <h1 className="font-display text-4xl text-foreground mb-8">Checkout</h1>

            {/* Payment Error Alert */}
            {paymentError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-500 font-medium">Payment Failed</p>
                  <p className="text-red-400 text-sm mt-1">{paymentError}</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Please try again or select a different payment method.
                  </p>
                </div>
              </div>
            )}

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
                      className={formErrors.email ? "border-red-500" : ""}
                      disabled={isProcessing}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
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
                      className={formErrors.phone ? "border-red-500" : ""}
                      disabled={isProcessing}
                    />
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
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
                        className={formErrors.firstName ? "border-red-500" : ""}
                        disabled={isProcessing}
                      />
                      {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        required 
                        placeholder="Last name" 
                        value={formData.lastName} 
                        onChange={handleInputChange}
                        className={formErrors.lastName ? "border-red-500" : ""}
                        disabled={isProcessing}
                      />
                      {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
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
                      className={formErrors.address ? "border-red-500" : ""}
                      disabled={isProcessing}
                    />
                    {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                  </div>
                  <div>
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input 
                      id="apartment" 
                      placeholder="Apartment, suite, unit, etc." 
                      value={formData.apartment} 
                      onChange={handleInputChange}
                      disabled={isProcessing}
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
                        className={formErrors.city ? "border-red-500" : ""}
                        disabled={isProcessing}
                      />
                      {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        required 
                        placeholder="State" 
                        value={formData.state} 
                        onChange={handleInputChange}
                        className={formErrors.state ? "border-red-500" : ""}
                        disabled={isProcessing}
                      />
                      {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
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
                        className={formErrors.pincode ? "border-red-500" : ""}
                        disabled={isProcessing}
                      />
                      {formErrors.pincode && <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>}
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        required 
                        value={formData.country} 
                        onChange={handleInputChange} 
                        placeholder="Country"
                        disabled={isProcessing}
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
                  {/* Cashfree Option */}
                  {PAYMENT_CONFIG.cashfree.enabled && (
                    <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "cashfree" ? "border-primary bg-primary/5" : "border-border/30 hover:border-border"} ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cashfree" 
                        checked={paymentMethod === "cashfree"} 
                        onChange={() => handlePaymentMethodChange("cashfree")} 
                        className="sr-only"
                        disabled={isProcessing}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cashfree" ? "border-primary" : "border-muted-foreground"}`}>
                        {paymentMethod === "cashfree" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Pay Online</p>
                        <p className="text-xs text-muted-foreground">Credit/Debit Card, UPI, Net Banking, Wallets</p>
                      </div>
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </label>
                  )}

                  {/* Razorpay Option */}
                  {PAYMENT_CONFIG.razorpay.enabled && !PAYMENT_CONFIG.cashfree.enabled && (
                    <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "razorpay" ? "border-primary bg-primary/5" : "border-border/30 hover:border-border"} ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="razorpay" 
                        checked={paymentMethod === "razorpay"} 
                        onChange={() => handlePaymentMethodChange("razorpay")} 
                        className="sr-only"
                        disabled={isProcessing}
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "razorpay" ? "border-primary" : "border-muted-foreground"}`}>
                        {paymentMethod === "razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <Wallet className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Pay Online (Razorpay)</p>
                        <p className="text-xs text-muted-foreground">Credit/Debit Card, UPI, Net Banking, Wallets</p>
                      </div>
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </label>
                  )}

                  {/* COD Option */}
                  <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border/30 hover:border-border"} ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={paymentMethod === "cod"} 
                      onChange={() => handlePaymentMethodChange("cod")} 
                      className="sr-only"
                      disabled={isProcessing}
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-primary" : "border-muted-foreground"}`}>
                      {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
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
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {processingStep || "Processing..."}
                  </span>
                ) : (
                  paymentMethod === "cod" ? `Place Order · ${formatPrice(total)}` : `Pay ${formatPrice(total)}`
                )}
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
                      <img src={item.candle.images[0]} alt={item.candle.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-primary/80">{item.candle.collection}</p>
                      <p className="font-display text-foreground">{item.candle.name}</p>
                      <p className="text-xs text-muted-foreground">{item.candle.size}</p>
                    </div>
                    <p className="text-sm font-medium text-foreground">{formatPrice(item.candle.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <Separator className="bg-border/30 mb-6" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Truck className="h-4 w-4" />Shipping</span>
                  <span className="text-foreground">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
                </div>
                {shippingCost > 0 && <p className="text-xs text-primary">Add {formatPrice(2000 - subtotal)} more for free shipping</p>}
                <p className="text-xs text-muted-foreground">All taxes are inclusive</p>
                <Separator className="bg-border/30" />
                <div className="flex justify-between">
                  <span className="font-display text-lg text-foreground">Total</span>
                  <span className="font-display text-2xl text-foreground">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Package className="h-5 w-5 text-primary" /><span>Secure Packaging</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Truck className="h-5 w-5 text-primary" /><span>Fast Delivery</span>
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