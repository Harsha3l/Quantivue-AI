import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, LayoutGrid, Settings, List } from "lucide-react";
import { toast } from "sonner";

// List of workflow URLs - cycle through them or use the first one
const WORKFLOW_URLS = [
  "http://localhost:5678/workflow/BUhhKA6ib1e0dhv5dieyl",
  "http://localhost:5678/workflow/GjvFii6CCu2FY2GVj2_lH",
  "http://localhost:5678/workflow/JH0JXUfwqbPQIRDPLClHR",
  "http://localhost:5678/workflow/Kjqt7Tce1uBOBpRxS-XKL",
  "http://localhost:5678/workflow/_CRNf8V-HLuoDr-t-LqP2",
  "http://localhost:5678/workflow/n3aeMaRsAu6svkh8bmnBg",
  "http://localhost:5678/workflow/Po2Ghhtg8hEVeUtH6tywR",
  "http://localhost:5678/workflow/E2YgiBbdjxZ_sCn-Bty6H",
  "http://localhost:5678/workflow/WjaOKMJ_QfUaCTj7sskiM",
  "http://localhost:5678/workflow/Xb10g97tzOhG4_uMuHB9t",
  "http://localhost:5678/workflow/20aW065HJctP5xenMg8dI",
  "http://localhost:5678/workflow/p9Ve3n31Wq2Ew8CQotYxX",
  "http://localhost:5678/workflow/mYc9Unw1Y2g9_bvnIMl12",
];

const N8nTemplatesLanding = () => {
  const navigate = useNavigate();

  const handleOpenDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Navigate to the React app's dashboard, not the backend API
      navigate("/dashboard");
    } catch (error) {
      console.error("Error navigating to dashboard:", error);
      toast.error("Failed to navigate to dashboard");
    }
  };

  const handleOpenN8n = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // Open empty n8n workflow editor (new workflow)
      const n8nBaseUrl = import.meta.env.VITE_N8N_BASE_URL || "http://localhost:5678";
      // Use the URL pattern for creating a new empty workflow
      const newWorkflowUrl = `${n8nBaseUrl}/workflow/tUS4iJI14oG6049rElTQh?projectId=TgSwZH18C4UVmBx6&uiContext=workflow_list&new=true`;
      const n8nWindow = window.open(newWorkflowUrl, "_blank");
      
      if (!n8nWindow) {
        toast.error("Please allow pop-ups to open n8n instance");
        return;
      }
      
      // Check if n8n is accessible after a short delay
      setTimeout(() => {
        // If the window was closed immediately, it might be due to connection error
        // We can't directly check, but we can show a helpful message
        toast.info("Opening n8n workflow editor... If it doesn't open, make sure n8n is running on port 5678");
      }, 500);
    } catch (error) {
      console.error("Error opening n8n:", error);
      toast.error("Failed to open n8n instance. Make sure n8n is running on http://localhost:5678");
    }
  };

  const handleViewTemplates = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigate("/templates/n8n/list");
    } catch (error) {
      console.error("Error navigating to templates:", error);
      toast.error("Failed to navigate to templates");
    }
  };

  return (
    <>
      <Helmet>
        <title>N8N Templates - Quantivue AI</title>
        <meta
          name="description"
          content="Access and manage all your local n8n workflows from one place"
        />
      </Helmet>
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center">
          {/* Header with Rocket Icon and Title */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Rocket className="w-12 h-12 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">N8N Templates</h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Access and manage all your local n8n workflows from one place
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 mb-10">
            {/* Go to Dashboard Button */}
            <Button
              type="button"
              onClick={handleOpenDashboard}
              className="w-full py-6 text-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
              size="lg"
            >
              <LayoutGrid className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>

            {/* View Templates Button */}
            <Button
              type="button"
              onClick={handleViewTemplates}
              className="w-full py-6 text-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
              size="lg"
            >
              <List className="w-5 h-5 mr-2" />
              View Templates
            </Button>

            {/* Open N8N Instance Button */}
            <Button
              type="button"
              onClick={handleOpenN8n}
              className="w-full py-6 text-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
              size="lg"
            >
              <Settings className="w-5 h-5 mr-2" />
              Open N8N Instance
            </Button>
          </div>

          {/* Quick Links Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-start gap-2 mb-4">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <h3 className="font-bold text-gray-900 text-base">Quick Links:</h3>
            </div>
            <ul className="text-left space-y-2">
              <li className="text-gray-700">
                <span className="font-semibold text-gray-900">Dashboard:</span>
                <span className="text-gray-600 ml-2 font-mono text-sm">
                  /dashboard
                </span>
              </li>
              <li className="text-gray-700">
                <span className="font-semibold text-gray-900">N8N:</span>
                <span className="text-gray-600 ml-2 font-mono text-sm">
                  http://localhost:5678/workflow/tUS4iJI14oG6049rElTQh?projectId=TgSwZH18C4UVmBx6&uiContext=workflow_list&new=true
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default N8nTemplatesLanding;
