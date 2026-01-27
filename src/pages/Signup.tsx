import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google?.accounts) {
        clearInterval(interval);

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    // Trim all inputs
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      console.log("📝 Signup attempt for email:", trimmedEmail);
      console.log("🔍 Password length:", trimmedPassword.length);
      
      const response = await api.signup({
        full_name: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
      });
      
      if (response.error) {
        console.error("❌ Signup error:", response.error);
        toast.error(response.error);
        return;
      }

      console.log("✅ Signup successful:", response);
      toast.success("Account created successfully!");
      
      // Auto-login after successful signup
      try {
        const loginResponse = await api.signin({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        if (loginResponse.error) {
          console.warn("⚠️ Auto-login failed, redirecting to login page");
          toast.info("Account created! Please sign in.");
          navigate("/login");
          return;
        }

        // Store auth data
        if (loginResponse.data?.token && loginResponse.data?.user) {
          localStorage.setItem("access_token", loginResponse.data.token);
          localStorage.setItem("user_id", String(loginResponse.data.user.id));
          localStorage.setItem("user_email", loginResponse.data.user.email);
          localStorage.setItem("user_name", loginResponse.data.user.full_name || "");
          
          toast.success("Welcome! You're now signed in.");
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      } catch (loginError) {
        console.warn("⚠️ Auto-login failed:", loginError);
        toast.info("Account created! Please sign in.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("❌ Signup error:", error);
      toast.error(error?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - Quantivue AI</title>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </Helmet>

      <div className="min-h-screen flex">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#020B3A] via-[#07135F] to-[#020B3A] items-center px-16">
          <div className="text-white max-w-lg">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Start Your Journey with <br /> Quantivue AI
            </h1>
            <p className="text-lg text-white/70">
              Build, automate and scale with confidence.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md space-y-5">
            <Logo />

            <h2 className="text-2xl font-bold">Create your account</h2>
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-accent hover:underline">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <PasswordInput placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <PasswordInput placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google */}
            <div id="google-signin-btn" className="flex justify-center" />

            <p className="text-xs text-muted-foreground text-center">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="underline">
                Terms
              </Link>{" "}
              &{" "}
              <Link to="/privacy" className="underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
