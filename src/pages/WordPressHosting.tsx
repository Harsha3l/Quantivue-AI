import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Zap,
  Shield,
  Settings,
  RefreshCw,
  Gauge,
  Layers,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "WordPress-Optimized Hosting",
    description:
      "Servers specifically tuned for WordPress performance with optimized caching and database configurations.",
  },
  {
    icon: Settings,
    title: "1-Click Installation",
    description:
      "Install WordPress instantly with a single click. No technical knowledge required.",
  },
  {
    icon: Layers,
    title: "Plugin & Theme Support",
    description:
      "Full support for all WordPress plugins and themes. Install anything you need.",
  },
  {
    icon: RefreshCw,
    title: "Managed Updates",
    description:
      "Automatic WordPress core, plugin, and theme updates to keep your site secure.",
  },
  {
    icon: Gauge,
    title: "Performance Optimization",
    description:
      "Built-in caching, CDN integration, and performance tweaks for faster load times.",
  },
  {
    icon: Shield,
    title: "Enhanced Security",
    description:
      "WordPress-specific security measures including malware scanning and firewall protection.",
  },
];

const WordPressHosting = () => {
  return (
    <>
      <Helmet>
        <title>WordPress Hosting - Quantivue AI</title>
        <meta
          name="description"
          content="Managed WordPress hosting with 1-click installation, automatic updates, and optimized performance. Start your WordPress site today."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24">
          {/* Hero */}
          <section className="min-h-[80vh] flex items-center gradient-hero text-primary-foreground py-20">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-sm mb-6">
                    <Zap className="h-4 w-4 text-accent" />
                    Optimized for WordPress
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    WordPress Hosting Made Simple
                  </h1>
                  <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl">
                    Launch your WordPress site with optimized hosting, automatic
                    updates, and expert support. Everything you need to succeed.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button variant="hero" size="lg" asChild>
                      <Link to="/pricing">
                        View Plans <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="heroOutline"
                      size="lg"
                      className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                      asChild
                    >
                      <Link to="/signup">Start Free Trial</Link>
                    </Button>
                  </div>
                </div>

                {/* Right Visual - WordPress Dashboard Mockup */}
                <div className="relative flex justify-center lg:justify-end">
                  <div className="relative max-w-md w-full">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                    
                    {/* Dashboard mockup */}
                    <div className="relative bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-6 shadow-2xl">
                      {/* Browser header */}
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-primary-foreground/10">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 bg-primary-foreground/10 rounded-full h-6 flex items-center px-3">
                          <span className="text-xs text-primary-foreground/50">yoursite.com/wp-admin</span>
                        </div>
                      </div>
                      
                      {/* WordPress dashboard content */}
                      <div className="space-y-4">
                        {/* WordPress logo area */}
                        <div className="flex items-center gap-3 p-3 bg-primary-foreground/5 rounded-xl">
                          <div className="w-10 h-10 bg-[#21759b] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">W</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-primary-foreground">WordPress Dashboard</p>
                            <p className="text-xs text-primary-foreground/50">Version 6.4</p>
                          </div>
                        </div>
                        
                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-primary-foreground/5 rounded-xl">
                            <p className="text-2xl font-bold text-accent">12</p>
                            <p className="text-xs text-primary-foreground/60">Posts</p>
                          </div>
                          <div className="p-3 bg-primary-foreground/5 rounded-xl">
                            <p className="text-2xl font-bold text-accent">8</p>
                            <p className="text-xs text-primary-foreground/60">Pages</p>
                          </div>
                          <div className="p-3 bg-primary-foreground/5 rounded-xl">
                            <p className="text-2xl font-bold text-accent">5</p>
                            <p className="text-xs text-primary-foreground/60">Plugins</p>
                          </div>
                          <div className="p-3 bg-primary-foreground/5 rounded-xl">
                            <p className="text-2xl font-bold text-accent">3</p>
                            <p className="text-xs text-primary-foreground/60">Themes</p>
                          </div>
                        </div>
                        
                        {/* Quick actions */}
                        <div className="flex gap-2">
                          <div className="flex-1 p-2 bg-[#21759b]/20 rounded-lg text-center">
                            <Layers className="h-4 w-4 mx-auto mb-1 text-primary-foreground/70" />
                            <p className="text-xs text-primary-foreground/70">New Post</p>
                          </div>
                          <div className="flex-1 p-2 bg-accent/20 rounded-lg text-center">
                            <Settings className="h-4 w-4 mx-auto mb-1 text-primary-foreground/70" />
                            <p className="text-xs text-primary-foreground/70">Settings</p>
                          </div>
                          <div className="flex-1 p-2 bg-primary-foreground/10 rounded-lg text-center">
                            <RefreshCw className="h-4 w-4 mx-auto mb-1 text-primary-foreground/70" />
                            <p className="text-xs text-primary-foreground/70">Updates</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-foreground mb-4">
                Why Choose WordPress Hosting?
              </h2>
              <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                Get the performance and features your WordPress site deserves.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-muted/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Launch Your WordPress Site?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get started with our optimized WordPress hosting today.
              </p>
              <Button variant="accent" size="lg" asChild>
                <Link to="/pricing">View Pricing Plans</Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default WordPressHosting;
