import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useEffect, useState } from "react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState<
    { id: number; amount: string | number; status: string; payment_method: string | null; transaction_id: string | null; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("/api/billing/payment-history", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          setPayments([]);
          return;
        }
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } catch {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment History - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
            <p className="text-muted-foreground">View your past transactions</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Transaction ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Method
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td className="py-4 px-4 text-muted-foreground" colSpan={5}>
                        Loading payments...
                      </td>
                    </tr>
                  )}
                  {!loading && payments.length === 0 && (
                    <tr>
                      <td className="py-4 px-4 text-muted-foreground" colSpan={5}>
                        No payment history found.
                      </td>
                    </tr>
                  )}
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b border-border last:border-0">
                      <td className="py-4 px-4">
                        <span className="font-medium text-foreground">
                          {payment.transaction_id || `#${payment.id}`}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {payment.created_at ? new Date(payment.created_at).toISOString().slice(0, 10) : "-"}
                      </td>
                      <td className="py-4 px-4 font-medium text-foreground">
                        ${Number(payment.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{payment.payment_method || "-"}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {payment.status || "Paid"}
                        </span>
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

export default PaymentHistory;

