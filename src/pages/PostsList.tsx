import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  Twitter,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Loader2,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

interface Post {
  id: number;
  caption: string;
  status: string;
  posting_mode: string;
  scheduled_at: string | null;
  posted_at: string | null;
  created_at: string;
  platforms: Array<{ platform: string; platform_status?: string }>;
  media_count: number;
  platform_count: number;
}

const PLATFORM_ICONS: Record<string, any> = {
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  facebook: Facebook,
  x: Twitter,
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-500",
  pending_approval: "bg-yellow-500",
  scheduled: "bg-blue-500",
  posted: "bg-green-500",
  failed: "bg-red-500",
  rejected: "bg-red-600",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  scheduled: "Scheduled",
  posted: "Posted",
  failed: "Failed",
  rejected: "Rejected",
};

const PostsList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Please login to view posts");
      navigate("/login");
      return;
    }
    fetchPosts();
  }, [navigate, statusFilter, platformFilter]);

  // Fetch posts from API
  const fetchPosts = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      if (platformFilter !== "all") {
        params.append("platform", platformFilter);
      }

      const response = await fetch(`/api/posts?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle approve
  const handleApprove = async (postId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(`/api/posts/${postId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to approve post");
      }

      toast.success("Post approved successfully");
      fetchPosts();
    } catch (error: any) {
      console.error("Error approving post:", error);
      toast.error(error.message || "Failed to approve post");
    }
  };

  // Handle reject
  const handleReject = async (postId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(`/api/posts/${postId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to reject post");
      }

      toast.success("Post rejected");
      fetchPosts();
    } catch (error: any) {
      console.error("Error rejecting post:", error);
      toast.error(error.message || "Failed to reject post");
    }
  };

  return (
    <>
      <Helmet>
        <title>My Posts - Quantivue AI</title>
        <meta name="description" content="Manage your social media posts" />
      </Helmet>
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Posts</h1>
              <p className="text-muted-foreground">Manage and track your social media posts</p>
            </div>
            <Button onClick={() => navigate("/dashboard/posts/create")} className="mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending_approval">Pending Approval</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="posted">Posted</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Platform</label>
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="x">X (Twitter)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No posts found</p>
                <Button onClick={() => navigate("/dashboard/posts/create")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        className={`${STATUS_COLORS[post.status] || "bg-gray-500"} text-white`}
                      >
                        {STATUS_LABELS[post.status] || post.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/dashboard/posts/${post.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{post.caption}</CardTitle>
                    <CardDescription className="text-xs">
                      Created {format(new Date(post.created_at), "PPp")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Platforms */}
                    <div>
                      <p className="text-sm font-medium mb-2">Platforms:</p>
                      <div className="flex flex-wrap gap-2">
                        {post.platforms.map((p, idx) => {
                          const Icon = PLATFORM_ICONS[p.platform];
                          return (
                            <Badge key={idx} variant="outline" className="flex items-center gap-1">
                              {Icon && <Icon className="h-3 w-3" />}
                              {p.platform}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {/* Media count */}
                    {post.media_count > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {post.media_count} media file{post.media_count !== 1 ? "s" : ""}
                      </div>
                    )}

                    {/* Scheduled time */}
                    {post.scheduled_at && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Scheduled: {format(new Date(post.scheduled_at), "PPp")}
                      </div>
                    )}

                    {/* Posted time */}
                    {post.posted_at && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Posted: {format(new Date(post.posted_at), "PPp")}
                      </div>
                    )}

                    {/* Actions for pending approval */}
                    {post.status === "pending_approval" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                          onClick={() => handleApprove(post.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleReject(post.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default PostsList;
