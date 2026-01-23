import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Logo from "@/components/Logo";
import PasswordInput from "@/components/PasswordInput";
import { api } from "@/lib/api";
import { toast } from "sonner";

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID =
  "387191225878-jclgmhqqfhccafgs1o7m0v2nmm6v6e62.apps.googleusercontent.com";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /* =========================
     GOOGLE SIGN-IN HANDLER
  ========================= */
  const handleGoogleSignIn = async (response: any) => {
    if (!response.credential) {
      toast.error("No credential received from Google");
      return;
    }

    try {
      await api.googleOAuth({ id_token: response.credential });
      toast.success("Signed in with Google");
      navigate("/dashboard");
    } catch {
      toast.error("Google sign-in failed");
    }
  };

  /* =========================
     GOOGLE INIT
  ========================= */
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.accounts) {
        clearInterval(interval);

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
          }
        );
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     LOGIN HANDLER
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setIsLoading(true);

    try {
      console.log("📧 Attempting login with email:", email.trim().toLowerCase());
      
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();
      console.log("📡 Server response status:", res.status);
      console.log("📡 Server response data:", data);

      if (!res.ok) {
        console.log("❌ Login failed:", data.detail || data.message);
        toast.error(data.message || data.detail || "Invalid credentials");
        return;
      }

      // 🔐 SAFETY CHECK
      if (!data?.token || !data?.user) {
        throw new Error("Invalid login response - missing token or user data");
      }

      // ✅ STORE AUTH DATA
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("user_id", String(data.user.id));
      localStorage.setItem("user_email", data.user.email);
      localStorage.setItem("user_name", data.user.full_name || "");

      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
      }

      console.log("✅ Login successful!");
      toast.success("Login successful!");
      const redirect = new URLSearchParams(window.location.search).get("redirect");
      navigate(redirect || "/dashboard");
    } catch (error: any) {
      console.error("❌ LOGIN ERROR:", error);
      const message =
        error?.name === "TypeError"
          ? "Backend not reachable. Please start the server (npm run server) and try again."
          : "Login failed. Please check your credentials.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Quantivue AI</title>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </Helmet>

      <div className="min-h-screen flex">
        {/* LEFT */}
        <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
          <div className="max-w-md text-primary-foreground">
            <h1 className="text-4xl font-bold mb-6">
              Welcome Back to Quantivue AI
            </h1>
            <p className="text-lg opacity-80">
              Manage everything from one dashboard.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Logo className="mb-6" />

            <h2 className="text-2xl font-bold mb-2">Sign in</h2>
            <p className="text-muted-foreground mb-6">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-accent hover:underline">
                Sign up
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(v) => setRememberMe(Boolean(v))}
                  />
                  <span className="text-sm">Remember me</span>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Google Sign-In */}
              <div id="google-signin-button" className="flex justify-center" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
