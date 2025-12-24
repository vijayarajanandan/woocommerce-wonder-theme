import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MessageCircle } from "lucide-react";

const faqCategories = [
  {
    title: "Orders & Shipping",
    faqs: [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping typically takes 5-7 business days within India. Express shipping is available for 2-3 business day delivery. International orders may take 10-15 business days depending on the destination."
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes! We offer free standard shipping on all orders over ₹2,000. For orders under ₹2,000, a flat shipping fee of ₹99 applies."
      },
      {
        question: "Can I track my order?",
        answer: "Absolutely! Once your order ships, you'll receive an email with a tracking number. You can also track your order by logging into your account and viewing your order history."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Please check our shipping policy for more details."
      }
    ]
  },
  {
    title: "Products & Care",
    faqs: [
      {
        question: "What type of wax do you use?",
        answer: "All our candles are made with 100% natural soy wax. Soy wax is eco-friendly, renewable, and burns cleaner than traditional paraffin wax, producing less soot and releasing scent more gradually."
      },
      {
        question: "How long do your candles burn?",
        answer: "Our standard 8oz candles burn for approximately 50-60 hours, while our larger 12oz candles can burn for 70-80 hours. Burn time depends on proper care and usage."
      },
      {
        question: "How should I care for my candle?",
        answer: "For the best experience: trim the wick to 1/4 inch before each burn, allow the wax to melt to the edges on the first burn (about 2-3 hours), never burn for more than 4 hours at a time, and keep away from drafts."
      },
      {
        question: "Are your candles safe for pets?",
        answer: "While our candles are made with natural ingredients, we recommend burning candles in well-ventilated areas and keeping them out of reach of pets. Some fragrances may be irritating to certain animals."
      }
    ]
  },
  {
    title: "Returns & Refunds",
    faqs: [
      {
        question: "What is your return policy?",
        answer: "We accept returns within 14 days of delivery for unused, unopened products in their original packaging. If you're not satisfied with your purchase, please contact our customer service team to initiate a return."
      },
      {
        question: "How do I return a product?",
        answer: "To return a product, email us at returns@scentora.com with your order number and reason for return. We'll provide you with a return shipping label and instructions."
      },
      {
        question: "When will I receive my refund?",
        answer: "Once we receive and inspect your return, refunds are processed within 5-7 business days. The refund will be credited to your original payment method."
      },
      {
        question: "What if my order arrives damaged?",
        answer: "We take great care in packaging, but if your order arrives damaged, please contact us within 48 hours with photos of the damage. We'll send a replacement at no additional cost."
      }
    ]
  },
  {
    title: "Account & Orders",
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Click on the account icon in the header and select 'Create Account'. Fill in your details and you'll have access to order tracking, saved addresses, and exclusive offers."
      },
      {
        question: "Can I modify or cancel my order?",
        answer: "Orders can be modified or cancelled within 2 hours of placing them. After that, orders enter our fulfillment process and cannot be changed. Please contact us immediately if you need to make changes."
      },
      {
        question: "Do you offer gift wrapping?",
        answer: "Yes! We offer beautiful gift wrapping for an additional ₹99. You can add gift wrapping at checkout, and we'll include a handwritten note with your message."
      },
      {
        question: "How do I use a promo code?",
        answer: "Enter your promo code in the 'Promo Code' field at checkout and click 'Apply'. The discount will be reflected in your order total before payment."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-[137px]">
        {/* Hero */}
        <section className="py-16 lg:py-20 text-center border-b border-border/30">
          <div className="container mx-auto px-6 lg:px-12">
            <ScrollReveal>
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                Help Center
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Find answers to common questions about our products, shipping, and more.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
            {faqCategories.map((category, categoryIndex) => (
              <ScrollReveal key={category.title} delay={categoryIndex * 100}>
                <div className="mb-12">
                  <h2 className="font-display text-2xl text-foreground mb-6 pb-3 border-b border-border/30">
                    {category.title}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${category.title}-${index}`}
                        className="border border-border/30 px-6 data-[state=open]:border-primary/30 transition-colors"
                      >
                        <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-5">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </ScrollReveal>
            ))}

            {/* Still Have Questions */}
            <ScrollReveal delay={400}>
              <div className="text-center mt-16 p-10 border border-border/30 bg-secondary/20">
                <MessageCircle className="h-10 w-10 mx-auto text-primary mb-4" />
                <h3 className="font-display text-2xl text-foreground mb-3">Still have questions?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Can't find what you're looking for? Our customer support team is here to help.
                </p>
                <Button asChild>
                  <Link to="/contact">Contact Us</Link>
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

export default FAQ;
