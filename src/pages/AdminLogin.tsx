import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import PasswordInput from "@/components/PasswordInput";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = result.detail || "Invalid email or password";
        setError(message);
        toast.error(message);
        return;
      }

      localStorage.setItem("admin_token", result.token);
      localStorage.setItem("admin_email", result?.admin?.email || normalizedEmail);
      toast.success(result.message || "Admin login successful!");
      navigate("/admin-dashboard");
    } catch (err) {
      const message = "Backend not reachable. Please start the server and try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Quantivue AI</title>
      </Helmet>
      <div className="min-h-screen flex">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
          <div className="max-w-md text-primary-foreground">
            <h1 className="text-4xl font-bold mb-6">
              Welcome to Quantivue AI
            </h1>
            <p className="text-lg opacity-80">
              Admin Dashboard - Manage everything from one place.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <Logo />
            </div>

            <h2 className="text-2xl font-bold mb-2">Admin Sign In</h2>
            <p className="text-muted-foreground mb-6">
              Enter your admin credentials to access the dashboard.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password Input with Eye Icon */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <Button 
                type="submit" 
                className="w-full h-10 text-base font-semibold" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;

