import { useState } from "react";
import { Tag, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PromoCodeInputProps {
  onApply: (discount: number, code: string) => void;
  onRemove: () => void;
  appliedCode: string | null;
  discount: number;
}

// Mock promo codes
const promoCodes: Record<string, { discount: number; type: "percent" | "fixed"; minOrder?: number }> = {
  WELCOME10: { discount: 10, type: "percent" },
  SCENTORA20: { discount: 20, type: "percent", minOrder: 2000 },
  FLAT100: { discount: 100, type: "fixed", minOrder: 1000 },
  FREESHIP: { discount: 99, type: "fixed" },
};

export const PromoCodeInput = ({
  onApply,
  onRemove,
  appliedCode,
  discount,
}: PromoCodeInputProps) => {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsValidating(true);
    
    // Simulate API validation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const normalizedCode = code.trim().toUpperCase();
    const promo = promoCodes[normalizedCode];

    if (promo) {
      const discountAmount = promo.type === "percent" ? promo.discount : promo.discount;
      onApply(discountAmount, normalizedCode);
      toast.success("Promo code applied!", {
        description: promo.type === "percent" 
          ? `${promo.discount}% discount applied` 
          : `₹${promo.discount} off applied`,
      });
      setCode("");
    } else {
      toast.error("Invalid promo code", {
        description: "Please check the code and try again.",
      });
    }

    setIsValidating(false);
  };

  const handleRemove = () => {
    onRemove();
    toast.info("Promo code removed");
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-3 rounded">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{appliedCode}</span>
          <Check className="h-4 w-4 text-primary" />
        </div>
        <button
          onClick={handleRemove}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
        </div>
        <Button
          onClick={handleApply}
          disabled={!code.trim() || isValidating}
          variant="outline"
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Try: WELCOME10, SCENTORA20, FLAT100
      </p>
    </div>
  );
};
