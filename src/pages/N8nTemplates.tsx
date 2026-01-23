import { useMemo, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Workflow,
  ArrowRight,
  Search,
  Download,
  LayoutGrid,
  Layers,
  Loader2,
  Upload,
  ExternalLink,
} from "lucide-react";
import { api, Template } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mapping of template IDs to n8n workflow URLs
const WORKFLOW_URLS: Record<string, string> = {
  "alert_on_instagram_competitor_story": "http://localhost:5678/workflow/BUhhKA6ib1e0dhv5dieyl",
  "auto-dm_new_twitter_followers": "http://localhost:5678/workflow/GjvFii6CCu2FY2GVj2_lH",
  "auto_post_blogs_to_linkedin_and_twitter": "http://localhost:5678/workflow/JH0JXUfwqbPQIRDPLClHR",
  "auto-post_blogs_to_linkedin_and_twitter": "http://localhost:5678/workflow/JH0JXUfwqbPQIRDPLClHR",
  "cross-post_youtube_uploads_to_facebook": "http://localhost:5678/workflow/Kjqt7Tce1uBOBpRxS-XKL",
  "cross_post_youtube_uploads_to_facebook": "http://localhost:5678/workflow/Kjqt7Tce1uBOBpRxS-XKL",
  "generate_personalized_marketing_emails_from_google_sheets_with_llama_ai": "http://localhost:5678/workflow/_CRNf8V-HLuoDr-t-LqP2",
  "log_twitter_mentions_in_notion": "http://localhost:5678/workflow/n3aeMaRsAu6svkh8bmnBg",
  "monthly_social_media_report": "http://localhost:5678/workflow/Po2Ghhtg8hEVeUtH6tywR",
  "reddit_upvote_alert": "http://localhost:5678/workflow/E2YgiBbdjxZ_sCn-Bty6H",
  "schedule_instagram_content_from_airtable": "http://localhost:5678/workflow/WjaOKMJ_QfUaCTj7sskiM",
  "video_automation_images_only": "http://localhost:5678/workflow/Xb10g97tzOhG4_uMuHB9t",
  "Video_Automation__images_only_": "http://localhost:5678/workflow/Xb10g97tzOhG4_uMuHB9t",
  "auto_reply_to_tiktok_comments": "http://localhost:5678/workflow/20aW065HJctP5xenMg8dI",
  "auto-reply_to_tiktok_comments": "http://localhost:5678/workflow/20aW065HJctP5xenMg8dI",
};

