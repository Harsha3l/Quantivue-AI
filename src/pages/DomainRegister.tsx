import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check, X, Globe } from "lucide-react";

const tldPricing = [
  { tld: ".com", price: "₹899", available: true },
  { tld: ".in", price: "₹499", available: true },
  { tld: ".net", price: "₹999", available: false },
  { tld: ".org", price: "₹1,099", available: true },
  { tld: ".io", price: "₹2,999", available: true },
  { tld: ".co", price: "₹1,499", available: true },
];

const DomainRegister = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearched(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register Domain - Quantivue AI</title>
        <meta
          name="description"
          content="Search and register your perfect domain name. Find available domains with competitive pricing and free privacy protection."
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
                  <Globe className="h-4 w-4 text-accent" />
                  Domain Registration
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Find Your Perfect Domain
                </h1>
                <p className="text-lg text-primary-foreground/70 mb-8">
                  Search for available domains and secure your online identity
                  today.
                </p>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your domain name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 text-lg bg-primary-foreground text-foreground border-0"
                      />
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="h-14 px-8">
                      Search
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          {/* Search Results */}
          {isSearched && (
            <section className="py-12 bg-muted/50">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Results for "{searchQuery}"
                </h2>
                <div className="space-y-3 max-w-3xl">
                  {tldPricing.map((item) => (
                    <div
                      key={item.tld}
                      className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
                    >
                      <div className="flex items-center gap-3">
                        {item.available ? (
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <X className="h-5 w-5 text-red-600" />
                          </div>
                        )}
                        <span className="font-semibold text-foreground">
                          {searchQuery.replace(/\..+$/, "")}
                          {item.tld}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-foreground">
                          {item.price}/year
                        </span>
                        <Button
                          variant={item.available ? "accent" : "secondary"}
                          size="sm"
                          disabled={!item.available}
                        >
                          {item.available ? "Add to Cart" : "Unavailable"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Pricing Table */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-foreground mb-4">
                Domain Pricing
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Competitive pricing on all popular domain extensions.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
                {tldPricing.map((item) => (
                  <div
                    key={item.tld}
                    className="p-4 bg-card rounded-xl border border-border text-center hover:border-accent/30 transition-colors"
                  >
                    <div className="text-2xl font-bold text-accent mb-1">
                      {item.tld}
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {item.price}
                    </div>
                    <div className="text-sm text-muted-foreground">/year</div>
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

export default DomainRegister;
