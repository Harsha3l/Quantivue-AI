import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
}

const PricingCard = ({
  name,
  price,
  period,
  features,
  isPopular = false,
  ctaText = "Get Started",
}: PricingCardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl",
        isPopular
          ? "bg-primary text-primary-foreground border-accent shadow-lg scale-105"
          : "bg-card text-card-foreground border-border hover:border-accent/30"
      )}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
          Most Popular
        </div>
      )}

      <div className="text-center mb-6">
        <h3
          className={cn(
            "text-xl font-semibold mb-2",
            isPopular ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {name}
        </h3>
        <div className="flex items-baseline justify-center gap-1">
          <span
            className={cn(
              "text-4xl font-bold",
              isPopular ? "text-primary-foreground" : "text-foreground"
            )}
          >
            {price}
          </span>
          <span
            className={cn(
              "text-sm",
              isPopular ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            /{period}
          </span>
        </div>
      </div>

      <ul className="flex-1 space-y-3 mb-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <div
              className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                isPopular ? "bg-accent" : "bg-accent/10"
              )}
            >
              <Check
                className={cn(
                  "h-3 w-3",
                  isPopular ? "text-accent-foreground" : "text-accent"
                )}
              />
            </div>
            <span
              className={cn(
                "text-sm",
                isPopular ? "text-primary-foreground/90" : "text-muted-foreground"
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        variant={isPopular ? "hero" : "accent"}
        className="w-full"
        asChild
      >
        <Link to="/signup">{ctaText}</Link>
      </Button>
    </div>
  );
};

export default PricingCard;
