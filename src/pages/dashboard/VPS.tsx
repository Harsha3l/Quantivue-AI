import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const VPS = () => {
  const vpsTypes = [
    {
      name: "KVM VPS",
      description: "Build your application or website with dedicated resources and complete control of your server",
      technologies: ["cPanel", "Docker", "Node.js", "JavaScript", "WordPress"],
      buttonText: "Get now",
    },
    {
      name: "Game Panel",
      description: "Host your favorite games with top-tier processors and full customization for an unbeatable gaming experience",
      technologies: ["Palworld", "7 Days to Die", "ARK", "Valheim"],
      buttonText: "Get now",
    },
  ];

  const faqs = [
    {
      question: "What is VPS Hosting?",
      answer: "VPS (Virtual Private Server) hosting provides you with dedicated resources on a virtualized server, giving you more control and power than shared hosting while being more affordable than dedicated servers.",
    },
    {
      question: "What are the Benefits of Quantivue AI's KVM VPS?",
      answer: "Quantivue AI's KVM VPS offers full root access, dedicated resources, scalable configurations, and support for various operating systems and applications.",
    },
    {
      question: "What is a Game Panel?",
      answer: "Game Panel is a specialized VPS solution designed for hosting game servers. It includes pre-configured game server management tools and optimized performance for gaming applications.",
    },
    {
      question: "What are the Benefits of Hosting My Own Game Panel Hosting?",
      answer: "Hosting your own game panel gives you complete control over your game server, custom configurations, better performance, and the ability to host multiple games on a single server.",
    },
    {
      question: "What Locations are Available for VPS hosting?",
      answer: "Quantivue AI offers VPS hosting in multiple locations worldwide, including data centers in North America, Europe, and Asia to ensure low latency for your users.",
    },
    {
      question: "Will I get any kind of assistance while using Linux VPS hosting?",
      answer: "Yes, Quantivue AI provides 24/7 customer support for all VPS hosting plans, including assistance with server setup, troubleshooting, and optimization.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>VPS - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">VPS</h1>
            <p className="text-muted-foreground">Build applications, host websites, or play games with VPS</p>
          </div>

          <Card className="mb-8 bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                New Year's sale is on - make your next move!
              </h2>
              <p className="text-muted-foreground">
                Grab these great deals that we've handpicked just for you.
              </p>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Build applications, host websites, or play games with VPS
            </h2>
            <p className="text-muted-foreground mb-6">
              Choose KVM for building applications with dedicated resources or Game Panel for hosting your favorite games
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vpsTypes.map((type, index) => (
                <Card key={index} className="hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {type.technologies.map((tech, techIndex) => (
                        <div
                          key={techIndex}
                          className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-xs font-medium"
                        >
                          {tech}
                        </div>
                      ))}
                    </div>
                    <CardTitle className="text-2xl">{type.name}</CardTitle>
                    <CardDescription className="text-base">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="accent" className="w-full">
                      {type.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>VPS Hosting FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default VPS;
