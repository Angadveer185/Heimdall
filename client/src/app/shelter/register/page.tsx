"use client";

import React from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import { ShelterRegisterForm } from "@/components/shelter/ShelterRegisterForm";
import {
  Building2,
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function ShelterRegisterPage() {
  const user = useUserStore((state) => state.user);

  // State 1: Unauthenticated user
  if (!user) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink font-body">
        <div className="w-full max-w-md border border-neo-line/70 rounded-2xl bg-neo-rice p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl border border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center mx-auto shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide">
              <UserCheck className="w-3.5 h-3.5" />
              Donor Account Required
            </div>
            <h1 className="font-heading font-bold text-2xl text-neo-ink pt-1">
              Sign In to Register Shelter
            </h1>
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              To ensure platform security and transparency, shelters are registered by verified account holders.
              Please sign in or create a donor account to proceed with your shelter registration.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login?redirect=/shelter/register"
              className="w-full py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/register"
              className="w-full py-2.5 bg-neo-bg text-neo-ink font-body text-xs rounded-xl border border-neo-line/60 hover:border-neo-sun transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 2: User already administers a shelter
  const hasExistingShelter = Boolean(user.shelterId || user.shelter?.id || user.role === "SHELTER_ADMIN");

  if (hasExistingShelter && user.role !== "SUPER_ADMIN") {
    return (
      <div className="h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink flex flex-col md:flex-row font-body">
        <Sidebar user={user} />

        <main className="flex-1 flex flex-col items-center justify-center p-6 h-full overflow-y-auto bg-neo-bg">
          <div className="w-full max-w-lg border border-neo-line/70 rounded-2xl bg-neo-rice p-8 text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 rounded-2xl border border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center mx-auto shadow-sm">
              <Building className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Shelter Administrator
              </div>
              <h1 className="font-heading font-bold text-2xl text-neo-ink pt-1">
                You Already Manage a Facility
              </h1>
              <p className="text-xs font-body text-neo-ash leading-relaxed">
                Your account is already linked to a registered shelter facility. You can manage your wishlist requests,
                scan incoming QR delivery passes, or update operational details directly in your shelter console.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/shelter/manage"
                className="w-full py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
              >
                <span>Go to Shelter Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/profile"
                className="w-full py-2.5 bg-neo-bg text-neo-ink font-body text-xs rounded-xl border border-neo-line/60 hover:border-neo-sun transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Profile</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // State 3: Eligible DONOR (or SUPER_ADMIN) registering a new shelter
  return (
    <div className="h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink flex flex-col md:flex-row font-body">
      {/* Left Panel: Universal Responsive Sidebar */}
      <Sidebar user={user} />

      {/* Right Main Workspace */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-neo-bg">
        <div className="max-w-6xl w-full mx-auto p-6 md:p-8 lg:p-10 space-y-6">

          {/* Top Workspace Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line/40 pb-5">
            <div>
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
                Register a Non-Profit Shelter
              </h1>
              <p className="text-xs md:text-sm font-body text-neo-ash mt-1 max-w-2xl leading-relaxed">
                Connect your organization with community donors.
              </p>
            </div>
          </div>

          {/* Shelter Registration Form Component */}
          <div className="pt-2 pb-12">
            <ShelterRegisterForm />
          </div>

        </div>
      </main>
    </div>
  );
}
