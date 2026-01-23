import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, Calendar, Lock, Key, Globe } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const DomainTransfer = () => {
  const { toast } = useToast();
  const [transferDomain, setTransferDomain] = useState("");
  const [showMoveToAccountModal, setShowMoveToAccountModal] = useState(false);
  const [moveDomainName, setMoveDomainName] = useState("");
  const [transferType, setTransferType] = useState<"to_quantivue" | "to_another_account" | null>(null);

  const handleTransferToQuantivue = async () => {
    if (!transferDomain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name to transfer",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call backend API
      const response = await fetch("http://localhost:8000/api/domains/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain_name: transferDomain,
          transfer_type: "to_quantivue",
        }),
      });

      if (response.ok) {
        toast({
          title: "Transfer Initiated",
          description: `Domain transfer for ${transferDomain} has been initiated successfully`,
        });
        setTransferDomain("");
      } else {
        const error = await response.json();
        throw new Error(error.detail || "Transfer failed");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate transfer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMoveToAnotherAccount = () => {
    setShowMoveToAccountModal(true);
  };

  const handleConfirmMove = async () => {
    if (!moveDomainName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/domains/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain_name: moveDomainName,
          transfer_type: "to_another_account",
        }),
      });

      if (response.ok) {
        toast({
          title: "Move Initiated",
          description: `Domain ${moveDomainName} move to another account has been initiated`,
        });
        setShowMoveToAccountModal(false);
        setMoveDomainName("");
      } else {
        const error = await response.json();
        throw new Error(error.detail || "Move failed");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initiate move. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Transfers - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Transfers</h1>
            <p className="text-muted-foreground">Transfer domains to or from your account</p>
          </div>

          {/* Transfer to Quantivue AI Section */}
          <Card className="mb-8">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl mb-2">Transfer your domain to Quantivue AI</CardTitle>
                <CardDescription className="text-base">
                  Transfer a domain you have registered elsewhere to Quantivue AI
                </CardDescription>
              </div>

              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type the domain you want to transfer"
                    value={transferDomain}
                    onChange={(e) => setTransferDomain(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="accent" onClick={handleTransferToQuantivue}>
                    Transfer
                  </Button>
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-sm text-foreground">
                      Transfer your .com for <strong>₹ 879.00</strong>. The price includes domain renewal for a year.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Get domain ready section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Get your domain ready for transfer</CardTitle>
              <CardDescription>
                Follow these steps to ensure your domain is ready to be transferred
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">The domain can be transferred</h3>
                    <p className="text-sm text-muted-foreground">
                      It's been 60+ days since its registration or latest transfer.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Lock className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">The domain is unlocked</h3>
                    <p className="text-sm text-muted-foreground">
                      Transfer lock must be off at your current provider.{" "}
                      <a href="#" className="text-accent hover:underline">
                        Here's how to unlock a domain
                      </a>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Key className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">You have an authorization code</h3>
                    <p className="text-sm text-muted-foreground">
                      Get a transfer (EPP) code from your current provider.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Move to another account */}
          <Card>
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <ArrowRightLeft className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl mb-2">Move domain to another account</CardTitle>
                <CardDescription className="text-base">
                  Move a domain to another Quantivue AI account
                </CardDescription>
              </div>

              <div className="max-w-md mx-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={handleMoveToAnotherAccount}
                >
                  Move to another account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>

      {/* Move to Another Account Modal */}
      <Dialog open={showMoveToAccountModal} onOpenChange={setShowMoveToAccountModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Domain to Another Account</DialogTitle>
            <DialogDescription>
              Select the domain you want to move to another Quantivue AI account
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Choose a domain"
              value={moveDomainName}
              onChange={(e) => setMoveDomainName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveToAccountModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleConfirmMove}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DomainTransfer;
