import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative bg-secondary border-b border-border h-11">
      <div className="container mx-auto px-4 h-full flex items-center justify-center gap-4">
        <span className="text-sm text-foreground">
          🎉 Limited Time Offer: Get 2 Months FREE on Annual Plans!
        </span>

        <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground text-sm">
          <Clock className="h-3.5 w-3.5" />
          <span className="font-mono">
            {String(timeLeft.hours).padStart(2, "0")}:
            {String(timeLeft.minutes).padStart(2, "0")}:
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
        </div>

        <Link
          to="/pricing"
          className="text-sm font-medium text-accent hover:text-accent/80 transition-colors underline underline-offset-2"
        >
          Get Started
        </Link>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
