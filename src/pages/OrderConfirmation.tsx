import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ShoppingBag, 
  Loader2, 
  Package, 
  Truck, 
  MapPin,
  Mail,
  Phone,
  CreditCard
} from "lucide-react";
import scentoraLogo from "@/assets/scentora-logo.png";
import { trackOrder } from "@/lib/matomo";
import { formatPrice } from "@/lib/currency";

// =============================================================================
// TYPES
// =============================================================================

type PaymentStatus = "loading" | "success" | "pending" | "failed" | "verifying";

interface OrderLineItem {
  name: string;
  quantity: number;
  total: number;
  price: number;
  image?: string;
  collection?: string;
  size?: string;
}

interface OrderDetails {
  id: number;
  status: string;
  status_label: string;
  date_created: string;
  total: number;
  subtotal: number;
  shipping_total: number;
  currency: string;
  currency_symbol: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: OrderLineItem[];
  payment_method: string;
  payment_method_title: string;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const verifyCashfreePayment = async (cfOrderId: string): Promise<{ status: string; amount?: number }> => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  const response = await fetch(`${backendUrl}/wp-json/scentora/v1/cashfree/verify/${cfOrderId}`);
  const data = await response.json();
  return {
    status: data.order_status || 'UNKNOWN',
    amount: data.order_amount,
  };
};

