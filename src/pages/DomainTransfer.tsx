import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, Check, Shield, Clock, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Free Privacy Protection",
    description: "Keep your personal information private with free WHOIS protection.",
  },
  {
    icon: Clock,
    title: "1 Year Extension",
    description: "Get an extra year added to your domain registration.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our team is here to help with any transfer questions.",
  },
];

const DomainTransfer = () => {
  const [domain, setDomain] = useState("");
  const [authCode, setAuthCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI only - no actual transfer logic
  };

  return (
    <>
      <Helmet>
        <title>Transfer Domain - Quantivue AI</title>
        <meta
          name="description"
          content="Transfer your domain to Quantivue AI and get free privacy protection plus 1 year extension. Easy transfer process with 24/7 support."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24">
          {/* Hero */}
          <section className="py-20 gradient-hero text-primary-foreground">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-sm mb-6">
                  <ArrowRightLeft className="h-4 w-4 text-accent" />
                  Domain Transfer
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Transfer Your Domain
                </h1>
                <p className="text-lg text-primary-foreground/70 mb-8">
                  Move your domain to Quantivue AI and enjoy better service, free
                  privacy protection, and competitive pricing.
                </p>
              </div>
            </div>
          </section>

          {/* Transfer Form */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-xl mx-auto">
                <div className="bg-card rounded-2xl border border-border p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Start Your Transfer
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Domain Name
                      </label>
                      <Input
                        type="text"
                        placeholder="example.com"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Authorization Code (EPP Code)
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your auth code"
                        value={authCode}
                        onChange={(e) => setAuthCode(e.target.value)}
                        className="h-12"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Get this from your current registrar.
                      </p>
                    </div>
                    <Button type="submit" variant="accent" className="w-full h-12">
                      Initiate Transfer
                    </Button>
                  </form>
                </div>

                {/* Transfer Status (Static UI) */}
                <div className="mt-8 bg-card rounded-2xl border border-border p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Transfer Status
                  </h3>
                  <div className="space-y-3">
                    {["Submitted", "Verification", "Processing", "Complete"].map(
                      (step, index) => (
                        <div key={step} className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {index === 0 ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <span className="text-sm">{index + 1}</span>
                            )}
                          </div>
                          <span
                            className={`font-medium ${
                              index === 0
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                Why Transfer to Quantivue AI?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="p-6 bg-card rounded-xl border border-border text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {benefit.description}
                    </p>
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

export default DomainTransfer;
