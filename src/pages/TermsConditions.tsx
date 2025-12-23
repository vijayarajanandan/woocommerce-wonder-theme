import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                Legal
              </p>
              <h1 className="font-display text-5xl md:text-6xl text-foreground">
                Terms & Conditions
              </h1>
              <p className="text-muted-foreground mt-4">Last updated: December 2024</p>
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to Scentora. These Terms and Conditions govern your use of our website 
                  (www.scentora.in) and the purchase of products from us. By accessing our website 
                  or placing an order, you agree to be bound by these terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">2. Products and Pricing</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All prices are listed in Indian Rupees (INR) and include applicable taxes.</li>
                  <li>We reserve the right to modify prices at any time without prior notice.</li>
                  <li>Product images are for illustration purposes; actual products may vary slightly.</li>
                  <li>Products are subject to availability; we reserve the right to limit quantities.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">3. Orders and Payment</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All orders are subject to acceptance and availability.</li>
                  <li>We accept major credit cards, debit cards, UPI, and net banking.</li>
                  <li>Payment is processed at the time of order placement.</li>
                  <li>We reserve the right to refuse or cancel any order at our discretion.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">4. Shipping and Delivery</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>We ship across India. International shipping is currently not available.</li>
                  <li>Delivery times are estimates and not guaranteed.</li>
                  <li>Risk of loss passes to you upon delivery to the carrier.</li>
                  <li>Please refer to our Shipping Policy for detailed information.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">5. Returns and Refunds</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Please refer to our separate Refund Policy for information on returns, exchanges, 
                  and refunds. Key points include:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                  <li>Unused products may be returned within 14 days of delivery.</li>
                  <li>Products must be in original packaging and condition.</li>
                  <li>Refunds are processed within 7-10 business days.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on this website, including text, graphics, logos, images, and software, 
                  is the property of Scentora and is protected by intellectual property laws. You may 
                  not use, reproduce, or distribute any content without our written permission.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">7. Product Safety</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Never leave a burning candle unattended.</li>
                  <li>Keep candles away from children, pets, and flammable materials.</li>
                  <li>Burn candles on a stable, heat-resistant surface.</li>
                  <li>Follow all safety instructions provided with the product.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the fullest extent permitted by law, Scentora shall not be liable for any indirect, 
                  incidental, special, or consequential damages arising from the use of our products or 
                  website. Our liability shall not exceed the amount paid by you for the product(s) in question.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">9. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms and Conditions are governed by the laws of India. Any disputes shall be 
                  subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">10. Contact</h2>
                <div className="p-6 bg-secondary/20 border border-border/30">
                  <p className="text-foreground font-medium">For questions about these Terms:</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Email: legal@scentora.in<br />
                    Phone: +91 98765 43210
                  </p>
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

export default TermsConditions;
