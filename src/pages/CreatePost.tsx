import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Calendar, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";

const PLATFORMS = [
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "youtube", label: "YouTube" },
  { id: "facebook", label: "Facebook" },
  { id: "x", label: "X (Twitter)" },
] as const;

const CreatePost = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [postingMode, setPostingMode] = useState<"automatic" | "approval">("automatic");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Please login to create a post");
      navigate("/login");
    }
  }, [navigate]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    const previews: string[] = [];

    files.forEach((file) => {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/mpeg",
        "video/quicktime",
        "video/x-msvideo",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image or video file`);
        return;
      }

      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 100MB`);
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          previews.push(e.target.result as string);
          setMediaPreviews([...mediaPreviews, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setMediaFiles([...mediaFiles, ...validFiles]);
  };

  // Remove media file
  const removeMediaFile = (index: number) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index);
    const newPreviews = mediaPreviews.filter((_, i) => i !== index);
    setMediaFiles(newFiles);
    setMediaPreviews(newPreviews);
  };

  // Toggle platform selection
  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId]
    );
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!caption.trim()) {
      toast.error("Please enter a caption");
      return false;
    }

    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return false;
    }

    if (postingMode === "approval" && !caption.trim()) {
      toast.error("Caption is required for approval mode");
      return false;
    }

    // Validate scheduled date/time if provided
    if (scheduledDate || scheduledTime) {
      if (!scheduledDate || !scheduledTime) {
        toast.error("Please provide both date and time for scheduling");
        return false;
      }

      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      if (isNaN(scheduledDateTime.getTime())) {
        toast.error("Invalid date or time");
        return false;
      }
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please login to create a post");
        navigate("/login");
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("platforms", JSON.stringify(selectedPlatforms));
      formData.append("postingMode", postingMode);

      // Add scheduled date/time if provided
      if (scheduledDate && scheduledTime) {
        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
        formData.append("scheduledAt", scheduledDateTime);
      }

      // Add media files
      mediaFiles.forEach((file) => {
        formData.append("media", file);
      });

      // Submit to API
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.detail || "Failed to create post");
        return;
      }

      toast.success("Post created successfully!");
      
      // Redirect to posts list
      setTimeout(() => {
        navigate("/dashboard/posts");
      }, 1000);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Post - Quantivue AI</title>
        <meta name="description" content="Create and schedule social media posts" />
      </Helmet>
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Post</h1>
            <p className="text-muted-foreground">Create and schedule your social media content</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>Enter your caption and upload media</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="caption">Caption *</Label>
                  <Textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={5}
                    className="mt-2"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {caption.length} characters
                  </p>
                </div>

                <div>
                  <Label>Media Files</Label>
                  <div className="mt-2 space-y-4">
                    {mediaPreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {mediaPreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                              {mediaFiles[index].type.startsWith("video/") ? (
                                <video
                                  src={preview}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              ) : (
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeMediaFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {mediaFiles[index].name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Media (Images/Videos)
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">
                      Supported: JPG, PNG, GIF, WebP, MP4, MOV, AVI (Max 100MB per file)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Platforms</CardTitle>
                <CardDescription>Select where to post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {PLATFORMS.map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform.id}
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => togglePlatform(platform.id)}
                      />
                      <Label
                        htmlFor={platform.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {platform.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Posting Mode</CardTitle>
                <CardDescription>Choose how posts are published</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="automatic"
                      name="postingMode"
                      value="automatic"
                      checked={postingMode === "automatic"}
                      onChange={() => setPostingMode("automatic")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="automatic" className="cursor-pointer">
                      <div>
                        <div className="font-medium">Automatic</div>
                        <div className="text-sm text-muted-foreground">
                          Posts will be published automatically
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="approval"
                      name="postingMode"
                      value="approval"
                      checked={postingMode === "approval"}
                      onChange={() => setPostingMode("approval")}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="approval" className="cursor-pointer">
                      <div>
                        <div className="font-medium">Approval Required</div>
                        <div className="text-sm text-muted-foreground">
                          Posts require approval before publishing
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Schedule (Optional)</CardTitle>
                <CardDescription>Schedule your post for later</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledDate">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Date
                    </Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduledTime">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Time
                    </Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                {scheduledDate && scheduledTime && (
                  <p className="text-sm text-muted-foreground">
                    Scheduled for: {format(new Date(`${scheduledDate}T${scheduledTime}`), "PPpp")}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/posts")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Post"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CreatePost;
