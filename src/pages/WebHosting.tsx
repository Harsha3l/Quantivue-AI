import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Server,
  HardDrive,
  Mail,
  Check,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Server,
    title: "High-Performance Servers",
    description: "SSD-powered servers for blazing fast website loading speeds",
  },
  {
    icon: HardDrive,
    title: "Daily Backups",
    description: "Automatic daily backups to keep your data safe",
  },
  {
    icon: Mail,
    title: "Business Email",
    description: "Professional email accounts included with your hosting",
  },
];

const plans = [
  {
    name: "Starter",
    price: "₹99",
    features: ["1 Website", "20GB Storage", "50GB Bandwidth", "5 Business Emails", "Free SSL"],
  },
  {
    name: "Basic",
    price: "₹149",
    features: ["1 Website", "50GB Storage", "100GB Bandwidth", "10 Business Emails", "Free Domain"],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹199",
    features: ["Unlimited Websites", "100GB Storage", "Unlimited Bandwidth", "Unlimited Emails", "Daily Backup"],
  },
];

const WebHosting = () => {
  return (
    <>
      <Helmet>
        <title>Web Hosting - Fast & Reliable Hosting | Quantivue AI</title>
        <meta
          name="description"
          content="Get fast, reliable web hosting with daily backups and professional email. Starting at just ₹99/month."
        />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <PromoBanner />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative py-20 bg-gradient-to-b from-primary to-primary/95">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                  Fast & Reliable <span className="text-accent">Web Hosting</span>
                </h1>
                <p className="text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
                  Power your website with high-performance hosting. Get started with SSD storage, daily backups, and professional email.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="accent" size="xl" asChild>
                    <Link to="/pricing">
                      View Plans <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Everything You Need for Your Website
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our web hosting includes all the essential features to get your website online quickly and securely.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
                  >
                    <feature.icon className="h-10 w-10 text-accent mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Quick Plans Preview */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Choose Your Plan
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`p-6 rounded-xl bg-card border ${
                      plan.popular ? "border-accent shadow-lg" : "border-border"
                    }`}
                  >
                    {plan.popular && (
                      <div className="text-accent text-sm font-medium mb-2">Most Popular</div>
                    )}
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <div className="mt-2 mb-4">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant={plan.popular ? "accent" : "outline"} className="w-full" asChild>
                      <Link to="/pricing">Get Started</Link>
                    </Button>
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

export default WebHosting;
