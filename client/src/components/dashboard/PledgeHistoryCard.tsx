"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { DonorPledgeCodeModal, DonorPledgeData } from "./DonorPledgeCodeModal";
import { ShelterVerifyDropoffModal, ShelterPledgeData } from "./ShelterVerifyDropoffModal";
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Loader2,
  ArrowUpRight,
  Sparkles,
  Calendar,
  KeyRound,
  ShieldCheck,
  User,
  Heart,
  Eye,
  X,
  ImageIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PledgedItemDetail {
  id: string;
  quantityPledged: number;
  requestedItem?: {
    globalItem?: {
      title: string;
      defaultUnit?: string;
    };
    unit?: string;
  };
}

interface PledgeRecord {
  id: string;
  pledgeCode: string;
  status: "RESERVED" | "DELIVERED" | "VERIFIED_FULFILLED" | "CANCELLED" | "EXPIRED" | string;
  scheduledDropOffDate?: string | null;
  fulfilledAt?: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
  impactPhotoUrl?: string | null;
  shelterThankYouNote?: string | null;
  donorId?: string;
  donor?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    pledgesCompleted?: number;
    profileImageUrl?: string | null;
  };
  shelter?: {
    id: string;
    name: string;
    city: string;
    state: string;
    street?: string;
    dropOffHours?: string;
  };
  items?: PledgedItemDetail[];
}

