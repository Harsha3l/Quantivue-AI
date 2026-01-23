import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Settings = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    setEmail(localStorage.getItem("user_email") || "");
    setName(localStorage.getItem("user_name") || "");
  }, []);

  return (
    <>
      <Helmet>
        <title>Settings - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} readOnly />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="accent"
                  onClick={() => {
                    localStorage.setItem("user_name", name);
                    toast.success("Settings saved");
                  }}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Settings;

