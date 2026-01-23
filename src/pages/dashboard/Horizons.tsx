import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Horizons = () => {
  return (
    <>
      <Helmet>
        <title>Horizons - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Horizons</h1>
            <p className="text-muted-foreground">AI-powered website and web app builder</p>
          </div>

          <Card className="mb-8 bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge className="mb-4">NEW</Badge>
                  <CardTitle className="text-3xl mb-2">
                    Go from idea to a website or web app - in minutes
                  </CardTitle>
                  <CardDescription className="text-base mb-6">
                    Just chat with AI and go live in one click, without writing any code.
                  </CardDescription>
                  <Button variant="default" size="lg">
                    Start building
                  </Button>
                </div>
                <div className="hidden lg:block ml-8">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-card rounded-lg p-3 border border-border text-xs">
                      <p className="font-semibold mb-1">Enhancements</p>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Add features</li>
                        <li>• Improve design</li>
                        <li>• Fix issues</li>
                      </ul>
                    </div>
                    <div className="bg-card rounded-lg p-3 border border-border text-xs">
                      <p className="font-semibold mb-1">How are you feeling today?</p>
                      <div className="flex gap-1">
                        <span className="text-lg">😊</span>
                        <span className="text-lg">⚡</span>
                        <span className="text-lg">😌</span>
                        <span className="text-lg">😴</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently asked questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is Quantivue AI Horizons, and how does it work?</AccordionTrigger>
                  <AccordionContent>
                    Quantivue AI Horizons is an AI-powered platform that allows you to build websites and web applications by simply chatting with AI. No coding required - just describe what you want, and Horizons will create it for you.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What can I build with Quantivue AI Horizons?</AccordionTrigger>
                  <AccordionContent>
                    You can build various types of websites and web applications, including business websites, portfolios, e-commerce stores, web apps, and more. The possibilities are endless with AI assistance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How much does it cost to use Quantivue AI Horizons?</AccordionTrigger>
                  <AccordionContent>
                    Pricing plans vary based on your needs. Please check our pricing page for the most up-to-date information on Horizons subscription plans.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Horizons;
