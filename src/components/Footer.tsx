
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  hosting: {
    title: "Hosting Services",
    links: [
      { name: "Web Hosting", href: "/pricing" },
      { name: "WordPress Hosting", href: "/wordpress-hosting" },
      { name: "n8n Cloud Hosting", href: "/n8n-hosting" },
      { name: "E-commerce Hosting", href: "/pricing" },
      { name: "VPS Hosting", href: "/pricing" },
    ],
  },
  domains: {
    title: "Domain Services",
    links: [
      { name: "Register Domain", href: "/domains/register" },
      { name: "Transfer Domain", href: "/domains/transfer" },
      { name: "Domain Pricing", href: "/domains/register" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Templates", href: "/templates" },
      { name: "Blog", href: "/blog" },
      { name: "Help Center", href: "/contact" },
      { name: "Documentation", href: "/contact" },
    ],
  },
  support: {
    title: "Support & Legal",
    links: [
      { name: "Contact Us", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund" },
    ],
  },
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">Quantivue AI</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Affordable hosting for websites & automation. Launch faster with
              secure, high-performance hosting.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} Quantivue AI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
