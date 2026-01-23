import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
// import WebHosting from "./pages/WebHosting";
// import WordPressHosting from "./pages/WordPressHosting";
// import N8nHosting from "./pages/N8nHosting";
// import EcommerceHosting from "./pages/EcommerceHosting";
// import VpsHosting from "./pages/VpsHosting";
// import DomainRegister from "./pages/DomainRegister";
// import DomainTransfer from "./pages/DomainTransfer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import N8nTemplates from "./pages/N8nTemplates";
import N8nTemplatesLanding from "./pages/N8nTemplatesLanding";
// import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
// import NotFound from "./pages/NotFound";
// Dashboard pages
import Websites from "./pages/dashboard/Websites";
import WordPressAddons from "./pages/dashboard/WordPressAddons";
import MigrateWebsite from "./pages/dashboard/MigrateWebsite";
import Domains from "./pages/dashboard/Domains";
import DomainRegister from "./pages/dashboard/DomainRegister";
import DomainTransfer from "./pages/dashboard/DomainTransfer";
import Horizons from "./pages/dashboard/Horizons";
import Emails from "./pages/dashboard/Emails";
import EmailMarketing from "./pages/dashboard/EmailMarketing";
import VPS from "./pages/dashboard/VPS";
import Billing from "./pages/dashboard/Billing";
import PaymentHistory from "./pages/dashboard/PaymentHistory";
import PaymentMethods from "./pages/dashboard/PaymentMethods";
import Settings from "./pages/dashboard/Settings";
import Marketplace from "./pages/dashboard/Marketplace";
import AITools from "./pages/dashboard/AITools";
import DarkWebMonitor from "./pages/dashboard/DarkWebMonitor";
import PostsList from "./pages/PostsList";
import CreatePost from "./pages/CreatePost";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            {/* <Route path="/web-hosting" element={<WebHosting />} />
            <Route path="/wordpress-hosting" element={<WordPressHosting />} />
            <Route path="/n8n-hosting" element={<N8nHosting />} />
            <Route path="/ecommerce-hosting" element={<EcommerceHosting />} />
            <Route path="/vps-hosting" element={<VpsHosting />} />
            <Route path="/domains/register" element={<DomainRegister />} />
            <Route path="/domains/transfer" element={<DomainTransfer />} /> */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Dashboard sub-routes */}
            <Route path="/dashboard/websites" element={<Websites />} />
            <Route path="/dashboard/websites/wordpress-addons" element={<WordPressAddons />} />
            <Route path="/dashboard/websites/migrate" element={<MigrateWebsite />} />
            <Route path="/dashboard/domains" element={<Domains />} />
            <Route path="/dashboard/domains/register" element={<DomainRegister />} />
            <Route path="/dashboard/domains/transfer" element={<DomainTransfer />} />
            <Route path="/dashboard/horizons" element={<Horizons />} />
            <Route path="/dashboard/emails" element={<Emails />} />
            <Route path="/dashboard/email-marketing" element={<EmailMarketing />} />
            <Route path="/dashboard/vps" element={<VPS />} />
            <Route path="/dashboard/billing" element={<Billing />} />
            <Route path="/dashboard/billing/history" element={<PaymentHistory />} />
            <Route path="/dashboard/billing/methods" element={<PaymentMethods />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/services/marketplace" element={<Marketplace />} />
            <Route path="/dashboard/services/ai-tools" element={<AITools />} />
            <Route path="/dashboard/services/dark-web-monitor" element={<DarkWebMonitor />} />
            <Route path="/dashboard/posts" element={<PostsList />} />
            <Route path="/dashboard/posts/create" element={<CreatePost />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/n8n" element={<N8nTemplatesLanding />} />
            <Route path="/templates/n8n/list" element={<N8nTemplates />} />
            <Route path="/templates/wordpress" element={<Templates />} />
            {/* <Route path="/blog" element={<Blog />} /> */}
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
