import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, Mail } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import confetti from "@/lib/confetti";

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order") || "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  useEffect(() => {
    // Trigger confetti on page load
    const timer = setTimeout(() => {
      confetti();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[137px]">
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
            <ScrollReveal>
              <div className="text-center mb-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                  Order Confirmed
                </p>
                <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
                  Thank You!
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your order has been received and is being prepared with care.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="border border-border/50 p-8 mb-8">
                <div className="text-center mb-8 pb-8 border-b border-border/30">
                  <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                  <p className="font-display text-2xl text-foreground">{orderId}</p>
                </div>

                {/* Order Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium text-foreground mb-1">Order Placed</p>
                    <p className="text-sm text-muted-foreground">Confirmed</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary border border-border/50 flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground mb-1">Processing</p>
                    <p className="text-sm text-muted-foreground">1-2 days</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-secondary border border-border/50 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-foreground mb-1">Shipping</p>
                    <p className="text-sm text-muted-foreground">3-5 days</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="flex items-start gap-4 p-6 bg-secondary/20 border border-border/30 mb-8">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Confirmation Email Sent</p>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email with your order details and tracking information.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/account">View Order Status</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
