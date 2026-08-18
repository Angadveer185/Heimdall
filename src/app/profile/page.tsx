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
import { AccountSecurityCard } from "@/components/profile/AccountSecurityCard";
import {
  ShieldCheck,
  LogIn,
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

export default function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // If user is null (unauthenticated or loading)
  if (!user) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border border-neo-line bg-neo-rice p-8 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 border-2 border-neo-line bg-neo-bg text-neo-sun flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-label tracking-widest text-neo-ash uppercase">
              AUTHENTICATION REQUIRED // USER DOSSIER
            </span>
            <h1 className="font-heading font-bold text-2xl text-neo-ink">
              Access Restricted
            </h1>
            <p className="text-xs font-body text-neo-ash">
              Please sign in to view your user dossier, donation records, and administrative controls.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Access Profile</span>
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

  return (
    <div className="h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink flex flex-col md:flex-row">
      {/* Left Panel: Universal Sidebar with Dummy Routes & Logout Button */}
      <Sidebar user={user} />

      {/* Right Main Workspace (Non-scrollable outer container, inner pane handles scrolling) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-neo-bg">
        {/* Top Warning Banner: "Small Warning if user is reported" (Matches Wireframe) */}
        {user.isReported && (
          <div className="bg-red-900/20 text-red-600 dark:text-red-400 border-b border-red-500/40 px-6 py-3 text-xs font-label flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span>
                <strong>Account Status Warning:</strong> Your account has been reported or flagged for review. Contact support if you believe this is an error.
              </span>
            </div>
            <span className="px-2 py-0.5 text-[10px] bg-red-900/30 border border-red-500/50 uppercase font-semibold">
              FLAGGED
            </span>
          </div>
        )}

        {/* Inner Scrollable Workspace Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Top Workspace Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-line pb-4">
            <div>
              <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold">
                OPERATOR PROFILE DOSSIER
              </span>
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
                User Dashboard & Settings
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-label px-3 py-1.5 border border-neo-line bg-neo-rice text-neo-ink flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>ONLINE</span>
              </span>
            </div>
          </div>

          {/* Top Block: "All User Info" (Matches Wireframe Top Block) */}
          <section>
            <ProfileHeaderCard
              user={user}
              onEditClick={() => setIsEditModalOpen(true)}
            />
          </section>

          {/* Bottom Block: "Role Specific Content" (Matches Wireframe Bottom Block) */}
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
