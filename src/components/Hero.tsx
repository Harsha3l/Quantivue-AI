import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Headphones, ArrowRight } from "lucide-react";

const features = [
  { icon: Zap, label: "Free Migration" },
  { icon: Headphones, label: "24/7 Support" },
];

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-primary via-primary to-primary/95">
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Trusted by 10,000+ businesses worldwide
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-6 animate-slide-up leading-tight tracking-tight">
            Affordable Hosting for{" "}
            <span className="text-accent">Websites & Automation</span>
          </h1>

          {/* Subtext */}
          <p 
            className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-xl mx-auto animate-slide-up leading-relaxed"
            style={{ animationDelay: "0.1s" }}
          >
            Launch faster with secure, high-performance hosting. Perfect for
            websites, WordPress, and n8n automation workflows.
          </p>

          {/* Feature Pills */}
          <div 
            className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-foreground/10 text-primary-foreground"
              >
                <feature.icon className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="accent" size="xl" asChild>
              <Link to="/pricing">
                View Plans <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/signup">Get Started Free</Link>
            </Button>
          </div>

          {/* Stats */}
          <div 
            className="mt-16 pt-12 border-t border-primary-foreground/10 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground">99.9%</div>
              <div className="text-sm text-primary-foreground/60 mt-1">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground">24/7</div>
              <div className="text-sm text-primary-foreground/60 mt-1">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground">10K+</div>
              <div className="text-sm text-primary-foreground/60 mt-1">Customers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
