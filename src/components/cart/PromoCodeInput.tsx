import { useState } from "react";
import { Tag, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useValidateCoupon } from "@/hooks/useWooCommerce";
import { isWooCommerceConfigured } from "@/lib/woocommerce";

interface PromoCodeInputProps {
  onApply: (discount: number, code: string, discountType: "percent" | "fixed") => void;
  onRemove: () => void;
  appliedCode: string | null;
  discount: number;
  cartSubtotal?: number; // Pass cart subtotal to validate minimum order requirements
}

// Fallback mock codes for when WooCommerce is not configured
const mockPromoCodes: Record<string, { discount: number; type: "percent" | "fixed"; minOrder?: number }> = {
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
  cartSubtotal = 0,
}: PromoCodeInputProps) => {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");

  const validateCoupon = useValidateCoupon();
  const wcConfigured = isWooCommerceConfigured();

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsValidating(true);
    const normalizedCode = code.trim().toUpperCase();

    try {
      if (wcConfigured) {
        // Validate against WooCommerce API
        const coupon = await validateCoupon.mutateAsync(normalizedCode);

        if (coupon) {
          // Check if coupon is valid
          if (coupon.status !== "publish") {
            toast.error("This coupon is no longer active");
            setIsValidating(false);
            return;
          }

          // Check usage limits
          if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
            toast.error("This coupon has reached its usage limit");
            setIsValidating(false);
            return;
          }

          // Check expiry date
          if (coupon.date_expires) {
            const expiryDate = new Date(coupon.date_expires);
            if (expiryDate < new Date()) {
              toast.error("This coupon has expired");
              setIsValidating(false);
              return;
            }
          }

          // Check minimum amount
          if (coupon.minimum_amount && parseFloat(coupon.minimum_amount) > cartSubtotal) {
            toast.error(`Minimum order of ₹${coupon.minimum_amount} required for this coupon`);
            setIsValidating(false);
            return;
          }

          // Check maximum amount
          if (coupon.maximum_amount && parseFloat(coupon.maximum_amount) < cartSubtotal) {
            toast.error(`This coupon is only valid for orders under ₹${coupon.maximum_amount}`);
            setIsValidating(false);
            return;
          }

          // Determine discount type and amount
          const wcDiscountType = coupon.discount_type; // percent, fixed_cart, fixed_product
          const discountAmount = parseFloat(coupon.amount);

          if (wcDiscountType === "percent") {
            setDiscountType("percent");
            onApply(discountAmount, coupon.code.toUpperCase(), "percent");
            toast.success("Promo code applied!", {
              description: `${discountAmount}% discount applied`,
            });
          } else {
            // fixed_cart or fixed_product
            setDiscountType("fixed");
            onApply(discountAmount, coupon.code.toUpperCase(), "fixed");
            toast.success("Promo code applied!", {
              description: `₹${discountAmount} off applied`,
            });
          }

          setCode("");
        } else {
          toast.error("Invalid promo code", {
            description: "Please check the code and try again.",
          });
        }
      } else {
        // Fallback to mock codes when WooCommerce is not configured
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

        const promo = mockPromoCodes[normalizedCode];

        if (promo) {
          // Check minimum order
          if (promo.minOrder && cartSubtotal < promo.minOrder) {
            toast.error(`Minimum order of ₹${promo.minOrder} required for this coupon`);
            setIsValidating(false);
            return;
          }

          setDiscountType(promo.type);
          onApply(promo.discount, normalizedCode, promo.type);
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
      }
    } catch (error) {
      console.error("Coupon validation error:", error);
      toast.error("Failed to validate coupon", {
        description: "Please try again later.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    onRemove();
    setDiscountType("percent");
    toast.info("Promo code removed");
  };

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-3 rounded">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{appliedCode}</span>
          <span className="text-xs text-primary">
            ({discountType === "percent" ? `${discount}% off` : `₹${discount} off`})
          </span>
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
            disabled={isValidating}
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
      {!wcConfigured && (
        <p className="text-[10px] text-muted-foreground">
          Try: WELCOME10, SCENTORA20, FLAT100
        </p>
      )}
    </div>
  );
};