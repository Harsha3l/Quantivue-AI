import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const hostingPlans = [
  { name: "Web Hosting", href: "/web-hosting" },
  { name: "WordPress Hosting", href: "/wordpress-hosting" },
  { name: "n8n Cloud Hosting", href: "/n8n-hosting" },
  { name: "E-commerce Hosting", href: "/ecommerce-hosting" },
  { name: "VPS Hosting", href: "/vps-hosting" },
];

const domainServices = [
  { name: "Register Domain", href: "/domains/register" },
  { name: "Transfer Domain", href: "/domains/transfer" },
];

const templateOptions = [
  { name: "WordPress Templates", href: "/templates/wordpress" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Hide auth buttons on n8n templates pages
  const isN8nTemplatesPage = location.pathname.startsWith("/templates/n8n");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-background"
      } border-b border-border/50`}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left: Logo */}
          <Logo variant="dark" />

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-foreground hover:bg-secondary">
                  Hosting Plans <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-card border border-border shadow-xl z-50">
                {hostingPlans.map((plan) => (
                  <DropdownMenuItem key={plan.name} asChild>
                    <Link
                      to={plan.href}
                      className="cursor-pointer hover:bg-secondary"
                    >
                      {plan.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-foreground hover:bg-secondary">
                  Domains <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-card border border-border shadow-xl z-50">
                {domainServices.map((service) => (
                  <DropdownMenuItem key={service.name} asChild>
                    <Link
                      to={service.href}
                      className="cursor-pointer hover:bg-secondary"
                    >
                      {service.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 text-foreground hover:bg-secondary">
                  Products<ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-card border border-border shadow-xl z-50">
                {templateOptions.map((option) => (
                  <DropdownMenuItem key={option.name} asChild>
                    <Link
                      to={option.href}
                      className="cursor-pointer hover:bg-secondary"
                    >
                      {option.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <Button variant="ghost" className="text-foreground hover:bg-secondary" asChild>
              <Link to="/blog">Blog</Link>
            </Button> */}
            <Button variant="ghost" className="text-foreground hover:bg-secondary" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </nav>

          {/* Right: Auth Buttons */}
          {!isN8nTemplatesPage && (
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" className="text-foreground hover:bg-secondary" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="accent" asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg animate-fade-in">
            <nav className="flex flex-col gap-2 p-4">
              <div className="border-b border-border pb-2 mb-2">
                <p className="text-sm font-semibold text-muted-foreground px-3 py-1">
                  Hosting Plans
                </p>
                {hostingPlans.map((plan) => (
                  <Link
                    key={plan.name}
                    to={plan.href}
                    className="block px-3 py-2 text-foreground hover:bg-secondary rounded-md"
                  >
                    {plan.name}
                  </Link>
                ))}
              </div>
              <div className="border-b border-border pb-2 mb-2">
                <p className="text-sm font-semibold text-muted-foreground px-3 py-1">
                  Domains
                </p>
                {domainServices.map((service) => (
                  <Link
                    key={service.name}
                    to={service.href}
                    className="block px-3 py-2 text-foreground hover:bg-secondary rounded-md"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
              <div className="border-b border-border pb-2 mb-2">
                <p className="text-sm font-semibold text-muted-foreground px-3 py-1">
                  Products
                </p>
                {templateOptions.map((option) => (
                  <Link
                    key={option.name}
                    to={option.href}
                    className="block px-3 py-2 text-foreground hover:bg-secondary rounded-md"
                  >
                    {option.name}
                  </Link>
                ))}
              </div>
              <Link
                to="/blog"
                className="px-3 py-2 text-foreground hover:bg-secondary rounded-md"
              >
                Blog
              </Link>
              <Link
                to="/contact"
                className="px-3 py-2 text-foreground hover:bg-secondary rounded-md"
              >
                Contact Us
              </Link>
              {!isN8nTemplatesPage && (
                <div className="flex gap-2 mt-4 px-3">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button variant="accent" className="flex-1" asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
