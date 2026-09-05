"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import { ShelterEditForm, ShelterDetails } from "@/components/shelter-manage/ShelterEditForm";
import {
  ShelterWishlistManager,
  ShelterRequestData,
} from "@/components/shelter-manage/ShelterWishlistManager";
import {
  ShelterPledgesManager,
  PledgeRecord,
} from "@/components/shelter-manage/ShelterPledgesManager";
import { ShelterDangerZone } from "@/components/shelter-manage/ShelterDangerZone";
import {
  Building2,
  PackageCheck,
  HeartHandshake,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  LogIn,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

export default function ShelterManagePage() {
  const user = useUserStore((state) => state.user);

  const [shelter, setShelter] = useState<ShelterDetails | null>(null);
  const [loadingShelter, setLoadingShelter] = useState(true);

  const [requests, setRequests] = useState<ShelterRequestData[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [pledges, setPledges] = useState<PledgeRecord[]>([]);
  const [loadingPledges, setLoadingPledges] = useState(false);

  const [activeTab, setActiveTab] = useState<"overview" | "wishlist" | "pledges" | "danger">("overview");

  // Determine authorized shelter ID
  const isShelterAdmin = user?.role === "SHELTER_ADMIN" || user?.role === "SUPER_ADMIN";
  const effectiveShelterId = user?.shelterId || user?.shelter?.id;

  // 1. Fetch Shelter Metadata
  const fetchShelterData = useCallback(async () => {
    if (!effectiveShelterId) {
      // If user has no shelterId on client object, try fetching from /api/shelters
      try {
        const res = await fetch("/api/shelters");
        if (res.ok) {
          const data = await res.json();
          const list = data.success ? data.data : data;
          if (Array.isArray(list) && list.length > 0) {
            setShelter(list[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching shelter:", err);
      } finally {
        setLoadingShelter(false);
      }
      return;
    }

    setLoadingShelter(true);
    try {
      const res = await fetch(`/api/shelters/${effectiveShelterId}`);
      if (res.ok) {
        const data = await res.json();
        setShelter(data.success ? data.data : data);
      }
    } catch (err) {
      console.error("Error fetching managed shelter details:", err);
    } finally {
      setLoadingShelter(false);
    }
  }, [effectiveShelterId]);

  // 2. Fetch Wishlist Requests
  const fetchRequests = useCallback(async () => {
    const targetId = effectiveShelterId || shelter?.id;
    if (!targetId) return;

    setLoadingRequests(true);
    try {
      const res = await fetch("/api/shelter-requests");
      if (res.ok) {
        const data = await res.json();
        const all: ShelterRequestData[] = data.success ? data.data : data;
        if (Array.isArray(all)) {
          setRequests(all.filter((r) => r.shelterId === targetId));
        }
      }
    } catch (err) {
      console.error("Error fetching shelter requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  }, [effectiveShelterId, shelter?.id]);

  // 3. Fetch Shelter Pledges
  const fetchPledges = useCallback(async () => {
    const targetId = effectiveShelterId || shelter?.id;
    if (!targetId) return;

    setLoadingPledges(true);
    try {
      const endpoint = targetId ? `/api/pledges/shelter/${targetId}` : "/api/pledges/shelter";
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setPledges(data.data);
        }
      }
    } catch (err) {
      console.error("Error fetching shelter pledges:", err);
    } finally {
      setLoadingPledges(false);
    }
  }, [effectiveShelterId, shelter?.id]);

  useEffect(() => {
    if (user && isShelterAdmin) {
      fetchShelterData();
    } else {
      setLoadingShelter(false);
    }
  }, [user, isShelterAdmin, fetchShelterData]);

  useEffect(() => {
    if (shelter?.id) {
      fetchRequests();
      fetchPledges();
    }
  }, [shelter?.id, fetchRequests, fetchPledges]);

  // If user is null (unauthenticated)
  if (!user) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border border-neo-line/60 rounded-2xl bg-neo-rice p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl border border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading font-bold text-2xl text-neo-ink">
              Authentication Required
            </h1>
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              Please sign in with your shelter administrator account to access the shelter management console.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Access Shelter Console</span>
          </Link>
        </div>
      </div>
    );
  }

  // If user is not a SHELTER_ADMIN
  if (!isShelterAdmin) {
    return (
      <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink">
        <Sidebar user={user} />
        <main className="flex-1 h-full overflow-y-auto p-6 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-lg border border-red-500/30 rounded-2xl bg-neo-rice p-8 text-center space-y-5 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-2xl text-neo-ink">
                Access Restricted
              </h2>
              <p className="text-xs font-body text-neo-ash leading-relaxed">
                The Shelter Management Console is exclusively accessible to verified <strong>Shelter Administrators</strong>. Your current account role is <strong className="uppercase">{user.role}</strong>.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-2 shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Return to Donor Dashboard</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink selection:bg-neo-sun selection:text-neo-rice transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar user={user} />

      {/* Main Workspace */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Loading Shelter State */}
        {loadingShelter ? (
          <div className="h-64 flex items-center justify-center gap-2 text-xs font-body text-neo-ash">
            <Loader2 className="w-5 h-5 animate-spin text-neo-sun" />
            <span>Loading managed shelter metadata...</span>
          </div>
        ) : !shelter ? (
          <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-8 text-center space-y-4">
            <Building2 className="w-12 h-12 text-neo-ash mx-auto opacity-50" />
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl text-neo-ink">
                No Shelter Facility Linked
              </h3>
              <p className="text-xs font-body text-neo-ash max-w-md mx-auto">
                Your administrator account is not currently linked to an active shelter organization. Please contact a Super Administrator or verify your facility details.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs"
            >
              <span>Back to Dashboard</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Top Facility Banner Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neo-line/40 pb-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-heading font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Shelter Operations Hub
                </div>
                <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink">
                  {shelter.name}
                </h1>
                <p className="text-xs font-body text-neo-ash">
                  {shelter.street ? `${shelter.street}, ` : ""}
                  {shelter.city}, {shelter.state} {shelter.zip} • Drop-Off Hours: {shelter.dropOffHours}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/s/${shelter.id}`}
                  className="px-4 py-2 rounded-xl bg-neo-bg text-neo-ink font-heading font-semibold text-xs border border-neo-line/60 hover:bg-neo-line/20 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>View Public Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-neo-line/40 overflow-x-auto pb-px">
              {/* Tab 1: Overview & Edit */}
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2.5 text-xs font-heading font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                  activeTab === "overview"
                    ? "border-neo-sun text-neo-sun bg-neo-rice shadow-sm"
                    : "border-transparent text-neo-ash hover:text-neo-ink"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Overview & Edit</span>
              </button>

              {/* Tab 2: Wishlist Requests */}
              <button
                type="button"
                onClick={() => setActiveTab("wishlist")}
                className={`px-4 py-2.5 text-xs font-heading font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                  activeTab === "wishlist"
                    ? "border-neo-sun text-neo-sun bg-neo-rice shadow-sm"
                    : "border-transparent text-neo-ash hover:text-neo-ink"
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>Wishlist Requests</span>
                {requests.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-neo-sun/20 text-neo-sun text-[10px] font-mono">
                    {requests.length}
                  </span>
                )}
              </button>

              {/* Tab 3: Incoming Pledges */}
              <button
                type="button"
                onClick={() => setActiveTab("pledges")}
                className={`px-4 py-2.5 text-xs font-heading font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                  activeTab === "pledges"
                    ? "border-neo-sun text-neo-sun bg-neo-rice shadow-sm"
                    : "border-transparent text-neo-ash hover:text-neo-ink"
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Incoming Pledges</span>
                {pledges.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-neo-sun/20 text-neo-sun text-[10px] font-mono">
                    {pledges.length}
                  </span>
                )}
              </button>

              {/* Tab 4: Danger Zone */}
              <button
                type="button"
                onClick={() => setActiveTab("danger")}
                className={`px-4 py-2.5 text-xs font-heading font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                  activeTab === "danger"
                    ? "border-red-600 text-red-600 bg-neo-rice shadow-sm"
                    : "border-transparent text-neo-ash hover:text-red-600"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Danger Zone</span>
              </button>
            </div>

            {/* Tab Panels */}
            {activeTab === "overview" && (
              <ShelterEditForm shelter={shelter} onUpdateSuccess={fetchShelterData} />
            )}

            {activeTab === "wishlist" && (
              <ShelterWishlistManager
                shelterId={shelter.id}
                requests={requests}
                loading={loadingRequests}
                onRefresh={fetchRequests}
              />
            )}

            {activeTab === "pledges" && (
              <ShelterPledgesManager
                pledges={pledges}
                loading={loadingPledges}
                onRefresh={fetchPledges}
              />
            )}

            {activeTab === "danger" && <ShelterDangerZone shelter={shelter} />}
          </>
        )}
      </main>
    </div>
  );
}
