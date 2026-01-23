import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for OAuth tokens in URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (error) {
          console.error('Auth callback error:', error);
          toast.error("Authentication failed. Please try again.");
          navigate("/login");
          return;
        }

        if (token) {
          // Store token in localStorage
          localStorage.setItem('auth_token', token);
          toast.success("Successfully signed in!");
          navigate("/dashboard");
        } else {
          toast.error("No session found. Please try again.");
          navigate("/login");
        }
      } catch (error) {
        console.error('Unexpected auth callback error:', error);
        toast.error("An unexpected error occurred.");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;