import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Truck, Clock, MapPin, Package } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                Delivery Information
              </p>
              <h1 className="font-display text-5xl md:text-6xl text-foreground">
                Shipping Policy
              </h1>
              <p className="text-muted-foreground mt-4">Last updated: December 2024</p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {[
                { icon: Truck, label: "Free Shipping", value: "Over ₹1500" },
                { icon: Clock, label: "Processing", value: "1-2 Days" },
                { icon: MapPin, label: "Delivery", value: "Pan India" },
                { icon: Package, label: "Tracking", value: "Available" },
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
                <h2 className="font-display text-2xl text-foreground mb-4">Shipping Rates</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border/30">
                    <thead>
                      <tr className="bg-secondary/20">
                        <th className="p-4 text-left text-foreground font-display">Order Value</th>
                        <th className="p-4 text-left text-foreground font-display">Standard Shipping</th>
                        <th className="p-4 text-left text-foreground font-display">Express Shipping</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground text-sm">
                      <tr className="border-t border-border/30">
                        <td className="p-4">Under ₹500</td>
                        <td className="p-4">₹99</td>
                        <td className="p-4">₹199</td>
                      </tr>
                      <tr className="border-t border-border/30">
                        <td className="p-4">₹500 - ₹1499</td>
                        <td className="p-4">₹49</td>
                        <td className="p-4">₹149</td>
                      </tr>
                      <tr className="border-t border-border/30">
                        <td className="p-4">₹1500 and above</td>
                        <td className="p-4 text-primary">FREE</td>
                        <td className="p-4">₹99</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">Delivery Times</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong className="text-foreground">Processing Time:</strong> 1-2 business days</li>
                  <li><strong className="text-foreground">Standard Shipping:</strong> 5-7 business days</li>
                  <li><strong className="text-foreground">Express Shipping:</strong> 2-3 business days</li>
                  <li><strong className="text-foreground">Metro Cities:</strong> Usually 3-5 business days for standard</li>
                </ul>
                <p className="text-muted-foreground text-sm mt-4">
                  * Delivery times are estimates and may vary based on location and courier availability.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">Delivery Areas</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We currently ship to all major cities and towns across India. Our delivery partners include 
                  BlueDart, Delhivery, and DTDC for reliable nationwide coverage.
                </p>
                <div className="mt-4 p-4 bg-secondary/20 border border-border/30">
                  <p className="text-foreground font-medium">Metro Cities:</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Mumbai, Delhi NCR, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad
                  </p>
                </div>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">Order Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once your order ships, you'll receive a confirmation email with tracking information. 
                  You can track your package using the tracking number provided.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">Packaging</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All Scentora candles are carefully packaged to ensure they arrive in perfect condition:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                  <li>Each candle is wrapped in protective tissue paper</li>
                  <li>Placed in a sturdy gift box</li>
                  <li>Shipped in a corrugated outer box with cushioning</li>
                  <li>Fragile stickers and handling instructions on all packages</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">Failed Delivery</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If delivery fails due to incorrect address, recipient unavailability (after 3 attempts), 
                  or refusal to accept the package, the order will be returned to us. In such cases:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                  <li>We'll contact you to arrange re-delivery</li>
                  <li>Additional shipping charges may apply</li>
                  <li>Unclaimed packages after 30 days will be processed as cancellations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">International Shipping</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We currently do not offer international shipping. We're working on expanding our 
                  delivery network and hope to ship internationally soon. Sign up for our newsletter 
                  to be notified when international shipping becomes available.
                </p>
              </section>

              <section>
                <div className="p-6 bg-secondary/20 border border-border/30">
                  <h3 className="font-display text-xl text-foreground mb-4">Shipping Questions?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Contact our support team for any shipping-related inquiries.
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-foreground">Email: shipping@scentora.in</p>
                    <p className="text-foreground">Phone: +91 98765 43210</p>
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

export default ShippingPolicy;
