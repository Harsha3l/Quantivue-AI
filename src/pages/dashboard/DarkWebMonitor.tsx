import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/DashboardLayout";

const DarkWebMonitor = () => {
  return (
    <>
      <Helmet>
        <title>Dark Web Monitor - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Dark Web Monitor</h1>
            <p className="text-muted-foreground">Monitor your data for potential breaches</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-muted-foreground">Dark web monitoring will be available here.</p>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DarkWebMonitor;