export function PledgeHistoryCard() {
  const user = useUserStore((state) => state.user);
  const [pledges, setPledges] = useState<PledgeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED" | "EXPIRED">("ALL");

  // Mode: personal pledges vs shelter incoming (for shelter admins)
  const isShelterAdmin = Boolean(
    user?.role === "SHELTER_ADMIN" ||
    (user?.role === "SUPER_ADMIN" && !!user?.shelterId)
  );
  const [viewMode, setViewMode] = useState<"my-pledges" | "shelter-incoming">("my-pledges");

  // Modals state
  const [selectedDonorPledge, setSelectedDonorPledge] = useState<PledgeRecord | null>(null);
  const [selectedShelterPledge, setSelectedShelterPledge] = useState<PledgeRecord | null>(null);
  const [selectedImpactPhoto, setSelectedImpactPhoto] = useState<string | null>(null);

  const fetchPledges = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = "/api/pledges/my";
      if (viewMode === "shelter-incoming" && isShelterAdmin) {
        endpoint = user?.shelterId
          ? `/api/pledges/shelter/${user.shelterId}`
          : "/api/pledges/shelter";
      }

      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const rawPledges: PledgeRecord[] = data.data;

          // Sort pledges: Active/Ongoing (RESERVED) first, then by date descending
          const sorted = [...rawPledges].sort((a, b) => {
            const aIsActive = a.status === "RESERVED";
            const bIsActive = b.status === "RESERVED";
            if (aIsActive && !bIsActive) return -1;
            if (!aIsActive && bIsActive) return 1;
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          });

          setPledges(sorted);
        } else {
          setPledges([]);
        }
      } else {
        setPledges([]);
      }
    } catch (err) {
      console.error("Error fetching pledge records:", err);
      setPledges([]);
    } finally {
      setLoading(false);
    }
  }, [viewMode, isShelterAdmin, user?.shelterId]);

  useEffect(() => {
    fetchPledges();
  }, [fetchPledges]);

  const activePledges = pledges.filter((p) => p.status === "RESERVED");
  const completedPledges = pledges.filter(
    (p) => p.status === "DELIVERED" || p.status === "VERIFIED_FULFILLED"
  );
  const expiredPledges = pledges.filter(
    (p) => p.status === "EXPIRED" || p.status === "CANCELLED"
  );

  const displayedPledges = pledges.filter((p) => {
    if (filter === "ACTIVE") return p.status === "RESERVED";
    if (filter === "COMPLETED")
      return p.status === "DELIVERED" || p.status === "VERIFIED_FULFILLED";
    if (filter === "EXPIRED")
      return p.status === "EXPIRED" || p.status === "CANCELLED";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESERVED":
        return (
          <span className="px-2.5 py-1 text-[10px] font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 flex items-center gap-1 uppercase">
            <Clock className="w-3 h-3 text-neo-sun animate-pulse" />
            <span>Active / Ongoing</span>
          </span>
        );
      case "DELIVERED":
      case "VERIFIED_FULFILLED":
        return (
          <span className="px-2.5 py-1 text-[10px] font-heading font-semibold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 uppercase">
            <CheckCircle2 className="w-3 h-3" />
            <span>Verified Delivered</span>
          </span>
        );
      case "EXPIRED":
        return (
          <span className="px-2.5 py-1 text-[10px] font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 flex items-center gap-1 uppercase">
            <AlertTriangle className="w-3 h-3" />
            <span>Expired Reservation</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-2.5 py-1 text-[10px] font-heading font-semibold rounded-full bg-neo-ash/15 text-neo-ash border border-neo-line/60 flex items-center gap-1 uppercase">
            <AlertTriangle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[10px] font-heading font-semibold rounded-full bg-neo-ash/15 text-neo-ash border border-neo-line/60 uppercase">
            {status}
          </span>
        );
    }
  };

  const isShelterIncomingView = viewMode === "shelter-incoming" && isShelterAdmin;

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
            <PackageCheck className="w-6 h-6 text-neo-sun" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              {isShelterIncomingView
                ? "Incoming Shelter Pledges & Drop-Off Log"
                : "Pledge History & Drop-Off Log"}
            </h2>
            <p className="text-xs font-body text-neo-ash">
              {isShelterIncomingView
                ? "Manage community donation drop-offs, verify pledge codes, and confirm receipts."
                : "Track your active donation reservations and retrieve your drop-off verification codes."}
            </p>
          </div>
        </div>

        {/* Shelter Admin View Mode Switcher (if shelter admin) */}
        {isShelterAdmin && (
          <div className="inline-flex p-1 rounded-xl bg-neo-bg border border-neo-line/60 shadow-xs shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={() => {
                setViewMode("my-pledges");
                setFilter("ALL");
              }}
              className={`px-3 py-1.5 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "my-pledges"
                  ? "bg-neo-sun text-neo-rice shadow-sm"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>My Donations</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode("shelter-incoming");
                setFilter("ALL");
              }}
              className={`px-3 py-1.5 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "shelter-incoming"
                  ? "bg-neo-sun text-neo-rice shadow-sm"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Shelter Drop-offs</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Tabs Bar (only shown if there are pledges to filter) */}
      {pledges.length > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex p-1 rounded-xl bg-neo-bg border border-neo-line/60 shadow-xs">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer ${
                filter === "ALL"
                  ? "bg-neo-sun text-neo-rice shadow-sm"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              All ({pledges.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter("ACTIVE")}
              className={`px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                filter === "ACTIVE"
                  ? "bg-neo-sun text-neo-rice shadow-sm"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              <span>Active</span>
              {activePledges.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-neo-rice/20 text-[10px] font-mono">
                  {activePledges.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setFilter("COMPLETED")}
              className={`px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer ${
                filter === "COMPLETED"
                  ? "bg-neo-sun text-neo-rice shadow-sm"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              Delivered ({completedPledges.length})
            </button>

            {expiredPledges.length > 0 && (
              <button
                type="button"
                onClick={() => setFilter("EXPIRED")}
                className={`px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer ${
                  filter === "EXPIRED"
                    ? "bg-neo-sun text-neo-rice shadow-sm"
                    : "text-neo-ink hover:text-neo-sun"
                }`}
              >
                Expired ({expiredPledges.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Active Pledges Alert Highlight Banner */}
      {activePledges.length > 0 && filter === "ALL" && (
        <div className="p-3.5 rounded-xl bg-neo-sun/10 border border-neo-sun/30 flex items-center justify-between gap-3 text-xs font-body text-neo-ink">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neo-sun shrink-0 animate-pulse" />
            <span>
              {isShelterIncomingView ? (
                <>
                  Your shelter has <strong className="font-heading text-neo-sun">{activePledges.length} incoming pledge(s)</strong> awaiting donor drop-off and verification.
                </>
              ) : (
                <>
                  You have <strong className="font-heading text-neo-sun">{activePledges.length} active ongoing pledge(s)</strong> awaiting drop-off verification.
                </>
              )}
            </span>
          </div>
          {isShelterIncomingView ? (
            <button
              type="button"
              onClick={() => setFilter("ACTIVE")}
              className="px-3 py-1.5 rounded-lg bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all shrink-0 flex items-center gap-1 shadow-md shadow-neo-sun/20 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>View Active Drop-Offs</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (activePledges.length > 0) {
                  setSelectedDonorPledge(activePledges[0]);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-neo-sun text-neo-rice font-heading font-semibold text-xs hover:bg-neo-sun/90 transition-all shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Show Next Drop-Off Pass</span>
            </button>
          )}
        </div>
      )}

      {/* Main Content State Rendering */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-neo-ash">
          <Loader2 className="w-6 h-6 animate-spin text-neo-sun" />
          <span className="text-xs font-body">Loading pledge ledger records...</span>
        </div>
      ) : pledges.length === 0 ? (
        /* Empty State: No Pledges Made So Far */
        <div className="p-8 sm:p-10 text-center space-y-4 border border-dashed border-neo-line/70 rounded-2xl bg-neo-bg/60">
          <div className="w-14 h-14 rounded-2xl border border-neo-line/60 bg-neo-rice flex items-center justify-center text-neo-sun mx-auto shadow-sm">
            <PackageCheck className="w-7 h-7" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-heading font-bold text-base sm:text-lg text-neo-ink">
              {isShelterIncomingView ? "No Incoming Pledges Yet" : "No Pledges Made Yet"}
            </h3>
            <p className="text-xs sm:text-sm font-body text-neo-ash leading-relaxed">
              {isShelterIncomingView
                ? "Your shelter does not have any donation pledges registered yet. Make sure your wishlist requests are active and published."
                : "You haven't made any donation pledges so far. Explore verified shelter wishlists in your community to donate urgently needed supplies."}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {isShelterIncomingView ? (
              <Link
                href="/shelter/manage"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs hover:bg-neo-sun/90 shadow-md shadow-neo-sun/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Manage Shelter Wishlist</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/#hero-wishlists"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs hover:bg-neo-sun/90 shadow-md shadow-neo-sun/20 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Browse Verified Wishlists</span>
                </Link>
                <Link
                  href="/search/shelters"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neo-rice border border-neo-line/70 hover:border-neo-sun text-neo-ink hover:text-neo-sun font-heading font-semibold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-neo-sun" />
                  <span>Find Local Shelters</span>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : displayedPledges.length === 0 ? (
        /* Empty Filter State */
        <div className="p-8 text-center space-y-2 border border-dashed border-neo-line/60 rounded-xl bg-neo-bg">
          <PackageCheck className="w-8 h-8 mx-auto text-neo-ash/60" />
          <h4 className="font-heading font-semibold text-sm text-neo-ink">
            No {filter.toLowerCase()} pledges
          </h4>
          <p className="text-xs font-body text-neo-ash max-w-sm mx-auto">
            You do not have any pledges currently marked as {filter.toLowerCase()}.
          </p>
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className="text-xs font-heading font-semibold text-neo-sun hover:underline pt-1 cursor-pointer inline-block"
          >
            View all pledges ({pledges.length})
          </button>
        </div>
      ) : (
        /* Render Pledges List */
        <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
          {displayedPledges.map((pledge) => {
            const isOngoing = pledge.status === "RESERVED";
            const isCompleted =
              pledge.status === "DELIVERED" ||
              pledge.status === "VERIFIED_FULFILLED";

            return (
              <div
                key={pledge.id}
                className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 hover:border-neo-sun/60 transition-all space-y-3 shadow-sm"
              >
                {/* Top Row: Shelter Name or Donor Name & Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {isShelterIncomingView ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full border border-neo-line/60 bg-neo-rice flex items-center justify-center text-neo-sun shrink-0 overflow-hidden">
                        {pledge.donor?.profileImageUrl ? (
                          /* eslint-disable-next-next/no-img-element */
                          <img
                            src={pledge.donor.profileImageUrl}
                            alt={pledge.donor.name || "Donor"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-sm text-neo-ink">
                          Donor: {pledge.donor?.name || "Community Donor"}
                        </h4>
                        <p className="text-xs font-body text-neo-ash">
                          {pledge.donor?.email || "Verified Community Donor"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg border border-neo-line/60 bg-neo-rice flex items-center justify-center text-neo-sun shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-sm text-neo-ink">
                          {pledge.shelter?.name || "Community Non-Profit Shelter"}
                        </h4>
                        <p className="text-xs font-body text-neo-ash">
                          {pledge.shelter?.city}, {pledge.shelter?.state}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-neo-rice border border-neo-line/60 text-neo-ink font-semibold">
                      #{pledge.pledgeCode}
                    </span>
                    {getStatusBadge(pledge.status)}
                  </div>
                </div>

                {/* Items Pledged List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-heading font-semibold uppercase text-neo-ash tracking-wide">
                    Items Pledged
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {pledge.items && pledge.items.length > 0 ? (
                      pledge.items.map((item) => (
                        <span
                          key={item.id}
                          className="px-2.5 py-1 rounded-lg bg-neo-rice border border-neo-line/60 text-xs font-body text-neo-ink flex items-center gap-1.5"
                        >
                          <span className="font-heading font-bold text-neo-sun">
                            {item.quantityPledged}x
                          </span>
                          <span>
                            {item.requestedItem?.globalItem?.title || "Item"}
                          </span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-body text-neo-ash italic">
                        Supplies & Equipment Pledged
                      </span>
                    )}
                  </div>
                </div>

                {/* Completed Pledge Feedback: Shelter Thank You Note & Impact Photo */}
                {isCompleted && (pledge.shelterThankYouNote || pledge.impactPhotoUrl) && (
                  <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-transparent border border-amber-500/20 space-y-2.5">
                    {pledge.shelterThankYouNote && (
                      <div className="flex items-start gap-2.5 text-xs font-body text-neo-ink">
                        <Heart className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-heading font-bold text-[11px] uppercase tracking-wide text-amber-700 dark:text-amber-400">
                            Note from {pledge.shelter?.name || "Shelter"}
                          </span>
                          <p className="italic text-neo-ink/90 font-serif text-[13px] leading-relaxed">
                            &ldquo;{pledge.shelterThankYouNote}&rdquo;
                          </p>
                        </div>
                      </div>
                    )}

                    {pledge.impactPhotoUrl && (
                      <div className="pt-2 border-t border-amber-500/15 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedImpactPhoto(pledge.impactPhotoUrl!)}
                          className="relative group rounded-lg overflow-hidden border border-amber-500/30 shrink-0 cursor-pointer shadow-sm hover:ring-2 hover:ring-amber-500/50 transition-all bg-neo-charcoal/5"
                        >
                          <img
                            src={pledge.impactPhotoUrl}
                            alt="Impact proof"
                            className="w-20 h-14 object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-3.5 h-3.5 text-white" />
                          </div>
                        </button>
                        <div className="text-xs font-body">
                          <div className="flex items-center gap-1 font-heading font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Impact Photo Shared</span>
                          </div>
                          <p className="text-[11px] text-neo-ash">
                            Click thumbnail to view proof of delivery from shelter.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Metadata & Actions */}
                <div className="pt-2 border-t border-neo-line/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-body">
                  <div className="flex items-center gap-3 text-neo-ash">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neo-sun" />
                      <span>
                        {isCompleted ? (
                          <>
                            Delivered:{" "}
                            <strong className="text-neo-ink font-heading">
                              {formatDate(pledge.fulfilledAt || pledge.scheduledDropOffDate || pledge.createdAt)}
                            </strong>
                          </>
                        ) : isOngoing ? (
                          <>
                            Drop-Off:{" "}
                            <strong className="text-neo-ink font-heading">
                              {formatDate(pledge.scheduledDropOffDate || pledge.createdAt)}
                            </strong>
                          </>
                        ) : (
                          <>
                            Scheduled:{" "}
                            <strong className="text-neo-ink font-heading">
                              {formatDate(pledge.scheduledDropOffDate || pledge.createdAt)}
                            </strong>
                          </>
                        )}
                      </span>
                    </span>
                  </div>

                  {isOngoing ? (
                    isShelterIncomingView ? (
                      <button
                        type="button"
                        onClick={() => setSelectedShelterPledge(pledge)}
                        className="px-3.5 py-1.5 rounded-lg bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-neo-sun/20 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify Dropoff</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedDonorPledge(pledge)}
                        className="px-3.5 py-1.5 rounded-lg bg-neo-sun text-neo-rice font-heading font-semibold text-xs hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Get Drop-Off Code</span>
                      </button>
                    )
                  ) : (
                    !isShelterIncomingView &&
                    pledge.shelter?.id && (
                      <Link
                        href={`/s/${pledge.shelter.id}`}
                        className="text-neo-sun hover:underline font-heading font-semibold flex items-center gap-1 shrink-0"
                      >
                        <span>View Shelter Wishlist</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DONOR: Pledge Code Pop-up Modal */}
      <DonorPledgeCodeModal
        pledge={selectedDonorPledge as DonorPledgeData | null}
        isOpen={!!selectedDonorPledge}
        onClose={() => setSelectedDonorPledge(null)}
      />

      {/* SHELTER ADMIN: Verify Dropoff Modal */}
      <ShelterVerifyDropoffModal
        pledge={selectedShelterPledge as ShelterPledgeData | null}
        isOpen={!!selectedShelterPledge}
        onClose={() => setSelectedShelterPledge(null)}
        onSuccess={() => {
          fetchPledges();
        }}
      />

      {/* Impact Photo Lightbox Preview Modal */}
      {selectedImpactPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setSelectedImpactPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-neo-rice rounded-2xl overflow-hidden border border-neo-line shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-neo-line/40">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-neo-sun" />
                <h3 className="font-heading font-bold text-sm text-neo-ink">
                  Impact Proof Photo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImpactPhoto(null)}
                className="w-7 h-7 rounded-lg bg-neo-cream/50 text-neo-ash hover:text-neo-ink flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black/5 rounded-xl mt-2 overflow-hidden">
              <img
                src={selectedImpactPhoto}
                alt="Impact proof high resolution"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
