import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Workflow,
  Server,
  Lock,
  Scale,
  Layout,
  Clock,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "Pre-configured n8n Environment",
    description:
      "Get started instantly with a fully configured n8n installation. No setup required.",
  },
  {
    icon: Clock,
    title: "Reliable Workflow Execution",
    description:
      "Your automation workflows run 24/7 with high availability and zero downtime.",
  },
  {
    icon: Lock,
    title: "Secure Credential Storage",
    description:
      "All your API keys and credentials are encrypted and securely stored.",
  },
  {
    icon: Scale,
    title: "Scalable Resources",
    description:
      "Easily scale your resources as your automation needs grow.",
  },
  {
    icon: Layout,
    title: "Automation Templates",
    description:
      "Access pre-built workflow templates to jumpstart your automation projects.",
  },
  {
    icon: Server,
    title: "Dedicated Resources",
    description:
      "Get dedicated CPU and memory for consistent workflow performance.",
  },
];

const N8nHosting = () => {
  return (
    <>
      <Helmet>
        <title>n8n Cloud Hosting - Quantivue AI</title>
        <meta
          name="description"
          content="Host your n8n automation workflows with dedicated resources, secure credential storage, and 24/7 reliability. Start automating today."
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
                    <Workflow className="h-4 w-4 text-accent" />
                    Automation Ready
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    n8n Cloud Hosting
                  </h1>
                  <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl">
                    Run your n8n automation workflows on our reliable, secure, and
                    scalable cloud infrastructure. No server management required.
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
                      <Link to="/signup">Get Started</Link>
                    </Button>
                  </div>
                </div>

                {/* Right Visual - Automation Workflow Mockup */}
                <div className="relative flex justify-center lg:justify-end">
                  <div className="relative max-w-md w-full">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                    
                    {/* Workflow diagram mockup */}
                    <div className="relative bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-2xl p-6 shadow-2xl">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-foreground/10">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#ff6d5a] rounded-lg flex items-center justify-center">
                            <Workflow className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-primary-foreground">n8n Workflow</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-xs text-primary-foreground/60">Active</span>
                        </div>
                      </div>
                      
                      {/* Workflow nodes */}
                      <div className="space-y-4">
                        {/* Node 1 - Trigger */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#ff6d5a]/20 border border-[#ff6d5a]/40 rounded-xl flex items-center justify-center">
                            <Clock className="h-5 w-5 text-[#ff6d5a]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-primary-foreground">Schedule Trigger</p>
                            <p className="text-xs text-primary-foreground/50">Every 5 minutes</p>
                          </div>
                        </div>
                        
                        {/* Connection line */}
                        <div className="flex items-center gap-4 pl-5">
                          <div className="w-0.5 h-6 bg-gradient-to-b from-[#ff6d5a] to-accent" />
                        </div>
                        
                        {/* Node 2 - HTTP Request */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-accent/20 border border-accent/40 rounded-xl flex items-center justify-center">
                            <Server className="h-5 w-5 text-accent" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-primary-foreground">HTTP Request</p>
                            <p className="text-xs text-primary-foreground/50">Fetch API data</p>
                          </div>
                        </div>
                        
                        {/* Connection line */}
                        <div className="flex items-center gap-4 pl-5">
                          <div className="w-0.5 h-6 bg-gradient-to-b from-accent to-green-400" />
                        </div>
                        
                        {/* Node 3 - Process */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-400/20 border border-green-400/40 rounded-xl flex items-center justify-center">
                            <Scale className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-primary-foreground">Transform Data</p>
                            <p className="text-xs text-primary-foreground/50">Process & filter</p>
                          </div>
                        </div>
                        
                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-primary-foreground/10">
                          <div className="text-center">
                            <p className="text-xl font-bold text-accent">1.2K</p>
                            <p className="text-xs text-primary-foreground/50">Executions</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-green-400">99%</p>
                            <p className="text-xs text-primary-foreground/50">Success</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-primary-foreground">24/7</p>
                            <p className="text-xs text-primary-foreground/50">Uptime</p>
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
                Powerful Automation Hosting
              </h2>
              <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                Everything you need to run your n8n workflows reliably.
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
                Ready to Automate?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get your n8n instance running in minutes.
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

export default N8nHosting;
