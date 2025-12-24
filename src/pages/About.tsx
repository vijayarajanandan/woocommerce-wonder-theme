import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Heart, Leaf, Award, Users } from "lucide-react";

// Import product images
import lavenderWhisper2 from "@/assets/products/lavender-whisper-2-enhanced.jpg";
import aboutBanner from "@/assets/about-banner.jpg";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url(${aboutBanner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                Our Story
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground mb-8">
                The Art of <span className="italic text-primary">Scent</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Born from a passion for craftsmanship and a love for beautiful fragrances, 
                Scentora creates luxury candles that transform spaces into sanctuaries.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 lg:py-32 border-t border-border/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={lavenderWhisper2}
                    alt="Scentora candle crafting"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-primary/30" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                  Our Beginning
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8 leading-tight">
                  A Dream <br />
                  <span className="italic text-primary">Ignited</span>
                </h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Scentora was founded in 2019 with a simple mission: to create the finest 
                    scented candles that bring luxury and tranquility to everyday moments.
                  </p>
                  <p>
                    Our founder, inspired by travels across India and the world, discovered the 
                    profound impact that scent has on our emotions and memories. Each candle 
                    in our collection is a carefully crafted story, designed to transport you 
                    to places of beauty and serenity.
                  </p>
                  <p>
                    Today, we hand-pour every candle using 100% natural soy wax, 
                    premium fragrance oils, and lead-free cotton wicks. We believe in sustainable 
                    luxury that doesn't compromise on quality or the environment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 lg:py-32 bg-secondary/20 border-y border-border/30">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                What We Believe
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground">
                Our Values
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Passion",
                  description: "Every candle is crafted with love and attention to the smallest details."
                },
                {
                  icon: Leaf,
                  title: "Sustainability",
                  description: "We use eco-friendly materials and sustainable practices in everything we do."
                },
                {
                  icon: Award,
                  title: "Quality",
                  description: "Only the finest ingredients make it into our candles—no compromises."
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "We support local artisans and give back to our community."
                }
              ].map((value, index) => (
                <div 
                  key={value.title}
                  className="text-center p-8 border border-border/30 bg-background/50 opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 mx-auto mb-6 border border-primary/30 flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 lg:py-32">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-medium">
                The Craft
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-foreground">
                Our Process
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Source",
                  description: "We carefully select the finest natural soy wax and premium fragrance oils from trusted suppliers."
                },
                {
                  step: "02",
                  title: "Blend",
                  description: "Our master chandlers expertly blend fragrances, testing each combination until it's perfect."
                },
                {
                  step: "03",
                  title: "Pour",
                  description: "Each candle is hand-poured in small batches, ensuring consistent quality and burn performance."
                }
              ].map((process, index) => (
                <div 
                  key={process.step}
                  className="text-center opacity-0 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <span className="font-display text-6xl text-primary/20">{process.step}</span>
                  <h3 className="font-display text-2xl text-foreground mb-4 -mt-4">{process.title}</h3>
                  <p className="text-muted-foreground">{process.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
