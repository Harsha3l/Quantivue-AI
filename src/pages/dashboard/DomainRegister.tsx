import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface GeneratedDomain {
  name: string;
  originalPrice: string;
  discountedPrice: string;
  savePercent: number;
  note?: string; // e.g., "Only for 2yr+ term" or "Only for 3yr+ term"
}

const DomainRegister = () => {
  const { toast } = useToast();
  const [domainName, setDomainName] = useState("");
  const [isAIMode, setIsAIMode] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDomains, setGeneratedDomains] = useState<GeneratedDomain[]>([]);

  const popularExtensions = [
    { ext: ".com", original: "₹ 1,299.00", discounted: "₹ 199.00" },
    { ext: ".net", original: "₹ 1,569.00", discounted: "₹ 999.00" },
    { ext: ".io", original: "₹ 5,939.00", discounted: "₹ 2,799.00" },
    { ext: ".org", original: "₹ 1,299.00", discounted: "₹ 1.00" },
    { ext: ".online", original: "₹ 3,059.00", discounted: "₹ 89.00" },
    { ext: ".shop", original: "₹ 2,859.00", discounted: "₹ 89.00" },
  ];

  const handleGenerateDomain = async () => {
    if (!aiDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description about your project",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI domain generation (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock generated domains with pricing (matching Hostinger style)
      const mockDomains: GeneratedDomain[] = [
        {
          name: "devtemplates.io",
          originalPrice: "₹ 5,999.00",
          discountedPrice: "₹ 2,799.00",
          savePercent: 53,
        },
        {
          name: "hostsmartly.net",
          originalPrice: "₹ 1,569.00",
          discountedPrice: "₹ 999.00",
          savePercent: 36,
          note: "Only for 2yr+ term",
        },
        {
          name: "templatetools.co",
          originalPrice: "₹ 3,059.00",
          discountedPrice: "₹ 2,449.00",
          savePercent: 20,
        },
        {
          name: "launchyoursite.in",
          originalPrice: "₹ 999.00",
          discountedPrice: "₹ 1.00",
          savePercent: 99,
          note: "Only for 3yr+ term",
        },
      ];
      
      setGeneratedDomains(mockDomains);
      toast({
        title: "Domains Generated",
        description: "AI has generated domain name suggestions for you!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate domains. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Get a New Domain - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Get a New Domain</h1>
            <p className="text-muted-foreground">
              Type your desired domain name into the domain checker search bar and find out if it's available instantly!
            </p>
          </div>

          <Card className="mb-6 bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <p className="text-sm text-foreground">
                <strong>New Year deal:</strong> Get domain + free business email. Choose a domain with .ai, .io, .net, or .org for 2 years or longer and get 1 year of free email.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button 
              variant={!isAIMode ? "default" : "outline"} 
              size="lg" 
              className="w-full"
              onClick={() => {
                setIsAIMode(false);
                setGeneratedDomains([]);
              }}
            >
              Find new domain
            </Button>
            <Button 
              variant={isAIMode ? "default" : "outline"} 
              size="lg" 
              className="w-full"
              onClick={() => setIsAIMode(true)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate domain using AI
            </Button>
          </div>

          {!isAIMode ? (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Domain Search</CardTitle>
                  <CardDescription>Enter your desired domain name</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter your desired domain name"
                        className="pl-10"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                      />
                    </div>
                    <Button variant="accent">Search</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Generate domain using AI</CardTitle>
                  <CardDescription>
                    Find unique domain name ideas that reflect your brand identity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Describe your project
                    </label>
                    <textarea
                      className="w-full min-h-[120px] px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder='Write a short description about your project, for example: "Non-profit organization that helps plant trees"'
                      value={aiDescription}
                      onChange={(e) => setAiDescription(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="accent" 
                    size="lg" 
                    onClick={handleGenerateDomain}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>

                  {generatedDomains.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-accent" />
                        <h3 className="text-xl font-semibold text-foreground">AI generated domains</h3>
                      </div>
                      <div className="space-y-3">
                        {generatedDomains.map((domain, index) => (
                          <Card key={index} className="hover:border-accent/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-lg font-semibold text-foreground">{domain.name}</h4>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                      Save {domain.savePercent}%
                                    </Badge>
                                  </div>
                                  {domain.note && (
                                    <p className="text-xs text-muted-foreground mb-1">{domain.note}</p>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground line-through">
                                      {domain.originalPrice}
                                    </span>
                                    <span className="text-lg font-bold text-foreground">
                                      {domain.discountedPrice}/1st yr
                                    </span>
                                  </div>
                                </div>
                                <Button variant="accent" className="ml-4">
                                  Buy now
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Popular Domain Extensions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularExtensions.map((ext, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-foreground">{ext.ext}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground line-through">{ext.original}</p>
                      <p className="text-xl font-bold text-foreground">{ext.discounted}</p>
                    </div>
                    <Button variant="outline" className="w-full mt-3" size="sm">
                      Get now
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

export default DomainRegister;
