import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Logo from "@/components/Logo";
import { Users, LogIn, CreditCard, Globe } from "lucide-react";
import { toast } from "sonner";

interface DashboardMetrics {
  totalUsers: number;
  totalLogins: number;
  totalPayments: number;
}

interface Website {
  id: number;
  user_id: number | string | null;
  domain: string;
  type: string;
  status: string;
  created_at?: string;
}

interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  created_at?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalLogins: 0,
    totalPayments: 0,
  });
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [usersOpen, setUsersOpen] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);

  // Check admin session
  useEffect(() => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // Fetch dashboard metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const adminToken = localStorage.getItem("admin_token");
        const response = await fetch(`${API_BASE_URL}/admin/metrics`, {
          headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : undefined,
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_email");
            navigate("/admin-login");
            return;
          }
          throw new Error(data.detail || "Failed to load metrics");
        }
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
        // Set default values if backend not available
        setMetrics({
          totalUsers: 0,
          totalLogins: 0,
          totalPayments: 0,
        });
      }
    };

    fetchMetrics();
  }, [navigate]);

  // Fetch websites for the "Website List" tab
  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const adminToken = localStorage.getItem("admin_token");
        const response = await fetch(`${API_BASE_URL}/admin/websites`, {
          headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : undefined,
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_email");
            navigate("/admin-login");
            return;
          }
          throw new Error(data.detail || "Failed to load websites");
        }
        const data = await response.json();
        setWebsites(data.websites || []);
      } catch (err) {
        console.error("Failed to fetch websites:", err);
        setWebsites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsites();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    toast.success("Logged out successfully");
    navigate("/admin-login");
  };

  const fetchUsers = async () => {
    const adminToken = localStorage.getItem("admin_token");
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }

    setUsersLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_email");
          navigate("/admin-login");
          return;
        }
        throw new Error(data.detail || "Failed to load users");
      }

      setUsers(data.users || []);
      setUsersOpen(true);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Quantivue AI</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b sticky top-0 z-50 bg-white">
          <div className="container mx-auto flex items-center justify-between py-4 px-4">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-lg font-semibold ml-4">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {localStorage.getItem("admin_email")}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="websites">Website List</TabsTrigger>
            </TabsList>

            {/* Home Tab */}
            <TabsContent value="home" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Users Card */}
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => fetchUsers()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") fetchUsers();
                  }}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                      {usersLoading ? "Loading..." : "Registered users (click to view)"}
                    </p>
                  </CardContent>
                </Card>

                {/* Total Logins Card */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Login Count</CardTitle>
                    <LogIn className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalLogins}</div>
                    <p className="text-xs text-muted-foreground">Total logins</p>
                  </CardContent>
                </Card>

                {/* Payment Summary Card */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Payments</CardTitle>
                    <CreditCard className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${metrics.totalPayments}</div>
                    <p className="text-xs text-muted-foreground">Total payments</p>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">Active Users:</span>
                      <span className="font-semibold">{Math.ceil(metrics.totalUsers * 0.7)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b">
                      <span className="text-muted-foreground">Avg Logins per User:</span>
                      <span className="font-semibold">
                        {metrics.totalUsers > 0 ? (metrics.totalLogins / metrics.totalUsers).toFixed(2) : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Revenue per User:</span>
                      <span className="font-semibold">
                        ${metrics.totalUsers > 0 ? (metrics.totalPayments / metrics.totalUsers).toFixed(2) : 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Website List Tab */}
            <TabsContent value="websites" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Websites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading && <p className="text-muted-foreground">Loading websites...</p>}
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  {!isLoading && !error && (
                    <div>
                      {websites.length > 0 ? (
                        <div className="space-y-3">
                          {websites.map((site) => (
                            <div
                              key={site.id}
                              className="border rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                  <p className="font-medium text-base truncate">{site.domain}</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {site.type || "Website"} • User: {site.user_id ?? "-"}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    String(site.status || "").toLowerCase() === "active"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {site.status || "Active"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No websites found.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <Dialog open={usersOpen} onOpenChange={setUsersOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Users ({users.length})</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto border rounded-md">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background border-b">
                <tr>
                  <th className="text-left font-medium px-3 py-2 w-[80px]">ID</th>
                  <th className="text-left font-medium px-3 py-2">Name</th>
                  <th className="text-left font-medium px-3 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td className="px-3 py-4 text-muted-foreground" colSpan={3}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="border-b last:border-b-0">
                      <td className="px-3 py-2">{u.id}</td>
                      <td className="px-3 py-2">{u.full_name}</td>
                      <td className="px-3 py-2">{u.email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard;

