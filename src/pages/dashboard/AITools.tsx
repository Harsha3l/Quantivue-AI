import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/DashboardLayout";

const AITools = () => {
  return (
    <>
      <Helmet>
        <title>AI Tools - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">AI Tools</h1>
            <p className="text-muted-foreground">Access powerful AI-powered tools and services</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-muted-foreground">AI tools will be available here.</p>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default AITools;

