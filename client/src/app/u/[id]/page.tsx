"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  PublicProfileHeaderCard,
  PublicUserData,
} from "@/components/public-profile/PublicProfileHeaderCard";
import { PublicProfileStatsCard } from "@/components/public-profile/PublicProfileStatsCard";
import { PublicShelterFacilityCard } from "@/components/public-profile/PublicShelterFacilityCard";
import {
  ArrowLeft,
  ShieldCheck,
  Loader2,
  UserX,
  Home,
  LayoutDashboard,
} from "lucide-react";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [user, setUser] = useState<PublicUserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublicProfile() {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/users/${userId}/public`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setUser(data.data);
            return;
          }
        }

        // If user profile is not found, check if this is actually a shelter ID
        try {
          const shelterRes = await fetch(`/api/shelters/${userId}`);
          if (shelterRes.ok) {
            const shelterData = await shelterRes.json();
            if (shelterData.success && shelterData.data) {
              router.replace(`/s/${userId}`);
              return;
            }
          }
        } catch {
          // Continue to error state
        }

        setError("User profile not found or unavailable.");
      } catch (err) {
        console.error("Error fetching public user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    }

    fetchPublicProfile();
  }, [userId, router]);

  return (
    <div className="min-h-screen bg-neo-bg text-neo-ink selection:bg-neo-sun selection:text-neo-rice flex flex-col font-body transition-colors duration-200">
      {/* Top Header Bar */}
      <header className="bg-neo-rice border-b border-neo-line/60 py-3.5 px-4 sm:px-6 lg:px-8 shrink-0 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neo-line/60 bg-neo-bg hover:border-neo-sun hover:text-neo-sun transition-all text-xs font-heading font-semibold text-neo-ink cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-neo-sun" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-2.5 rounded-full border border-neo-line/60 text-neo-sun bg-neo-bg hover:border-neo-sun hover:shadow transition-all flex items-center justify-center"
              aria-label="Home"
            >
              <ShieldCheck className="w-4 h-4 text-neo-sun" />
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-md shadow-neo-sun/20"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body Area */}
      <main className="flex-grow max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {loading ? (
          <div className="p-16 rounded-2xl bg-neo-rice border border-neo-line/60 flex flex-col items-center justify-center gap-3 text-center shadow-sm my-8">
            <Loader2 className="w-8 h-8 animate-spin text-neo-sun" />
            <span className="text-xs font-body text-neo-ash font-medium">
              Loading public user profile...
            </span>
          </div>
        ) : error || !user ? (
          <div className="p-12 rounded-2xl bg-neo-rice border border-dashed border-neo-line/60 text-center space-y-4 shadow-sm my-8">
            <UserX className="w-12 h-12 text-neo-ash mx-auto opacity-60" />
            <div className="space-y-1.5">
              <h2 className="font-heading font-bold text-xl text-neo-ink">
                User Profile Not Found
              </h2>
              <p className="text-xs font-body text-neo-ash max-w-md mx-auto leading-relaxed">
                {error || "The user profile you are looking for does not exist or may have been removed."}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-2 shadow-md shadow-neo-sun/20"
              >
                <Home className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header Card */}
            <PublicProfileHeaderCard user={user} />

            {/* Managed Shelter Card (If Shelter Admin) */}
            {user.shelter && <PublicShelterFacilityCard shelter={user.shelter} />}

            {/* Impact Metrics */}
            <PublicProfileStatsCard user={user} />
          </>
        )}
      </main>
    </div>
  );
}
