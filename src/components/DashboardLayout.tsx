import { Link, useLocation } from "react-router-dom";
import { useState, ReactNode } from "react";
import {
  Globe,
  CreditCard,
  Settings,
  LogOut,
  Home,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface SidebarItem {
  icon: any;
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: "Home", href: "/dashboard" },
  {
    icon: FileText,
    label: "Posts",
    subItems: [
      { label: "My Posts", href: "/dashboard/posts" },
      { label: "Create Post", href: "/dashboard/posts/create" },
    ],
  },
  {
    icon: Globe,
    label: "Websites",
    subItems: [
      { label: "n8n Templates", href: "/templates/n8n" },
    ],
  },
  {
    icon: CreditCard,
    label: "Billing",
    subItems: [
      { label: "Subscription", href: "/dashboard/billing" },
      { label: "Payment history", href: "/dashboard/billing/history" },
      { label: "Payment methods", href: "/dashboard/billing/methods" },
    ],
  },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (label: string) => {
    setOpenItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_name");
    localStorage.removeItem("remember_me");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden lg:block relative">
        <div className="p-6">
          <Link to="/" className="text-xl font-bold text-foreground">
            Quantivue AI
          </Link>
        </div>
        <nav className="px-4 space-y-1 pb-24">
          {sidebarItems.map((item) => {
            if (item.subItems && item.subItems.length > 0) {
              const isOpen = openItems.includes(item.label);
              const hasActiveSubItem = item.subItems.some((sub) => isActive(sub.href));
              return (
                <Collapsible
                  key={item.label}
                  open={isOpen}
                  onOpenChange={() => toggleItem(item.label)}
                >
                  <CollapsibleTrigger
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors",
                      hasActiveSubItem
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </div>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-90"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.href}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
                            isActive(subItem.href)
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.href || "/dashboard"}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive(item.href)
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 space-y-1">
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <Link
            to="/login"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

