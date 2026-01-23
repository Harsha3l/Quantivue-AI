import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
}

const Logo = ({ className = "", variant = "dark" }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <img src={logo} alt="Quantivue AI" className="h-10 w-10 rounded-lg" />
      <span className={`text-xl font-bold tracking-tight ${variant === "dark" ? "text-foreground" : "text-primary-foreground"}`}>
        Quantivue AI
      </span>
    </Link>
  );
};

export default Logo;
