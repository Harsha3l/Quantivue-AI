import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Search, MoreVertical, Check, CreditCard, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Domain {
  id: number;
  name: string;
  status: string;
  expiry: string;
  autoRenewal: boolean;
}

const Domains = () => {
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>([
    { id: 1, name: "harshathota.com", status: "Active", expiry: "2026-11-03", autoRenewal: false },
    { id: 2, name: "example.com", status: "Active", expiry: "2025-12-31", autoRenewal: true },
    { id: 3, name: "mysite.in", status: "Active", expiry: "2025-11-15", autoRenewal: false },
  ]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewalPeriod, setRenewalPeriod] = useState<number>(1);
  const [couponCode, setCouponCode] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);

  const handleAutoRenewalToggle = async (domain: Domain, checked: boolean) => {
    if (checked) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("/api/billing/payment-methods", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (response.ok) {
          const methods = await response.json();
          setPaymentMethods(methods);

          if (methods.length === 0) {
            setSelectedDomain(domain);
            setShowAddPaymentModal(true);
            return;
          } else {
            setSelectedDomain(domain);
            setShowPaymentModal(true);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    }

    try {
      const response = await fetch(`https://quantivue-ai.onrender.com/api/domains/${domain.id}/auto-renewal`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auto_renewal: checked }),
      });

      if (response.ok) {
        setDomains(domains.map((d) => (d.id === domain.id ? { ...d, autoRenewal: checked } : d)));
        toast({
          title: "Auto-renewal updated",
          description: `Auto-renewal ${checked ? "enabled" : "disabled"} for ${domain.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update auto-renewal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentMethodSelected = async () => {
    if (!selectedDomain) return;

    if (!selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`https://quantivue-ai.onrender.com/api/domains/${selectedDomain.id}/auto-renewal`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ auto_renewal: true }),
      });

      if (response.ok) {
        setDomains(domains.map((d) => (d.id === selectedDomain.id ? { ...d, autoRenewal: true } : d)));
        setShowPaymentModal(false);
        setSelectedDomain(null);
        setSelectedPaymentMethod(null);
        toast({
          title: "Auto-renewal enabled",
          description: `Auto-renewal has been enabled for ${selectedDomain.name} using ${selectedPaymentMethod.type}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable auto-renewal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddPaymentMethod = () => {
    setShowAddPaymentModal(false);
    window.location.href = "/dashboard/billing/methods";
  };

  return (
    <>
      <Helmet>
        <title>Domain Portfolio - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Domain portfolio</h1>
              <p className="text-muted-foreground">Manage all your domains in one place</p>
            </div>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Add new domain
            </Button>
          </div>

          <Card className="mb-6 bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Protect your internet identity</h3>
                    <p className="text-sm text-muted-foreground">
                      harshathota.in or <a href="#" className="text-accent hover:underline">See more options</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground line-through">₹ 899.00</p>
                    <p className="text-sm font-medium text-green-600">Save 99%</p>
                    <p className="text-lg font-bold text-foreground">₹ 1.00/1st yr</p>
                  </div>
                  <Button variant="accent">Get now</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search..." className="pl-10" />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" className="rounded" />
                    </TableHead>
                    <TableHead>Domain name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiration date</TableHead>
                    <TableHead>Auto-renewal</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell className="font-medium">{domain.name}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-green-600">
                          <Check className="h-4 w-4" />
                          {domain.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{domain.expiry}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={domain.autoRenewal} 
                          onCheckedChange={(checked) => handleAutoRenewalToggle(domain, checked)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedDomain(domain);
                              setShowRenewModal(true);
                            }}
                          >
                            Renew
                          </Button>
                          <Button variant="ghost" size="sm">
                            Manage
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {/* Removed "Edit DNS zone" */}
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Change contact details",
                                    description: `Changing contact details for ${domain.name}`,
                                  });
                                }}
                              >
                                Change contact details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast({
                                    title: "Grant access",
                                    description: `Granting access to ${domain.name}`,
                                  });
                                }}
                              >
                                Grant access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>

      {/* Payment Method Selection Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose a payment method to enable auto-renewal for {selectedDomain?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPaymentMethod?.id === method.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => {
                  setSelectedPaymentMethod(method);
                }}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{method.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {method.last4 ? `**** **** **** ${method.last4}` : method.email}
                      {method.expiry && ` • Expires ${method.expiry}`}
                    </p>
                  </div>
                </div>
                {method.is_default && (
                  <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handlePaymentMethodSelected}>
              Use Selected Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Modal */}
      <Dialog open={showAddPaymentModal} onOpenChange={setShowAddPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              You don't have an active payment method. Add one to enable auto-renewal for {selectedDomain?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div
              className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPaymentType === "credit-card"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              }`}
              onClick={() => setSelectedPaymentType("credit-card")}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Credit Card</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <div
              className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPaymentType === "upi"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              }`}
              onClick={() => setSelectedPaymentType("upi")}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">UPI</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <div
              className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedPaymentType === "paypal"
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              }`}
              onClick={() => setSelectedPaymentType("paypal")}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium text-foreground">PayPal</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPaymentModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddPaymentMethod}>
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renew Domain Modal */}
      <Dialog open={showRenewModal} onOpenChange={setShowRenewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Renew your Domain Registration - {selectedDomain?.name}
            </DialogTitle>
            <DialogDescription>
              Review your selected invoice and proceed to checkout
            </DialogDescription>
          </DialogHeader>
          {/* Renew modal content remains unchanged */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Domains;
