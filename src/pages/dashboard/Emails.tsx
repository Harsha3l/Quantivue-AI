import { Helmet } from "react-helmet-async";
import { Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Emails = () => {
  const features = [
    { name: "1 GB Storage per Mailbox", free: true, starter: true },
    { name: "1 Forwarding Rule", free: true, starter: true },
    { name: "1 Email Alias", free: true, starter: true },
    { name: "Option to get extra mailbox storage", free: false, starter: true },
    { name: "AI mailbox assistant - Kodee", free: false, starter: true },
    { name: "AI powered email search", free: false, starter: true },
    { name: "Smart AI replies and message drafts", free: false, starter: true },
    { name: "Instant AI email summaries", free: false, starter: true },
    { name: "Encrypted storage", free: false, starter: true },
    { name: "Advanced spam, malware, and phishing protection", free: false, starter: true },
    { name: "No Quantivue AI signature in Webmail", free: false, starter: true },
  ];

  return (
    <>
      <Helmet>
        <title>Emails - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Emails</h1>
            <p className="text-muted-foreground">Professional email solutions for your business</p>
          </div>

          <Card className="mb-8 bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                New Year's sale is on - make your next move!
              </h2>
              <p className="text-muted-foreground mb-4">
                Grab these great deals that we've handpicked just for you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">Upgrade your hosting</h3>
                    <p className="text-sm text-muted-foreground mb-2">Level up with more power and enhanced features</p>
                    <p className="text-sm line-through text-muted-foreground">₹ 799.00</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-accent">50% OFF</Badge>
                      <p className="font-bold">From ₹ 399.00/mo</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">Get deal</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">Get a business email</h3>
                    <p className="text-sm text-muted-foreground mb-2">Build your brand with a professional email address.</p>
                    <p className="text-sm line-through text-muted-foreground">₹ 145.00</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-accent">76% OFF</Badge>
                      <p className="font-bold">From ₹ 35.00/mo</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">Get deal</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">Get email marketing</h3>
                    <p className="text-sm text-muted-foreground mb-2">Keep site visitors coming back with AI-powered email marketing.</p>
                    <p className="text-sm line-through text-muted-foreground">₹ 529.00</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-accent">74% OFF</Badge>
                      <p className="font-bold">From ₹ 139.00/mo</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">Get deal</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Claim your free email</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="space-y-2">
                    {features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        {feature.free ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={feature.free ? "" : "text-muted-foreground line-through"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AI tools</h4>
                  <ul className="space-y-2">
                    {features.slice(4, 8).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        {feature.free ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={feature.free ? "" : "text-muted-foreground line-through"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <ul className="space-y-2">
                    {features.slice(8).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        {feature.free ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={feature.free ? "" : "text-muted-foreground line-through"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent border-2">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>Starter Business Email</CardTitle>
                  <Badge className="bg-accent">83% OFF</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm line-through text-muted-foreground">₹ 146.00</p>
                  <p className="text-2xl font-bold text-foreground">₹ 25.00/mo</p>
                  <p className="text-xs text-muted-foreground">Price per mailbox for a 48-month subscription</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>10 GB Storage per Mailbox</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>10 Forwarding Rules</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>10 Email Aliases</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Option to get extra mailbox storage</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AI tools (limited)</h4>
                  <ul className="space-y-2">
                    {features.slice(4, 8).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Benefits</h4>
                  <ul className="space-y-2">
                    {features.slice(8).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="default" className="w-full mt-4">
                  Get started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Emails;
