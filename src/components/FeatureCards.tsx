import { Zap, Shield, Settings, Server, Mail, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast Performance",
    description:
      "NVMe SSD storage and optimized servers ensure lightning-fast load times for your websites.",
  },
  {
    icon: Shield,
    title: "Secure Hosting",
    description:
      "Free SSL certificates, malware protection, and daily backups keep your data safe.",
  },
  {
    icon: Settings,
    title: "Easy Setup",
    description:
      "1-click installations, intuitive dashboard, and automated updates make management simple.",
  },
  {
    icon: Server,
    title: "99.9% Uptime",
    description:
      "Enterprise-grade infrastructure guarantees your websites are always online.",
  },
  {
    icon: Mail,
    title: "Email Hosting",
    description:
      "Professional email accounts included with every hosting plan at no extra cost.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Expert support team available around the clock to help you succeed.",
  },
];

const FeatureCards = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-accent">Quantivue AI</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to launch and grow your online presence, all in
            one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="h-7 w-7 text-accent" />
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
  );
};

export default FeatureCards;
