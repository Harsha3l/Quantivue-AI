import { Helmet } from "react-helmet-async";
import { Plus, ExternalLink, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";

const Websites = () => {
  const websites = [
    { name: "verajprojects.com", type: "WordPress", status: "Active" },
    { name: "orocaredental.in", type: "WordPress", status: "Active" },
  ];

  return (
    <>
      <Helmet>
        <title>Websites - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Websites</h1>
              <p className="text-muted-foreground">Manage your hosted websites</p>
            </div>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Add website
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="space-y-4">
              {websites.map((website) => (
                <div
                  key={website.name}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{website.name}</h3>
                      <p className="text-sm text-muted-foreground">{website.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {website.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Websites;

