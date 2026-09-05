"use client";

import React from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import { DashboardEntitySearch } from "@/components/dashboard/DashboardEntitySearch";
import { PledgeHistoryCard } from "@/components/dashboard/PledgeHistoryCard";
import { ShelterAdminInfoCard } from "@/components/dashboard/ShelterAdminInfoCard";
import { DonorSheltersCard } from "@/components/profile/DonorSheltersCard";
import {
  ShieldCheck,
  LogIn,
  Heart,
  UserCheck,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

export default function DashboardPage() {
  const user = useUserStore((state) => state.user);

  // If user is null (unauthenticated or loading)
  if (!user) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border border-neo-line/60 rounded-2xl bg-neo-rice p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl border border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide">
              <UserCheck className="w-3.5 h-3.5" />
              Authentication Required
            </div>
            <h1 className="font-heading font-bold text-2xl text-neo-ink pt-1">
              Access Dashboard
            </h1>
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              Please sign in to access your donation dashboard, manage pledges, search non-profit shelters, and view contribution history.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Access Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isShelterAdmin = user.role === "SHELTER_ADMIN" || user.role === "SUPER_ADMIN" || !!user.shelterId;
  const isSuperAdmin = user.role === "SUPER_ADMIN";

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink selection:bg-neo-sun selection:text-neo-rice transition-colors duration-200">
      {/* Left Side: Sidebar */}
      <Sidebar user={user} />

      {/* Right Side: Main Dashboard Work Area */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neo-line/40 pb-5">
          <div className="space-y-1">
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs font-body text-neo-ash">
              Track your donation pledges, discover community non-profits, and monitor real-world impact.
            </p>
          </div>
        </div>

        {/* Shelter Admin Info Banner (Conditional) */}
        {isShelterAdmin && <ShelterAdminInfoCard user={user} />}

        {/* Top Entity Explorer & Searchbar */}
        <DashboardEntitySearch />

        {/* Pledge History Ledger */}
        <PledgeHistoryCard />

        {/* Shelters Previously Donated To */}
        <DonorSheltersCard user={user} />
      </main>
    </div>
  );
}
