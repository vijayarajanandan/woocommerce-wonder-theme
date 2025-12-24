import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnnouncementBarProps {
  message?: string;
  linkText?: string;
  linkHref?: string;
}

export const AnnouncementBar = ({
  message = "Free shipping on orders over ₹2000",
  linkText = "Shop Now",
  linkHref = "/shop"
}: AnnouncementBarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("announcement-dismissed");
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("announcement-dismissed", "true");
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`bg-primary text-primary-foreground py-2.5 px-4 text-center relative transition-all duration-300 ${
        isAnimating ? "opacity-0 -translate-y-full" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="container mx-auto flex items-center justify-center gap-2">
        <p className="text-xs sm:text-sm font-medium tracking-wide">
          {message}
          {linkText && linkHref && (
            <a 
              href={linkHref} 
              className="ml-2 underline underline-offset-2 hover:no-underline font-semibold"
            >
              {linkText} →
            </a>
          )}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
