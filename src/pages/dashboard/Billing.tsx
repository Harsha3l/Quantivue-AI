import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";

const Billing = () => {
  const [subscriptions, setSubscriptions] = useState<
    { id: number; name: string; price: string; status: string; next_billing: string | null }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("/api/billing/subscriptions", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          setSubscriptions([]);
          return;
        }
        const data = await res.json();
        setSubscriptions(Array.isArray(data) ? data : []);
      } catch {
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>Subscription - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
            <p className="text-muted-foreground">Manage your active subscriptions</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="space-y-4">
              {loading && <p className="text-muted-foreground">Loading subscriptions...</p>}
              {!loading && subscriptions.length === 0 && (
                <p className="text-muted-foreground">No subscriptions found.</p>
              )}
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-foreground">{sub.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Next billing: {sub.next_billing || "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-foreground">{sub.price}</p>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {sub.status || "Active"}
                      </span>
                    </div>
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

export default Billing;

