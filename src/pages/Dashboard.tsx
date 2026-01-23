import { Helmet } from "react-helmet-async";
import {
  Globe,
  Server,
  Mail,
  HelpCircle,
  HardDrive,
  Activity,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/DashboardLayout";

const websites = [
  { name: "mywebsite.com", status: "Active", plan: "Premium" },
  { name: "blog.example.in", status: "Active", plan: "Basic" },
];

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - Quantivue AI</title>
        <meta
          name="description"
          content="Manage your hosting, domains, emails, and billing from your Quantivue AI dashboard."
        />
      </Helmet>
      <DashboardLayout>
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's your hosting overview.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-muted-foreground">Websites</span>
                </div>
                <div className="text-3xl font-bold text-foreground">2</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Server className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-muted-foreground">Domains</span>
                </div>
                <div className="text-3xl font-bold text-foreground">3</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-muted-foreground">Emails</span>
                </div>
                <div className="text-3xl font-bold text-foreground">12</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-muted-foreground">Tickets</span>
                </div>
                <div className="text-3xl font-bold text-foreground">0</div>
              </div>
            </div>

            {/* Usage Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-accent" />
                  Storage Usage
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-medium text-foreground">45GB / 100GB</span>
                  </div>
                  <Progress value={45} className="h-3" />
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-accent" />
                  Bandwidth Usage
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-medium text-foreground">250GB / Unlimited</span>
                  </div>
                  <Progress value={25} className="h-3" />
                </div>
              </div>
            </div>

            {/* Websites Table */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Hosted Websites
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Website
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Plan
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {websites.map((site) => (
                      <tr key={site.name} className="border-b border-border last:border-0">
                        <td className="py-4 px-4">
                          <span className="font-medium text-foreground">{site.name}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {site.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{site.plan}</td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="ghost" size="sm">
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
