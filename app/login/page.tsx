"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // <-- 1. Make sure this is here
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card";

export default function LoginPage() {
  const router = useRouter(); // <-- 2. THIS IS THE MISSING LINE

  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // ... the rest of your handleSendOtp and handleVerifyOtp functions ...

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`OTP sent! (Check your terminal or use dev code: ${data.developmentOtp})`);
        setStep("OTP");
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      
      if (res.ok) {
        // Redirect to a dashboard based on the user's role
        alert("Success! Redirecting...");
        router.push("/dashboard"); 
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-800">
            Agent Portal Login
          </CardTitle>
          <CardDescription className="text-slate-500">
            {step === "PHONE" 
              ? "Enter your registered phone number" 
              : `We sent a code to ${phone}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "PHONE" ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="text-center text-lg tracking-widest h-12"
                  maxLength={10}
                />
              </div>
              <Button type="submit" className="w-full text-md h-12">
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="text-center text-lg tracking-widest h-12"
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full text-md h-12">
                Verify & Login
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-sm text-slate-500 hover:text-slate-800"
                onClick={() => setStep("PHONE")}
              >
                Change Phone Number
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}