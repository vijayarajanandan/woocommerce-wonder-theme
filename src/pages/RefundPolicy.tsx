import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RotateCcw, Package, Clock, CreditCard } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                Returns & Exchanges
              </p>
              <h1 className="font-display text-5xl md:text-6xl text-foreground">
                Refund Policy
              </h1>
              <p className="text-muted-foreground mt-4">Last updated: December 2024</p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {[
                { icon: Clock, label: "Return Window", value: "14 Days" },
                { icon: RotateCcw, label: "Exchange", value: "Available" },
                { icon: CreditCard, label: "Refund Time", value: "7-10 Days" },
                { icon: Package, label: "Free Returns", value: "Over ₹2000" },
              ].map((item) => (
                <div key={item.label} className="p-6 border border-border/30 text-center">
                  <item.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className="font-display text-lg text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">Return Eligibility</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We want you to be completely satisfied with your Scentora purchase. If you're not happy 
                  with your order, we accept returns under the following conditions:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                  <li>Products must be returned within 14 days of delivery</li>
                  <li>Items must be unused, unburned, and in original packaging</li>
                  <li>All tags and seals must be intact</li>
                  <li>Products must not be damaged or show signs of use</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">Non-Returnable Items</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The following items cannot be returned:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                  <li>Candles that have been lit or burned</li>
                  <li>Products with broken seals</li>
                  <li>Gift cards</li>
                  <li>Sale or clearance items (unless defective)</li>
                  <li>Customized or personalized orders</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">How to Return</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <span className="font-display text-2xl text-primary/50">01</span>
                    <div>
                      <h3 className="font-display text-lg text-foreground">Initiate Return</h3>
                      <p className="text-muted-foreground text-sm">
                        Email us at returns@scentora.in with your order number and reason for return.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-display text-2xl text-primary/50">02</span>
                    <div>
                      <h3 className="font-display text-lg text-foreground">Receive Confirmation</h3>
                      <p className="text-muted-foreground text-sm">
                        We'll send you return instructions and a shipping label within 24 hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-display text-2xl text-primary/50">03</span>
                    <div>
                      <h3 className="font-display text-lg text-foreground">Ship the Product</h3>
                      <p className="text-muted-foreground text-sm">
                        Pack the item securely and ship using the provided label. Keep the tracking number.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-display text-2xl text-primary/50">04</span>
                    <div>
                      <h3 className="font-display text-lg text-foreground">Receive Refund</h3>
                      <p className="text-muted-foreground text-sm">
                        Once we receive and inspect the item, your refund will be processed within 7-10 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">Refund Details</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Refunds are issued to the original payment method</li>
                  <li>Shipping charges are non-refundable unless the return is due to our error</li>
                  <li>For orders over ₹2000, return shipping is free</li>
                  <li>For orders under ₹2000, a ₹99 return shipping fee applies</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">Exchanges</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Want a different fragrance? We're happy to exchange your unopened candle for another 
                  scent of equal or greater value (you pay the difference). Contact us at 
                  exchanges@scentora.in to arrange an exchange.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">Damaged or Defective Items</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you receive a damaged or defective product, please contact us within 48 hours of 
                  delivery with photos of the damage. We'll arrange a free replacement or full refund.
                </p>
              </section>

              <section>
                <div className="p-6 bg-secondary/20 border border-border/30">
                  <h3 className="font-display text-xl text-foreground mb-4">Need Help?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Our customer service team is here to help with any return or refund questions.
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-foreground">Email: returns@scentora.in</p>
                    <p className="text-foreground">Phone: +91 98765 43210</p>
                    <p className="text-muted-foreground">Mon-Sat, 10:00 AM - 7:00 PM IST</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
