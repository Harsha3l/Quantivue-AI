import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, FileText, Settings, Bell, Check } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WordPressAddons = () => {
  const features = [
    {
      icon: ArrowRightLeft,
      title: "1-click site ownership transfers",
      description: "Hand off finished projects in a matter of minutes.",
    },
    {
      icon: FileText,
      title: "Automated site reports",
      description: "Stay informed about a site's performance with branded reports.",
    },
    {
      icon: Settings,
      title: "WordPress presets",
      description: "Automatically install your choice of plugins and templates on new sites.",
    },
    {
      icon: Bell,
      title: "Website monitoring",
      description: "Get an instant email alert when a website goes offline.",
    },
  ];

  const plans = [
    {
      name: "1 website",
      price: "₹ 89.00/mo",
      perSite: null,
    },
    {
      name: "10 websites",
      price: "₹ 269.00/mo",
      perSite: "₹ 26.90 per site",
      recommended: true,
    },
    {
      name: "Unlimited",
      price: "₹ 789.00/mo",
      perSite: "₹ 5.64 per site",
    },
  ];

  return (
    <>
      <Helmet>
        <title>WordPress Add-ons - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">WordPress Add-ons</h1>
            <p className="text-muted-foreground">
              This bundle of tools will help you manage your and your clients' websites quicker and easier.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">Trusted by thousands of WordPress professionals</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Get work done more effectively
                </h2>
                <p className="text-muted-foreground mb-6">
                  This bundle of tools will help you manage your and your clients' websites quicker and easier.{" "}
                  <a href="#" className="text-accent hover:underline">Learn more</a>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-accent/10 rounded-xl border border-accent/20 p-4">
                <p className="text-sm font-medium text-foreground mb-1">
                  Try all features free for 7 days
                </p>
                <p className="text-xs text-muted-foreground">Monthly subscription. Cancel anytime.</p>
              </div>

              {plans.map((plan, index) => (
                <Card
                  key={index}
                  className={plan.recommended ? "border-accent border-2" : ""}
                >
                  <CardHeader>
                    {plan.recommended && (
                      <Badge className="w-fit mb-2 bg-green-500">Recommended</Badge>
                    )}
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-foreground">{plan.price}</p>
                      {plan.perSite && (
                        <p className="text-sm text-muted-foreground">{plan.perSite}</p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant={plan.recommended ? "default" : "outline"}
                      className="w-full"
                    >
                      Start free trial
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default WordPressAddons;
