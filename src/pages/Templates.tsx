import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layout, ArrowRight } from "lucide-react";

const templates = [
  {
    name: "Business Portfolio",
    category: "Business",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
  },
  {
    name: "E-commerce Store",
    category: "E-commerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
  },
  {
    name: "Personal Blog",
    category: "Blog",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop",
  },
  {
    name: "Restaurant",
    category: "Food",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  },
  {
    name: "Photography",
    category: "Creative",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=300&fit=crop",
  },
  {
    name: "Startup Landing",
    category: "Business",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
  },
];

const Templates = () => {
  return (
    <>
      <Helmet>
        <title>Website Templates - Quantivue AI</title>
        <meta
          name="description"
          content="Browse our collection of professional website templates. Launch your site quickly with pre-designed layouts."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24">
          {/* Hero */}
          <section className="py-16 gradient-hero text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-sm mb-6">
                <Layout className="h-4 w-4 text-accent" />
                Website Templates
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Beautiful Templates for Every Need
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
                Choose from our collection of professionally designed templates
                and launch your website in minutes.
              </p>
            </div>
          </section>

          {/* Templates Grid */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.name}
                    className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-accent/30 hover:shadow-xl transition-all"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <Button variant="accent" size="sm">
                          Preview <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium text-accent uppercase tracking-wide">
                        {template.category}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mt-1">
                        {template.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Choose a template and launch your website today.
              </p>
              <Button variant="accent" size="lg" asChild>
                <Link to="/pricing">View Hosting Plans</Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Templates;
