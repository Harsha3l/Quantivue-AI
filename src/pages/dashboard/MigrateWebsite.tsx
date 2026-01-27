import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Globe, User, Database, RefreshCw, Check, Upload, ChevronRight, Info, Plus, Home } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

type MigrationStep = "intro" | "choose-method" | "migrate-form";

const MigrateWebsite = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<MigrationStep>("intro");
  const [migrationMethod, setMigrationMethod] = useState<"login" | "backup">("login");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [targetDomain, setTargetDomain] = useState("");
  const [backupFiles, setBackupFiles] = useState<File[]>([]);
  const [databaseFile, setDatabaseFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartMigration = () => {
    setStep("choose-method");
  };

  const handleMethodSelect = (method: "login" | "backup") => {
    setMigrationMethod(method);
  };

  const handleNext = () => {
    setStep("migrate-form");
  };

  const handleBack = () => {
    if (step === "migrate-form") {
      setStep("choose-method");
    } else if (step === "choose-method") {
      setStep("intro");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setBackupFiles(Array.from(e.target.files));
    }
  };

  const handleDatabaseFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDatabaseFile(e.target.files[0]);
    }
  };

  const handleSubmitMigration = async () => {
    setIsSubmitting(true);
    try {
      const requestBody: any = {
        method: migrationMethod,
        target_domain: targetDomain || null,
      };

      if (migrationMethod === "login") {
        if (!websiteUrl || !loginUsername || !loginPassword) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields for login method.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        requestBody.website_url = websiteUrl;
        requestBody.login_username = loginUsername;
        requestBody.login_password = loginPassword;
      } else {
        if (backupFiles.length === 0) {
          toast({
            title: "Validation Error",
            description: "Please upload at least one backup file.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        requestBody.backup_files = backupFiles.map((f) => f.name);
        if (databaseFile) {
          requestBody.database_file = databaseFile.name;
        }
      }

      const response = await fetch("https://quantivue-ai.onrender.com/api/websites/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Migration failed");
      }

      const result = await response.json();
      toast({
        title: "Migration Started",
        description: result.message || "Your website migration has been initiated successfully.",
      });

      // Reset form and go back to intro
      setWebsiteUrl("");
      setLoginUsername("");
      setLoginPassword("");
      setTargetDomain("");
      setBackupFiles([]);
      setDatabaseFile(null);
      setStep("intro");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start migration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Intro page
  if (step === "intro") {
    return (
      <>
        <Helmet>
          <title>Migrations - Quantivue AI</title>
        </Helmet>
        <DashboardLayout>
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Home className="h-4 w-4" />
                <span>Home</span>
                <span>/</span>
                <span>Websites</span>
                <span>/</span>
                <span className="text-foreground">Migrations</span>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Migrations</h1>
                <Button variant="accent" size="lg" onClick={handleStartMigration}>
                  <Plus className="h-4 w-4 mr-2" />
                  Migrate Website
                </Button>
              </div>
            </div>

            {/* Main Content Card */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Migrate your site from another provider — it's free
                  </h2>
                  <p className="text-muted-foreground">
                    Just share a few details about your site - and we'll do the rest. Your site will stay up and running the whole time.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Benefits List */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-foreground">It's a quick and automatic process</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-foreground">Use your admin login details or backup files to migrate</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-foreground">Pick a domain you want to use for your site</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-foreground">You can migrate subdomains and sub-directories too</p>
                    </div>

                    <div className="pt-6">
                      <Button variant="accent" size="lg" onClick={handleStartMigration}>
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Migrate website
                      </Button>
                      <p className="text-sm text-muted-foreground mt-3">
                        Usually takes <strong>30 minutes</strong>, but may take <strong>24 hours</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Right: Visual Diagram */}
                  <div className="flex items-center justify-center lg:justify-end">
                    <div className="relative w-full max-w-md h-64">
                      {/* Grid Container */}
                      <div className="grid grid-cols-2 gap-4 h-full">
                        {/* Left Column - Orange/Accent Theme */}
                        <div className="space-y-4 flex flex-col justify-center">
                          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border-2 border-orange-200 p-4 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0">
                                <Globe className="h-6 w-6 text-orange-600" />
                              </div>
                              <span className="font-semibold text-foreground">Website URL</span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border-2 border-orange-200 p-4 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0">
                                <User className="h-6 w-6 text-orange-600" />
                              </div>
                              <span className="font-semibold text-foreground">Login details</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Green Theme */}
                        <div className="space-y-4 flex flex-col justify-center">
                          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl border-2 border-green-200 p-4 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
                                <RefreshCw className="h-6 w-6 text-green-700" />
                              </div>
                              <span className="font-semibold text-foreground">Backup</span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl border-2 border-green-200 p-4 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
                                <Database className="h-6 w-6 text-green-700" />
                              </div>
                              <span className="font-semibold text-foreground">Database</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Connecting Arrows - SVG Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                          <defs>
                            <marker
                              id="arrowhead-top"
                              markerWidth="10"
                              markerHeight="10"
                              refX="9"
                              refY="3"
                              orient="auto"
                            >
                              <polygon points="0 0, 10 3, 0 6" fill="rgb(156 163 175)" />
                            </marker>
                            <marker
                              id="arrowhead-bottom"
                              markerWidth="10"
                              markerHeight="10"
                              refX="1"
                              refY="3"
                              orient="auto"
                            >
                              <polygon points="10 0, 0 3, 10 6" fill="rgb(156 163 175)" />
                            </marker>
                          </defs>
                          {/* Top curved arrow: Left to Right */}
                          <path
                            d="M 80 80 Q 200 50 320 80"
                            stroke="rgb(156 163 175)"
                            strokeWidth="2.5"
                            fill="none"
                            markerEnd="url(#arrowhead-top)"
                            className="opacity-60"
                          />
                          {/* Bottom curved arrow: Right to Left */}
                          <path
                            d="M 320 220 Q 200 250 80 220"
                            stroke="rgb(156 163 175)"
                            strokeWidth="2.5"
                            fill="none"
                            markerEnd="url(#arrowhead-bottom)"
                            className="opacity-60"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQs Section */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How to fill out a website migration request?</AccordionTrigger>
                    <AccordionContent>
                      Simply provide your website URL and admin login credentials. Our team will handle the rest automatically.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How long does it take to migrate a website?</AccordionTrigger>
                    <AccordionContent>
                      Usually takes 30 minutes, but may take up to 24 hours depending on the size and complexity of your website.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>My services with the previous provider are expiring soon. Can I ask for priority?</AccordionTrigger>
                    <AccordionContent>
                      Yes, please contact our support team and mention your urgency. We'll do our best to prioritize your migration.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Can I add a link with backups for you to migrate?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can provide a link to your backup files. Make sure the link is accessible and the files are in a standard format.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Can I request to migrate a website from another Quantivue AI account?</AccordionTrigger>
                    <AccordionContent>
                      Yes, you can migrate websites between Quantivue AI accounts. Please provide the necessary authorization details.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </>
    );
  }

  // Choose method page
  if (step === "choose-method") {
    return (
      <>
        <Helmet>
          <title>Choose Migration Method - Quantivue AI</title>
        </Helmet>
        <DashboardLayout>
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-foreground">
                  Choose how you want to migrate your website
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">How it works</span>
                </div>
              </div>
            </div>

            <RadioGroup value={migrationMethod} onValueChange={(value) => handleMethodSelect(value as "login" | "backup")}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card
                  className={`cursor-pointer transition-all ${
                    migrationMethod === "login"
                      ? "border-accent border-2 bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => handleMethodSelect("login")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Globe className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-foreground">Use login details</h3>
                            <Badge className="bg-green-500 text-white">Recommended</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Provide a website URL and admin login details to migrate a site that's currently online.
                          </p>
                        </div>
                      </div>
                      <RadioGroupItem value="login" id="login" className="mt-1 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all ${
                    migrationMethod === "backup"
                      ? "border-accent border-2 bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => handleMethodSelect("backup")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Upload className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground mb-1">Upload backup files</h3>
                          <p className="text-sm text-muted-foreground">
                            Migrate your website by uploading your backup and database files.
                          </p>
                        </div>
                      </div>
                      <RadioGroupItem value="backup" id="backup" className="mt-1 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </RadioGroup>

            <div className="flex justify-end">
              <Button variant="accent" size="lg" onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </>
    );
  }

  // Migration form page
  return (
    <>
      <Helmet>
        <title>Migration Form - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-4"
            >
              ← Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {migrationMethod === "login" ? "Migrate with Login Details" : "Migrate with Backup Files"}
            </h1>
            <p className="text-muted-foreground">
              {migrationMethod === "login"
                ? "Enter your website URL and admin credentials to start the migration process."
                : "Upload your website backup and database files to migrate your site."}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Migration Details</CardTitle>
              <CardDescription>Enter your website information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {migrationMethod === "login" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="website-url">Website URL</Label>
                    <Input
                      id="website-url"
                      placeholder="https://example.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Admin Username or Email</Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="Admin username or email"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Admin Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="backup-files">Upload Backup Files</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your backup files here or click to browse
                      </p>
                      <Input
                        id="backup-files"
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("backup-files")?.click()}
                      >
                        Select Files
                      </Button>
                      {backupFiles.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-foreground mb-2">
                            Selected files ({backupFiles.length}):
                          </p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {backupFiles.map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="database-file">Upload Database File (Optional)</Label>
                    <Input
                      id="database-file"
                      type="file"
                      accept=".sql,.sql.gz"
                      onChange={handleDatabaseFileUpload}
                      className="cursor-pointer"
                    />
                    {databaseFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {databaseFile.name}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="target-domain">Target Domain (Optional)</Label>
                <Input
                  id="target-domain"
                  placeholder="example.com"
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use the same domain
                </p>
              </div>

              <div className="pt-4">
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="w-full"
                  onClick={handleSubmitMigration}
                  disabled={isSubmitting}
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Starting Migration..." : "Start Migration"}
                </Button>
                <p className="text-sm text-muted-foreground text-center mt-3">
                  Usually takes <strong>30 minutes</strong>, but may take 24 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default MigrateWebsite;
