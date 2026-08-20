"use client";

import React from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  ShieldCheck,
  ShieldAlert,
  LogIn,
  ArrowLeft,
  Users,
  FolderTree,
  Building2,
  ArrowRight,
  Shield,
  UserCheck,
} from "lucide-react";

export default function AdminIndexPage() {
  const user = useUserStore((state) => state.user);

  // Guard Screens
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
              Access Restricted
            </h1>
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              Please sign in with a Super Admin account to access system administration.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as Super Admin</span>
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 bg-neo-bg text-neo-ink font-body text-xs rounded-xl border border-neo-line/60 hover:border-neo-sun transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "SUPER_ADMIN") {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border border-neo-sun/30 rounded-2xl bg-neo-rice p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl border border-neo-sun/30 bg-neo-sun/10 text-neo-sun flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              Privilege Mismatch
            </div>
            <h1 className="font-heading font-bold text-2xl text-neo-ink pt-1">
              Super Admin Privileges Required
            </h1>
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              Your account current role (<strong className="font-heading font-semibold text-neo-ink">{user.role}</strong>) does not have authorization to access the Super Admin control center.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/profile"
              className="w-full py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
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
          <div className="border-b border-neo-line/40 pb-4 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                Super Admin Command Center
              </div>
              <span className="px-3 py-1 text-xs font-heading font-semibold rounded-full bg-neo-gold/15 text-neo-gold border border-neo-gold/30">
                System Control Active
              </span>
            </div>

            <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
              Administration Dashboard
            </h1>
            <p className="text-xs font-body text-neo-ash max-w-2xl leading-relaxed">
              Select an administration module below to manage system user rosters, standardized catalog pools, or shelter verification registries.
            </p>
          </div>

          {/* Module Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Module 1: User Accounts Roster */}
            <Link
              href="/admin/users"
              className="group p-6 rounded-2xl bg-neo-rice border border-neo-line/60 hover:border-neo-sun/60 transition-all flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-neo-sun/10 border border-neo-sun/30 text-neo-sun shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-xl text-neo-ink group-hover:text-neo-sun transition-colors">
                    User Accounts Roster
                  </h3>
                  <p className="text-xs font-body text-neo-ash leading-relaxed line-clamp-3">
                    Display all registered users regardless of role (Donors, Shelter Admins, Super Admins), update profile details, perform Cloudinary photo uploads, and manage reported account statuses.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neo-line/40 flex items-center justify-between text-xs font-heading font-semibold text-neo-sun uppercase tracking-wide">
                <span>Access User Roster</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 2: Catalog Pools */}
            <Link
              href="/admin/pools"
              className="group p-6 rounded-2xl bg-neo-rice border border-neo-line/60 hover:border-neo-sun/60 transition-all flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-neo-sun/10 border border-neo-sun/30 text-neo-sun shadow-sm">
                    <FolderTree className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-xl text-neo-ink group-hover:text-neo-sun transition-colors">
                    Global Catalog Pools
                  </h3>
                  <p className="text-xs font-body text-neo-ash leading-relaxed line-clamp-3">
                    Create, update, and manage global categories and standardized donation item catalog pools used across shelter wishlists.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neo-line/40 flex items-center justify-between text-xs font-heading font-semibold text-neo-sun uppercase tracking-wide">
                <span>Access Catalog Pools</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 3: Shelter Registry */}
            <Link
              href="/admin/shelters"
              className="group p-6 rounded-2xl bg-neo-rice border border-neo-line/60 hover:border-neo-sun/60 transition-all flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-neo-sun/10 border border-neo-sun/30 text-neo-sun shadow-sm">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-xl text-neo-ink group-hover:text-neo-sun transition-colors">
                    Shelter Registry
                  </h3>
                  <p className="text-xs font-body text-neo-ash leading-relaxed line-clamp-3">
                    Review pending 501(c)(3) EIN shelter registrations, inspect ProPublica nonprofit verification queues, and manage shelter dossiers.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neo-line/40 flex items-center justify-between text-xs font-heading font-semibold text-neo-sun uppercase tracking-wide">
                <span>Access Shelter Registry</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
