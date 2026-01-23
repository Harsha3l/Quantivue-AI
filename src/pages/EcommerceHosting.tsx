import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ShoppingCart,
  CreditCard,
  Shield,
  Zap,
  Package,
  BarChart3,
  Check,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "E-commerce Ready",
    description: "Pre-configured for WooCommerce, Magento, and other platforms",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "PCI-compliant hosting for safe payment processing",
  },
  {
    icon: Shield,
    title: "SSL & Security",
    description: "Free SSL certificates and advanced security features",
  },
  {
    icon: Zap,
    title: "Fast Loading",
    description: "Optimized servers for quick page loads and better conversions",
  },
  {
    icon: Package,
    title: "Unlimited Products",
    description: "No limits on the number of products you can list",
  },
  {
    icon: BarChart3,
    title: "Analytics Ready",
    description: "Easy integration with analytics and tracking tools",
  },
];

const EcommerceHosting = () => {
  return (
    <>
      <Helmet>
        <title>E-commerce Hosting - High-Performance for Online Stores | Quantivue AI</title>
        <meta
          name="description"
          content="Launch your online store with high-performance e-commerce hosting. PCI-compliant, fast, and secure hosting starting at ₹449/month."
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm mb-6">
                  <ShoppingCart className="h-4 w-4" />
                  Built for Online Stores
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                  High-Performance Hosting for{" "}
                  <span className="text-accent">Online Stores</span>
                </h1>
                <p className="text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
                  Power your e-commerce business with blazing-fast, secure, and scalable hosting designed specifically for online stores.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="accent" size="xl" asChild>
                    <Link to="/pricing">
                      Start Selling Today <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
                    asChild
                  >
                    <Link to="/contact">Talk to Sales</Link>
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
                  Everything Your Store Needs
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  From secure payment processing to fast page loads, we've got everything covered for your online business.
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

          {/* Pricing Highlight */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  E-commerce Hosting Plan
                </h2>
                <div className="p-8 rounded-2xl bg-card border border-accent shadow-lg">
                  <div className="text-accent text-sm font-medium mb-2">
                    Best for Online Stores
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">₹449</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-left max-w-sm mx-auto">
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      1 E-commerce Website
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      100GB SSD Storage
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      Unlimited Bandwidth
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      Free Domain (1 Year)
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      Free SSL Certificate
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      Daily Automated Backups
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      PCI Compliant
                    </li>
                  </ul>
                  <Button variant="accent" size="xl" className="w-full" asChild>
                    <Link to="/signup">Get Started Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default EcommerceHosting;
