import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Plus, CreditCard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const PaymentMethods = () => {
  const { toast } = useToast();
  const [methods, setMethods] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const paymentTypes = [
    { id: "credit-card", name: "Credit Card", description: "VISA, RuPay, Mastercard" },
    { id: "upi", name: "UPI", description: "Unified Payments Interface" },
    { id: "paypal", name: "PayPal", description: "Pay with PayPal account" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("/api/billing/payment-methods", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) return;
        const data = await res.json();
        setMethods(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    };
    load();
  }, []);

  const handleAddPaymentMethod = () => {
    if (!selectedPaymentType) {
      toast({
        title: "Error",
        description: "Please select a payment method type",
        variant: "destructive",
      });
      return;
    }

    if (selectedPaymentType === "credit-card") {
      setShowPaymentForm(true);
    } else {
      // For UPI and PayPal, show form or redirect
      setShowPaymentForm(true);
    }
  };

  const handleSubmitPayment = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast({
          title: "Error",
          description: "Please login again",
          variant: "destructive",
        });
        return;
      }

      const newMethod = {
        type: paymentTypes.find((p) => p.id === selectedPaymentType)?.name || "Credit Card",
        last4: selectedPaymentType === "credit-card" ? formData.cardNumber.slice(-4) : undefined,
        expiry: selectedPaymentType === "credit-card" ? formData.expiryDate : undefined,
        upi_id: selectedPaymentType === "upi" ? formData.cardNumber : undefined,
        email: selectedPaymentType === "paypal" ? formData.cardNumber : undefined,
        is_default: methods.length === 0,
      };

      const response = await fetch("/api/billing/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMethod),
      });

      if (response.ok) {
        const result = await response.json();
        setMethods([...methods, result]);
        setShowAddModal(false);
        setShowPaymentForm(false);
        setSelectedPaymentType("");
        setFormData({
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          cardholderName: "",
        });
        toast({
          title: "Success",
          description: "Payment method added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment method",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Payment Methods - Quantivue AI</title>
      </Helmet>
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payment Methods</h1>
              <p className="text-muted-foreground">Manage your payment methods</p>
            </div>
            <Button variant="accent" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add payment method
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <div className="space-y-4">
              {methods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-foreground">{method.type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {method.last4 ? `**** **** **** ${method.last4}` : method.email}
                      {method.expiry && ` • Expires ${method.expiry}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                        Default
                      </span>
                    )}
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>

      {/* Add Payment Method Modal - Type Selection */}
      <Dialog open={showAddModal && !showPaymentForm} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Select a payment method type to add
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {paymentTypes.map((type) => (
              <div
                key={type.id}
                className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPaymentType === type.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
                onClick={() => setSelectedPaymentType(type.id)}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{type.name}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleAddPaymentMethod}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Form Modal */}
      <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add {paymentTypes.find((p) => p.id === selectedPaymentType)?.name}</DialogTitle>
            <DialogDescription>
              Enter your payment details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPaymentType === "credit-card" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    maxLength={19}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={formData.cardholderName}
                    onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      maxLength={4}
                    />
                  </div>
                </div>
              </>
            )}
            {selectedPaymentType === "upi" && (
              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                />
              </div>
            )}
            {selectedPaymentType === "paypal" && (
              <div className="space-y-2">
                <Label htmlFor="paypalEmail">PayPal Email</Label>
                <Input
                  id="paypalEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPaymentForm(false);
              setSelectedPaymentType("");
            }}>
              Cancel
            </Button>
            <Button variant="accent" onClick={handleSubmitPayment}>
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentMethods;
