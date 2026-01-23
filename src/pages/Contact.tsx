import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageSquare, Clock, Headphones } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const iconMap = {
  MessageSquare,
  Clock,
  Headphones,
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState([
    {
      icon: Mail,
      title: "Email Us",
      detail: "support@quantivue.ai",
      subtext: "We'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      detail: "9014670723",
      subtext: "Mon-Fri, 9am-6pm IST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      detail: "Hyderabad",
      subtext: "Headquarters",
    },
  ]);
  const [supportFeatures, setSupportFeatures] = useState([
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team via live chat.",
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "We respond to all inquiries within 24 hours.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our team is available around the clock for urgent issues.",
    },
  ]);

  // Fetch contact info dynamically
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/contact/info");
        if (response.ok) {
          const data = await response.json();
          
          // Update contact info
          setContactInfo([
            {
              icon: Mail,
              title: "Email Us",
              detail: data.email || "support@quantivue.ai",
              subtext: "We'll respond within 24 hours",
            },
            {
              icon: Phone,
              title: "Call Us",
              detail: data.phone || "9014670723",
              subtext: "Mon-Fri, 9am-6pm IST",
            },
            {
              icon: MapPin,
              title: "Visit Us",
              detail: data.location || "Hyderabad",
              subtext: "Headquarters",
            },
          ]);

          // Update support features
          if (data.supportFeatures && Array.isArray(data.supportFeatures)) {
            const features = data.supportFeatures.map((feature: any) => ({
              icon: iconMap[feature.icon as keyof typeof iconMap] || MessageSquare,
              title: feature.title,
              description: feature.description,
            }));
            setSupportFeatures(features);
          }
        }
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
        // Keep default values
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Failed to send message");
        return;
      }

      toast.success(data.message || "Message sent successfully!");
      // Clear form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Quantivue AI</title>
        <meta
          name="description"
          content="Get in touch with Quantivue AI support team. We're here to help with your hosting, domains, and automation needs."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24">
          {/* Hero */}
          <section className="py-16 gradient-hero text-primary-foreground">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
                Have questions? We're here to help. Reach out to our team for
                support.
              </p>
            </div>
          </section>

          {/* Contact Info */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {contactInfo.map((item) => (
                  <div
                    key={item.title}
                    className="p-6 bg-card rounded-xl border border-border text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-foreground font-medium">{item.detail}</p>
                    <p className="text-sm text-muted-foreground">{item.subtext}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-card rounded-2xl border border-border p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Send us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Name
                        </label>
                        <Input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <Input
                        type="text"
                        placeholder="How can we help?"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <Textarea
                        placeholder="Your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      variant="accent" 
                      className="w-full h-12"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Support Features */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                Why Our Support Stands Out
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {supportFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="p-6 bg-card rounded-xl border border-border text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
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

export default Contact;
