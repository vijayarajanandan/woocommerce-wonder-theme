import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We'll get back to you within 24 hours.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                Get In Touch
              </p>
              <h1 className="font-display text-5xl md:text-6xl text-foreground mb-6">
                Contact <span className="italic text-primary">Us</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Have a question or feedback? We'd love to hear from you.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Contact Info */}
              <div>
                <h2 className="font-display text-2xl text-foreground mb-8">Get in Touch</h2>
                
                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-foreground mb-1">Email</h3>
                      <a href="mailto:hello@scentora.in" className="text-muted-foreground hover:text-primary transition-colors">
                        hello@scentora.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-foreground mb-1">Phone</h3>
                      <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary transition-colors">
                        +91 98765 43210
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-foreground mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        123 Artisan Lane, Bandra West<br />
                        Mumbai, Maharashtra 400050
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-foreground mb-1">Hours</h3>
                      <p className="text-muted-foreground">
                        Mon - Sat: 10:00 AM - 7:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-secondary/20 border border-border/30">
                  <h3 className="font-display text-lg text-foreground mb-2">Wholesale Inquiries</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Interested in stocking Scentora candles in your store? 
                    Contact us for wholesale pricing and partnership opportunities.
                  </p>
                  <a 
                    href="mailto:wholesale@scentora.in" 
                    className="text-primary text-sm uppercase tracking-[0.15em] hover:underline"
                  >
                    wholesale@scentora.in
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="font-display text-2xl text-foreground mb-8">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-secondary/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-secondary/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-secondary/30 border border-border text-foreground focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="wholesale">Wholesale Inquiry</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-secondary/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