const fetchOrderDetails = async (orderId: number): Promise<OrderDetails | null> => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    const response = await fetch(`${backendUrl}/wp-json/scentora/v1/orders/${orderId}`);
    const data = await response.json();
    
    if (response.ok && data.success && data.order) {
      return data.order;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return null;
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const { clearCart, items, subtotal } = useCart();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("loading");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const orderId = searchParams.get("order");
  const cfOrderId = searchParams.get("cf_order_id");

  useEffect(() => {
    const processOrder = async () => {
      if (!orderId) {
        setPaymentStatus("failed");
        setErrorMessage("No order found.");
        return;
      }

      const orderIdNum = parseInt(orderId, 10);

      // First, fetch order details from WooCommerce
      setPaymentStatus("loading");
      const details = await fetchOrderDetails(orderIdNum);
      
      if (details) {
        setOrderDetails(details);
        
        // Check if order is already paid/processing
        if (details.status === "processing" || details.status === "completed") {
          setPaymentStatus("success");
          
          // Track order in Matomo and clear cart
          if (items.length > 0) {
            trackOrder({
              orderId: orderId,
              total: details.total,
              subtotal: details.subtotal,
              tax: 0,
              shipping: details.shipping_total,
              items: details.line_items.map((item, index) => ({
                id: index.toString(),
                name: item.name,
                category: item.collection || 'Candles',
                price: item.price,
                quantity: item.quantity,
              })),
            });
            clearCart();
          }
          return;
        }
        
        // If order is pending and we have a Cashfree order ID, verify payment
        if (details.status === "pending" && cfOrderId) {
          setPaymentStatus("verifying");
          
          try {
            // Wait a moment for Cashfree to process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const verification = await verifyCashfreePayment(cfOrderId);
            
            if (verification.status === "PAID") {
              setPaymentStatus("success");
              
              // Refetch order details to get updated status
              const updatedDetails = await fetchOrderDetails(orderIdNum);
              if (updatedDetails) {
                setOrderDetails(updatedDetails);
              }
              
              // Track and clear cart
              if (items.length > 0) {
                trackOrder({
                  orderId: orderId,
                  total: details.total,
                  subtotal: details.subtotal,
                  tax: 0,
                  shipping: details.shipping_total,
                  items: details.line_items.map((item, index) => ({
                    id: index.toString(),
                    name: item.name,
                    category: item.collection || 'Candles',
                    price: item.price,
                    quantity: item.quantity,
                  })),
                });
                clearCart();
              }
            } else if (verification.status === "ACTIVE") {
              // Payment still pending - retry once more
              await new Promise(resolve => setTimeout(resolve, 3000));
              const retry = await verifyCashfreePayment(cfOrderId);
              
              if (retry.status === "PAID") {
                setPaymentStatus("success");
                const updatedDetails = await fetchOrderDetails(orderIdNum);
                if (updatedDetails) setOrderDetails(updatedDetails);
                if (items.length > 0) clearCart();
              } else {
                setPaymentStatus("pending");
              }
            } else {
              setPaymentStatus("failed");
              setErrorMessage("Payment was not completed.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus("pending");
          }
          return;
        }
        
        // COD order or pending without Cashfree
        if (details.payment_method === "cod") {
          setPaymentStatus("success");
          if (items.length > 0) clearCart();
        } else {
          setPaymentStatus("pending");
        }
      } else {
        setPaymentStatus("failed");
        setErrorMessage("Could not retrieve order details.");
      }
    };

    processOrder();
  }, [orderId, cfOrderId]);

  // =============================================================================
  // RENDER - LOADING
  // =============================================================================

  if (paymentStatus === "loading" || paymentStatus === "verifying") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex justify-center py-6 border-b border-border/30">
          <Link to="/"><img src={scentoraLogo} alt="Scentora" className="h-12 w-auto" /></Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {paymentStatus === "verifying" ? "Verifying your payment..." : "Loading order details..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDER - FAILED
  // =============================================================================

  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex justify-center py-6 border-b border-border/30">
          <Link to="/"><img src={scentoraLogo} alt="Scentora" className="h-12 w-auto" /></Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <h1 className="font-display text-3xl text-foreground mb-4">Payment Failed</h1>
            <p className="text-muted-foreground mb-8">
              {errorMessage || "We couldn't process your payment. Please try again."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/cart">Return to Cart</Link>
              </Button>
              <Button asChild variant="gold">
                <Link to="/checkout">Try Again</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =============================================================================
  // RENDER - SUCCESS / PENDING
  // =============================================================================

  const isSuccess = paymentStatus === "success";
  const StatusIcon = isSuccess ? CheckCircle : Clock;
  const statusColor = isSuccess ? "text-green-500" : "text-yellow-500";
  const statusBg = isSuccess ? "bg-green-500/10" : "bg-yellow-500/10";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-center py-6 border-b border-border/30">
        <Link to="/"><img src={scentoraLogo} alt="Scentora" className="h-12 w-auto" /></Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Status Header */}
        <div className="text-center mb-12">
          <div className={`w-20 h-20 rounded-full ${statusBg} flex items-center justify-center mx-auto mb-6`}>
            <StatusIcon className={`h-10 w-10 ${statusColor}`} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            {isSuccess ? "Order Confirmed" : "Order Pending"}
          </p>
          <h1 className="font-display text-4xl text-foreground mb-4">
            {isSuccess ? "Thank You!" : "Almost There!"}
          </h1>
          <p className="text-muted-foreground">
            {isSuccess 
              ? "Your order has been received and is being prepared with care."
              : "Your order is awaiting payment confirmation."}
          </p>
        </div>

        {orderDetails && (
          <>
            {/* Order Info Card */}
            <div className="bg-secondary/20 border border-border/30 rounded-xl p-6 mb-8">
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Order Number</p>
                  <p className="font-display text-2xl text-foreground">#{orderDetails.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="font-display text-lg text-foreground capitalize">{orderDetails.status_label}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                  <p className="font-display text-2xl text-foreground">{formatPrice(orderDetails.total)}</p>
                </div>
              </div>
            </div>

            {/* Order Progress */}
            <div className="bg-secondary/10 border border-border/30 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isSuccess ? 'bg-green-500/20' : 'bg-primary/20'}`}>
                    <CheckCircle className={`h-6 w-6 ${isSuccess ? 'text-green-500' : 'text-primary'}`} />
                  </div>
                  <p className="text-sm font-medium text-foreground">Order Placed</p>
                  <p className="text-xs text-muted-foreground">Confirmed</p>
                </div>
                <div className="h-px bg-border/50 flex-1 mx-4" />
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-2">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Processing</p>
                  <p className="text-xs text-muted-foreground">1-2 days</p>
                </div>
                <div className="h-px bg-border/50 flex-1 mx-4" />
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-2">
                    <Truck className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Shipping</p>
                  <p className="text-xs text-muted-foreground">3-5 days</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-secondary/10 border border-border/30 rounded-xl p-6 mb-8">
              <h2 className="font-display text-xl text-foreground mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderDetails.line_items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-border/20 last:border-0 last:pb-0">
                    <div className="w-16 h-20 bg-secondary/30 rounded overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.collection && (
                        <p className="text-[9px] uppercase tracking-[0.2em] text-primary/80">{item.collection}</p>
                      )}
                      <p className="font-display text-foreground">{item.name}</p>
                      {item.size && <p className="text-xs text-muted-foreground">{item.size}</p>}
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-foreground">{formatPrice(item.total)}</p>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4 bg-border/30" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(orderDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {orderDetails.shipping_total > 0 ? formatPrice(orderDetails.shipping_total) : 'Free'}
                  </span>
                </div>
                <Separator className="my-2 bg-border/30" />
                <div className="flex justify-between">
                  <span className="font-display text-lg text-foreground">Total</span>
                  <span className="font-display text-xl text-foreground">{formatPrice(orderDetails.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Payment Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Shipping Address */}
              <div className="bg-secondary/10 border border-border/30 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg text-foreground">Shipping Address</h3>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="text-foreground font-medium">
                    {orderDetails.shipping.first_name} {orderDetails.shipping.last_name}
                  </p>
                  <p>{orderDetails.shipping.address_1}</p>
                  {orderDetails.shipping.address_2 && <p>{orderDetails.shipping.address_2}</p>}
                  <p>
                    {orderDetails.shipping.city}, {orderDetails.shipping.state} {orderDetails.shipping.postcode}
                  </p>
                </div>
              </div>

              {/* Contact & Payment */}
              <div className="bg-secondary/10 border border-border/30 rounded-xl p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Email</span>
                    </div>
                    <p className="text-sm text-foreground">{orderDetails.billing.email}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Phone</span>
                    </div>
                    <p className="text-sm text-foreground">{orderDetails.billing.phone}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Payment Method</span>
                    </div>
                    <p className="text-sm text-foreground">{orderDetails.payment_method_title}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Notification */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-lg text-foreground mb-1">Confirmation Email Sent</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email to <span className="text-foreground">{orderDetails.billing.email}</span> with 
                    your order details and tracking information.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to={`/account/orders/${orderId}`}>View Order Status</Link>
          </Button>
          <Button asChild variant="gold" size="lg">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;