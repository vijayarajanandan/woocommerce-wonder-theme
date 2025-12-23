import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const PrivacyPolicy = () => {
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
                Privacy Policy
              </h1>
              <p className="text-muted-foreground mt-4">Last updated: December 2024</p>
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At Scentora, we collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                  <li>Name, email address, and phone number</li>
                  <li>Shipping and billing address</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Order history and preferences</li>
                  <li>Communications with our customer service team</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                  <li>Process and fulfill your orders</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Respond to your questions and concerns</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Improve our products and services</li>
                  <li>Prevent fraud and protect our business</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">3. Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, rent, or trade your personal information to third parties. We may share 
                  your information with:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                  <li>Service providers who assist in our operations (payment processors, shipping partners)</li>
                  <li>Legal authorities when required by law</li>
                  <li>Business partners with your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction. All 
                  payment transactions are encrypted using SSL technology.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">5. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your browsing experience, 
                  analyze site traffic, and understand where our visitors come from. You can control 
                  cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-muted-foreground">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Lodge a complaint with a supervisory authority</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">7. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-6 bg-secondary/20 border border-border/30">
                  <p className="text-foreground font-medium">Scentora Privacy Team</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Email: privacy@scentora.in<br />
                    Address: 123 Artisan Lane, Bandra West, Mumbai 400050
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

export default PrivacyPolicy;
