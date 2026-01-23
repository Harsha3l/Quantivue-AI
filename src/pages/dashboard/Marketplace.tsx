import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/DashboardLayout";

const Marketplace = () => {
  return (
    <>
      <Helmet>
        <title>Marketplace - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
            <p className="text-muted-foreground">Browse and install apps and services</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-muted-foreground">Marketplace items will be available here.</p>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Marketplace;

