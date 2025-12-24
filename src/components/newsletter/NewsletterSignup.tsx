import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsSubmitting(false);
    toast.success("Welcome to the Scentora family!", {
      description: "Check your inbox for a special welcome offer.",
    });
  };

  if (isSubscribed) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Check className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-display text-xl text-foreground mb-2">
          You're In!
        </h3>
        <p className="text-sm text-muted-foreground">
          Thank you for subscribing. Check your inbox for exclusive offers.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl text-foreground">
          Join Our Community
        </h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-2">
        Get 10% off your first order
      </p>
      
      <p className="text-xs text-muted-foreground mb-6">
        Subscribe for exclusive offers, new arrivals, and fragrance tips.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 bg-background/50 border-border/50"
        />
        <Button type="submit" disabled={isSubmitting} size="icon" className="shrink-0">
          {isSubmitting ? (
            <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </form>

      <p className="text-[10px] text-muted-foreground/70 mt-4">
        By subscribing, you agree to our Privacy Policy and consent to receive updates.
      </p>
    </div>
  );
};