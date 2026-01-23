import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Server,
  Cpu,
  HardDrive,
  Shield,
  Settings,
  Zap,
  Check,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Server,
    title: "Dedicated Resources",
    description: "Guaranteed CPU, RAM, and storage for consistent performance",
  },
  {
    icon: Cpu,
    title: "Full Root Access",
    description: "Complete control over your server environment",
  },
  {
    icon: HardDrive,
    title: "NVMe SSD Storage",
    description: "Ultra-fast storage for maximum I/O performance",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Advanced protection against network attacks",
  },
  {
    icon: Settings,
    title: "Custom Configuration",
    description: "Install any software or configure as needed",
  },
  {
    icon: Zap,
    title: "Instant Scaling",
    description: "Scale resources up or down as your needs change",
  },
];

const plans = [
  {
    name: "VPS Basic",
    price: "₹599",
    specs: {
      cpu: "2 vCPU Cores",
      ram: "4GB RAM",
      storage: "80GB NVMe SSD",
      bandwidth: "2TB Bandwidth",
    },
  },
  {
    name: "VPS Pro",
    price: "₹999",
    specs: {
      cpu: "4 vCPU Cores",
      ram: "8GB RAM",
      storage: "160GB NVMe SSD",
      bandwidth: "4TB Bandwidth",
    },
    popular: true,
  },
  {
    name: "VPS Enterprise",
    price: "₹1999",
    specs: {
      cpu: "8 vCPU Cores",
      ram: "16GB RAM",
      storage: "320GB NVMe SSD",
      bandwidth: "Unlimited",
    },
  },
];

const VpsHosting = () => {
  return (
    <>
      <Helmet>
        <title>VPS Hosting - Scalable Virtual Servers with Full Control | Quantivue AI</title>
        <meta
          name="description"
          content="Get powerful VPS hosting with dedicated resources, full root access, and instant scaling. Starting at ₹599/month."
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
                  <Server className="h-4 w-4" />
                  Full Control & Flexibility
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                  Scalable VPS Hosting with{" "}
                  <span className="text-accent">Full Control</span>
                </h1>
                <p className="text-xl text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
                  Get dedicated resources, root access, and the flexibility to run any application. Perfect for growing businesses and developers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="accent" size="xl" asChild>
                    <Link to="/pricing">
                      View VPS Plans <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="xl"
                    className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
                    asChild
                  >
                    <Link to="/contact">Contact Sales</Link>
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
                  Powerful VPS Features
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Enterprise-grade infrastructure with the flexibility you need.
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

          {/* VPS Plans */}
          <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Choose Your VPS Plan
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                    <div className="mt-2 mb-6">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent" />
                        {plan.specs.cpu}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent" />
                        {plan.specs.ram}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent" />
                        {plan.specs.storage}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent" />
                        {plan.specs.bandwidth}
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent" />
                        Full Root Access
                      </li>
                      <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-accent" />
                        DDoS Protection
                      </li>
                    </ul>
                    <Button variant={plan.popular ? "accent" : "outline"} className="w-full" asChild>
                      <Link to="/signup">Get Started</Link>
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

export default VpsHosting;
