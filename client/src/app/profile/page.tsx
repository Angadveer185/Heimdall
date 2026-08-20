"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import { ProfileHeaderCard } from "@/components/profile/ProfileHeaderCard";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { DonorSheltersCard } from "@/components/profile/DonorSheltersCard";
import { ShelterInfoCard } from "@/components/profile/ShelterInfoCard";
import { AdminControlCard } from "@/components/profile/AdminControlCard";
import {
  ShieldCheck,
  LogIn,
  ArrowLeft,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
              Access Restricted
            </h1>
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              Please sign in to view your user profile, donation records, and administrative controls.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Access Profile</span>
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

  return (
    <div className="h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink flex flex-col md:flex-row">
      {/* Left Panel: Universal Sidebar */}
      <Sidebar user={user} />

      {/* Right Main Workspace */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-neo-bg">
        {/* Top Warning Banner if user is reported */}
        {user.isReported && (
          <div className="rounded-xl bg-neo-sun/15 text-neo-sun border border-neo-sun/30 px-5 py-3.5 text-xs font-body flex items-center justify-between gap-3 shadow-sm mx-4 md:mx-6 lg:mx-8 mt-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-neo-sun shrink-0" />
              <span className="leading-relaxed">
                <strong className="font-heading font-semibold">Account Status Warning:</strong> Your account has been reported or flagged for administrative review. Contact support if you believe this is an error.
              </span>
            </div>
            <span className="px-2.5 py-0.5 text-[10px] rounded-full bg-neo-sun/20 border border-neo-sun/40 uppercase font-semibold shrink-0">
              Flagged
            </span>
          </div>
        )}

        {/* Inner Scrollable Workspace Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Top Workspace Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-line/40 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                User Dashboard
              </div>
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
                Profile & Settings
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-body px-3.5 py-1.5 rounded-full border border-neo-line/60 bg-neo-rice text-neo-ink flex items-center gap-2 shadow-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active Member</span>
              </span>
            </div>
          </div>

          {/* Top Block: Profile Information & User Summary */}
          <section>
            <ProfileHeaderCard
              user={user}
              onEditClick={() => setIsEditModalOpen(true)}
            />
          </section>

          {/* Bottom Block: Role Specific Content */}
          <section className="space-y-6">
            {/* DONOR: Shelters previously donated */}
            {user.role === "DONOR" && <DonorSheltersCard user={user} />}

            {/* SHELTER_ADMIN: Shelter currently managing */}
            {(user.role === "SHELTER_ADMIN" || user.shelterId) && (
              <ShelterInfoCard shelter={user.shelter} />
            )}

            {/* SUPER_ADMIN: Manage global items, users, categories */}
            {user.role === "SUPER_ADMIN" && <AdminControlCard user={user} />}
          </section>
        </div>
      </main>

      {/* Edit Profile Modal Dialog */}
      <ProfileEditModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
}
