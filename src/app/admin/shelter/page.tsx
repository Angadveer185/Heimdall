"use client";

import React from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  LogIn,
  ArrowLeft,
  Wrench,
  Sparkles,
  Clock,
} from "lucide-react";

export default function AdminShelterPage() {
  const user = useUserStore((state) => state.user);

  // Unauthenticated Guard Screen
  if (!user) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border border-neo-line bg-neo-rice p-8 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 border-2 border-neo-line bg-neo-bg text-neo-sun flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-label tracking-widest text-neo-ash uppercase">
              AUTHENTICATION REQUIRED // SHELTER REGISTRY
            </span>
            <h1 className="font-heading font-bold text-2xl text-neo-ink">
              Access Restricted
            </h1>
            <p className="text-xs font-body text-neo-ash">
              Please sign in with a Super Admin account to access shelter registry administration.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as Super Admin</span>
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 bg-neo-bg text-neo-ink font-label text-xs uppercase border border-neo-line hover:border-neo-sun transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Non-SuperAdmin Guard Screen
  if (user.role !== "SUPER_ADMIN") {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border-2 border-neo-sun/60 bg-neo-rice p-8 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 border-2 border-neo-sun bg-neo-sun/10 text-neo-sun flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold">
              PRIVILEGE MISMATCH // ACCESS DENIED
            </span>
            <h1 className="font-heading font-bold text-2xl text-neo-ink">
              Super Admin Privileges Required
            </h1>
            <p className="text-xs font-body text-neo-ash">
              Your account current role (<strong>{user.role}</strong>) does not have authorization to manage the shelter verification registry.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/profile"
              className="w-full py-3 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Your Profile</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink flex flex-col md:flex-row">
      <Sidebar user={user} />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-neo-bg">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neo-line pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-label tracking-widest text-amber-500 uppercase font-bold">
                  SUPER ADMIN // SHELTER ARCHITECTURE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-label bg-amber-900/20 text-amber-500 border border-amber-500/30 font-semibold">
                  DEVELOPMENT IN PROGRESS
                </span>
              </div>

              <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
                Shelter Registry & EIN Verification Console
              </h1>
              <p className="text-xs font-body text-neo-ash max-w-2xl">
                Upcoming module for reviewing 501(c)(3) EIN verification queues, approving nonprofit shelters, and managing shelter location dossiers.
              </p>
            </div>
          </div>

          {/* Module Placeholder Card */}
          <div className="p-8 md:p-12 bg-neo-rice border border-neo-line text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 border-2 border-amber-500/50 bg-amber-900/10 text-amber-500 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-xs font-label text-amber-500 font-bold uppercase tracking-widest">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>MODULE UNDER ACTIVE DEVELOPMENT</span>
              </div>
              <h2 className="font-heading font-bold text-2xl text-neo-ink">
                Shelter Verification & Roster Registry
              </h2>
              <p className="text-xs font-body text-neo-ash">
                The Shelter Registry logic is currently being constructed. Super Admins will soon be able to inspect ProPublica EIN validation status, review street coordinates, and approve pending non-profit shelters.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/admin/users"
                className="px-4 py-2.5 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Go to User Accounts</span>
              </Link>

              <Link
                href="/admin/pools"
                className="px-4 py-2.5 bg-neo-bg text-neo-ink font-label text-xs uppercase border border-neo-line hover:border-neo-sun transition-all flex items-center gap-2"
              >
                <span>Go to Catalog Pools</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
