import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const monthlyPlans = [
  {
    name: "Starter",
    price: "₹99",
    period: "month",
    features: [
      "1 Website",
      "20GB Storage",
      "50GB Bandwidth",
      "5 Business Emails",
      "Free SSL Certificate",
      "Free Migration",
    ],
  },
  {
    name: "Basic",
    price: "₹149",
    period: "month",
    features: [
      "1 Website",
      "50GB Storage",
      "100GB Bandwidth",
      "10 Business Emails",
      "Free Domain (1 Year)",
      "Daily Backup",
    ],
  },
  {
    name: "Premium",
    price: "₹199",
    period: "month",
    isPopular: true,
    features: [
      "Unlimited Websites",
      "100GB Storage",
      "Unlimited Bandwidth",
      "Unlimited Emails",
      "Domain Privacy Protection",
      "Staging Environment",
      "Daily Backup",
    ],
  },
  {
    name: "E-commerce",
    price: "₹449",
    period: "month",
    features: [
      "1 Website",
      "100GB Storage",
      "Unlimited Bandwidth",
      "E-commerce Ready",
      "Free Domain",
      "Daily Backup",
      "SSL Certificate",
    ],
  },
];

const yearlyPlans = [
  {
    name: "Starter",
    price: "₹999",
    period: "year",
    features: [
      "1 Website",
      "20GB Storage",
      "50GB Bandwidth",
      "5 Business Emails",
      "Free SSL Certificate",
      "Free Migration",
      "2 Months Free",
    ],
  },
  {
    name: "Basic",
    price: "₹1,499",
    period: "year",
    features: [
      "1 Website",
      "50GB Storage",
      "100GB Bandwidth",
      "10 Business Emails",
      "Free Domain (1 Year)",
      "Daily Backup",
      "2 Months Free",
    ],
  },
  {
    name: "Premium",
    price: "₹1,999",
    period: "year",
    isPopular: true,
    features: [
      "Unlimited Websites",
      "100GB Storage",
      "Unlimited Bandwidth",
      "Unlimited Emails",
      "Domain Privacy Protection",
      "Staging Environment",
      "Daily Backup",
      "2 Months Free",
    ],
  },
  {
    name: "E-commerce",
    price: "₹4,499",
    period: "year",
    features: [
      "1 Website",
      "100GB Storage",
      "Unlimited Bandwidth",
      "E-commerce Ready",
      "Free Domain",
      "Daily Backup",
      "SSL Certificate",
      "2 Months Free",
    ],
  },
];

const includedFeatures = [
  "Free SSL Certificate",
  "99.9% Uptime Guarantee",
  "Secure Hosting Environment",
  "Automatic Updates",
  "Email Hosting",
  "Free Website Migration",
  "24/7 Customer Support",
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const plans = isYearly ? yearlyPlans : monthlyPlans;

  return (
    <>
      <Helmet>
        <title>Hosting Plans & Pricing - Quantivue AI</title>
        <meta
          name="description"
          content="Affordable hosting plans starting at ₹99/month. Web hosting, WordPress hosting, and e-commerce hosting with free SSL, migration, and 24/7 support."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24">
          {/* Hero Section */}
          <section className="py-16 gradient-hero text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Simple, Transparent Pricing
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-8">
                Choose the perfect plan for your needs. All plans include free
                SSL, migration, and 24/7 support.
              </p>

              {/* Toggle */}
              <div className="flex items-center justify-center gap-4">
                <span
                  className={`font-medium ${
                    !isYearly
                      ? "text-primary-foreground"
                      : "text-primary-foreground/60"
                  }`}
                >
                  Monthly
                </span>
                <button
                  onClick={() => setIsYearly(!isYearly)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    isYearly ? "bg-accent" : "bg-primary-foreground/30"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full bg-primary-foreground transition-transform ${
                      isYearly ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
                <span
                  className={`font-medium flex items-center gap-2 ${
                    isYearly
                      ? "text-primary-foreground"
                      : "text-primary-foreground/60"
                  }`}
                >
                  Yearly
                  <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
                    Save 2 Months
                  </span>
                </span>
              </div>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-16 -mt-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {plans.map((plan) => (
                  <PricingCard key={plan.name} {...plan} />
                ))}
              </div>
            </div>
          </section>

          {/* Included Features */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                Included in All Plans
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {includedFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 p-4 bg-card rounded-lg border border-border"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Pricing;
