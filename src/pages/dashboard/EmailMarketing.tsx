import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Check } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EmailMarketing = () => {
  const [subscribers, setSubscribers] = useState([500]);

  const plans = [
    {
      name: "Monthly",
      subscribers: "Up to 500 unique subscribers per month",
      price: "₹ 529.00/mo",
      renewal: "₹ 529.00/mo when you renew",
      features: [
        "Send 3500 emails per month",
        "Get 5 free monthly AI credits",
        "Send emails without the Reach logo",
        "Manage unlimited AI-powered audience segments",
      ],
    },
    {
      name: "Yearly",
      subscribers: "Up to 500 unique subscribers per month",
      price: "₹ 139.00/mo",
      renewal: "₹ 179.00/mo when you renew",
      discount: "74% OFF",
      popular: true,
      features: [
        "Send 3500 emails per month",
        "Get 5 free monthly AI credits",
        "Send emails without the Reach logo",
        "Manage unlimited AI-powered audience segments",
      ],
    },
    {
      name: "Free",
      subscribers: "Up to 100 unique subscribers per month",
      price: "₹ 0.00/mo",
      renewal: "₹ 89.00/mo when you renew",
      free: true,
      features: [
        "Send 200 emails per month",
        "Get 5 free monthly AI credits",
        "Send emails without the Reach logo",
        "Manage unlimited AI-powered audience segments",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Email Marketing - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Email Marketing</h1>
            <p className="text-muted-foreground">Grow your business with AI-powered email marketing</p>
          </div>

          <Card className="mb-8 bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Badge className="mb-4">NEW</Badge>
                  <CardTitle className="text-3xl mb-2">
                    Grow your business with email marketing
                  </CardTitle>
                  <CardDescription className="text-base mb-6">
                    Chat with AI to design on-brand newsletters in seconds. Grow your audience and track results with ease.
                  </CardDescription>
                  <Button variant="default" size="lg">
                    Start for free
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-4">How many subscribers do you have?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={subscribers[0]}
                    onChange={(e) => setSubscribers([parseInt(e.target.value) || 0])}
                    className="w-32"
                  />
                  <Slider
                    value={subscribers}
                    onValueChange={setSubscribers}
                    max={10000}
                    step={100}
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Current: {subscribers[0]} subscribers
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan, index) => (
              <Card key={index} className={plan.popular ? "border-accent border-2" : ""}>
                <CardHeader>
                  {plan.popular && (
                    <Badge className="w-fit mb-2 bg-accent">MOST POPULAR</Badge>
                  )}
                  {plan.free && (
                    <Badge className="w-fit mb-2 bg-muted">FREE</Badge>
                  )}
                  {plan.discount && (
                    <Badge className="w-fit mb-2 bg-accent">{plan.discount}</Badge>
                  )}
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.subscribers}</CardDescription>
                  <div className="space-y-1 mt-4">
                    <p className="text-2xl font-bold text-foreground">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">{plan.renewal}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full"
                  >
                    {plan.free ? "Try free for 1 year" : "Choose plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently asked questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is Quantivue AI Reach email marketing service?</AccordionTrigger>
                  <AccordionContent>
                    Quantivue AI Reach is an AI-powered email marketing platform that helps you create, send, and track email campaigns. It includes features like AI-generated templates, automated sequences, and detailed analytics.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How is Quantivue AI Reach different from other email marketing apps?</AccordionTrigger>
                  <AccordionContent>
                    Quantivue AI Reach stands out with its AI-powered features, seamless integration with Quantivue AI hosting, and user-friendly interface. It's designed specifically for Quantivue AI customers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How much does it cost to use Quantivue AI Reach?</AccordionTrigger>
                  <AccordionContent>
                    We offer a free plan with limited features, and paid plans starting from ₹ 139.00/mo for yearly subscriptions. Monthly plans start at ₹ 529.00/mo.
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

export default EmailMarketing;