// Fallback workflow URLs - cycle through if template not found in mapping
const FALLBACK_WORKFLOW_URLS = [
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

/**
 * Get workflow URL for a template
 * @param templateId - Template ID
 * @returns n8n workflow URL
 */
function getWorkflowUrl(templateId: string): string {
  // Try exact match first
  if (WORKFLOW_URLS[templateId]) {
    return WORKFLOW_URLS[templateId];
  }
  
  // Try case-insensitive match
  const lowerId = templateId.toLowerCase();
  for (const [key, url] of Object.entries(WORKFLOW_URLS)) {
    if (key.toLowerCase() === lowerId) {
      return url;
    }
  }
  
  // Use hash of template ID to consistently map to a fallback URL
  let hash = 0;
  for (let i = 0; i < templateId.length; i++) {
    hash = ((hash << 5) - hash) + templateId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % FALLBACK_WORKFLOW_URLS.length;
  return FALLBACK_WORKFLOW_URLS[index];
}

const categories = [
  { name: "All Category", count: null },
  { name: "Content Creation", count: 72 },
  { name: "CRM & Sales", count: 8 },
  { name: "Customer Support", count: 3 },
  { name: "Data Processing & Analysis", count: 79 },
  { name: "Developer tools", count: 10 },
  { name: "E-commerce & Retail", count: 1 },
  { name: "Financial & Accounting", count: 2 },
  { name: "Jobs", count: 3 },
  { name: "Lead Generation", count: 14 },
  { name: "Marketing & Advertising Automation", count: 23 },
  { name: "Messaging", count: 29 },
  { name: "News", count: 2 },
  { name: "Project Management", count: 5 },
  { name: "SEO tools", count: 4 },
  { name: "Social Media Management", count: 16 },
  { name: "Travel", count: 1 },
  { name: "Videos", count: 26 },
  { name: "Web Scraping", count: 39 },
];

const ITEMS_PER_PAGE = 6;

const N8nTemplates = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [backendTemplates, setBackendTemplates] = useState<Template[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [importingTemplateId, setImportingTemplateId] = useState<string | null>(null);
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewing, setViewing] = useState<{ id: string; name: string } | null>(null);
  const [templateJson, setTemplateJson] = useState<any>(null);
  const [templateJsonLoading, setTemplateJsonLoading] = useState(false);
  const isLoggedIn = Boolean(localStorage.getItem("access_token"));

  // Require login to access this page at all
  useEffect(() => {
    if (isLoggedIn) return;
    const redirect = "/templates/n8n";
    navigate(`/login?redirect=${encodeURIComponent(redirect)}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Load templates from backend (local templates folder)
  useEffect(() => {
    const load = async () => {
      setIsLoadingTemplates(true);
      const result = await api.searchTemplates();
      if (result.error) {
        toast.error(result.error);
        setAllTemplates([]);
      } else {
        setAllTemplates(result.data || []);
      }
      setIsLoadingTemplates(false);
    };
    load();
  }, []);

  // If user came back from login with ?view=<id>, open it automatically
  useEffect(() => {
    if (!isLoggedIn) return;
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get("view");
    if (!viewId) return;
    const t = allTemplates.find((x) => x.id === viewId);
    if (t) {
      handleViewWorkflow(t);
      params.delete("view");
      navigate({ search: params.toString() ? `?${params.toString()}` : "" }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, allTemplates]);

  // Fetch backend templates when search query changes
  useEffect(() => {
    const searchBackend = async () => {
      if (searchQuery.trim().length < 2) {
        setBackendTemplates([]);
        return;
      }

      setIsSearching(true);
      const result = await api.searchTemplates(searchQuery);
      
      if (result.error) {
        toast.error(result.error);
        setBackendTemplates([]);
      } else {
        setBackendTemplates(result.data || []);
      }
      setIsSearching(false);
    };

    const debounceTimer = setTimeout(searchBackend, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const filteredWorkflows = useMemo(() => {
    // Category pills are UI-only for now; templates are loaded from backend.
    // We filter only by search query here; categories are not stored in template JSON filenames.
    const q = searchQuery.trim().toLowerCase();
    const base = allTemplates;
    if (!q) return base;
    return base.filter((t) => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }, [allTemplates, searchQuery]);

  const visibleWorkflows = filteredWorkflows.slice(0, visibleCount);
  const hasMoreWorkflows = visibleCount < filteredWorkflows.length;

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleImportToN8n = async (templateId: string) => {
    setImportingTemplateId(templateId);
    try {
      const result = await api.importToN8n(templateId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Template imported to n8n successfully!");
        if (result.data?.workflow?.n8nUrl) {
          // Optionally open n8n workflow in new tab
          setTimeout(() => {
            window.open(result.data.workflow.n8nUrl, "_blank");
          }, 1000);
        }
      }
    } catch (error) {
      toast.error("Failed to import template to n8n");
    } finally {
      setImportingTemplateId(null);
    }
  };

  const handleViewWorkflow = async (t: Template) => {
    // Require login to view
    if (!isLoggedIn) {
      const redirect = `/templates/n8n/list?view=${encodeURIComponent(t.id)}`;
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    
    // Get workflow URL for this template
    const workflowUrl = getWorkflowUrl(t.id);
    
    // Check if n8n is accessible before opening
    try {
      const n8nBaseUrl = workflowUrl.split('/workflow')[0];
      const healthCheck = await fetch(`${n8nBaseUrl}/healthz`, { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      }).catch(() => null);
      
      // Open n8n workflow in new tab
      const n8nWindow = window.open(workflowUrl, "_blank");
      
      if (!n8nWindow) {
        toast.error("Please allow pop-ups to open n8n workflow");
        return;
      }
      
      toast.info("Opening workflow in n8n... If it doesn't load, make sure n8n is running on http://localhost:5678");
      
      // Check after a delay if the window was closed (might indicate connection error)
      setTimeout(() => {
        if (n8nWindow.closed) {
          toast.warning("Could not connect to n8n. Please make sure n8n is running on http://localhost:5678");
        }
      }, 2000);
    } catch (error) {
      console.error("Error opening workflow:", error);
      toast.error("Failed to open workflow. Make sure n8n is running on http://localhost:5678");
    }
  };

  const handleViewJson = async (t: Template) => {
    // Require login to view
    if (!isLoggedIn) {
      const redirect = `/templates/n8n/list?view=${encodeURIComponent(t.id)}`;
      navigate(`/login?redirect=${encodeURIComponent(redirect)}`);
      return;
    }
    setViewing({ id: t.id, name: t.name });
    setViewOpen(true);
    setTemplateJson(null);
    setTemplateJsonLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/templates/${t.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to load template");
      const json = await res.json();
      setTemplateJson(json);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load template");
    } finally {
      setTemplateJsonLoading(false);
    }
  };

  const downloadTemplate = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/templates/${id}/download`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to download");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.message || "Download failed");
    }
  };

  return (
    <>
      <Helmet>
        <title>n8n Workflow Templates - Quantivue AI</title>
        <meta
          name="description"
          content="Browse our collection of n8n workflow templates. Instantly automate your work with pre-built automation templates."
        />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          {/* Hero */}
          <section className="py-16 bg-gradient-to-b from-accent/5 to-background">
            <div className="container mx-auto px-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 text-accent text-sm mb-6">
                <Workflow className="h-4 w-4" />
                n8n Templates
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Build Faster with Pre-Designed n8n<br />Workflow Templates
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Speed up your work with ready-to-use n8n workflow templates. Stop building from zero. 
                Select a template and customize it in minutes.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Workflows by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        // Search is already triggered by useEffect, but we can ensure it runs
                        if (searchQuery.trim().length >= 2) {
                          // Force search by updating state (already handled by onChange)
                        }
                      }
                    }}
                    className="w-full px-6 py-4 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (searchQuery.trim().length >= 2) {
                        // Search is already triggered by useEffect on searchQuery change
                        // This button click ensures the search runs if needed
                        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                        input?.focus();
                      } else {
                        toast.error("Please enter at least 2 characters to search");
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-accent rounded-full text-accent-foreground hover:bg-accent/90 transition-colors"
                  >
                    {isSearching ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </button>
                  
                  {/* Backend Search Results Dropdown */}
                  {searchQuery.trim().length >= 2 && backendTemplates.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
                      <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-3">Backend Templates ({backendTemplates.length})</p>
                        <div className="space-y-2">
                          {backendTemplates.map((template) => (
                            <div
                              key={template.id}
                              className="p-3 hover:bg-accent/5 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-accent/20"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-foreground truncate">{template.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1 truncate">{template.id}.json</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={importingTemplateId === template.id}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleImportToN8n(template.id);
                                    }}
                                    title="Import to n8n"
                                  >
                                    {importingTemplateId === template.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Upload className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      downloadTemplate(template.id);
                                    }}
                                    title="Download JSON"
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* No Results Message */}
                  {searchQuery.trim().length >= 2 && !isSearching && backendTemplates.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 p-4 text-center">
                      <p className="text-sm text-muted-foreground">No backend templates found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 max-w-xl mx-auto gap-4">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex justify-center mb-2">
                    <Download className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-green-500">6,379+</p>
                  <p className="text-sm text-muted-foreground">Downloads</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex justify-center mb-2">
                    <LayoutGrid className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-500">91+</p>
                  <p className="text-sm text-muted-foreground">Templates</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex justify-center mb-2">
                    <Layers className="h-6 w-6 text-amber-500" />
                  </div>
                  <p className="text-2xl font-bold text-amber-500">18+</p>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </div>
              </div>
            </div>
          </section>

          {/* Categories & Templates */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
                Explore n8n Workflow Templates<br />for Every Need
              </h2>
              <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-10">
                Our n8n templates cover a wide range of categories to help you automate any
                aspect of your work, from marketing to project management.
              </p>

              {/* Category Pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.name
                        ? "bg-accent text-accent-foreground"
                        : "bg-card border border-border text-foreground hover:border-accent/50"
                    }`}
                  >
                    {category.name}
                    {category.count !== null && (
                      <span className="ml-2 text-xs opacity-70">{category.count}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Templates (from backend) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingTemplates && (
                  <div className="col-span-full text-center text-muted-foreground">
                    Loading templates...
                  </div>
                )}
                {!isLoadingTemplates && visibleWorkflows.length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground">
                    No templates found.
                  </div>
                )}
                {visibleWorkflows.map((template) => (
                  <div
                    key={template.id}
                    className="bg-card rounded-2xl border border-border p-6 hover:border-accent/30 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Workflow className="h-5 w-5 text-accent" />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => downloadTemplate(template.id)}
                        title="Download JSON"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {template.id}.json
                    </p>
                    <Button
                      type="button"
                      variant="accent"
                      className="w-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleViewWorkflow(template);
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View workflow
                    </Button>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleViewJson(template);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        View JSON
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          downloadTemplate(template.id);
                        }}
                        title="Download JSON"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreWorkflows && (
                <div className="flex justify-center mt-10">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-accent text-accent hover:bg-accent/10"
                    onClick={handleLoadMore}
                  >
                    Load More Workflows <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>

      <Dialog
        open={viewOpen}
        onOpenChange={(open) => {
          setViewOpen(open);
          if (!open) {
            setViewing(null);
            setTemplateJson(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewing?.name || "Workflow"}</DialogTitle>
            <DialogDescription>
              {viewing ? `${viewing.id}.json` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => viewing && downloadTemplate(viewing.id)}
              disabled={!viewing}
            >
              <Download className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
            <Button
              type="button"
              variant="accent"
              onClick={() => viewing && handleImportToN8n(viewing.id)}
              disabled={!viewing || importingTemplateId === viewing?.id}
            >
              {importingTemplateId === viewing?.id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Import to n8n
            </Button>
          </div>
          <div className="mt-4 max-h-[50vh] overflow-auto rounded-md border bg-muted/30 p-3">
            {templateJsonLoading ? (
              <div className="text-muted-foreground">Loading workflow JSON...</div>
            ) : templateJson ? (
              <pre className="text-xs whitespace-pre-wrap break-words">
                {JSON.stringify(templateJson, null, 2)}
              </pre>
            ) : (
              <div className="text-muted-foreground">No data.</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default N8nTemplates;
