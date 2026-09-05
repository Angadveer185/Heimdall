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
  scheduledDropOffDate: string;
  expiresAt: string;
  createdAt: string;
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

  // Modals state
  const [selectedDonorPledge, setSelectedDonorPledge] = useState<PledgeRecord | null>(null);
  const [selectedShelterPledge, setSelectedShelterPledge] = useState<PledgeRecord | null>(null);

  const isShelterAdmin =
    user?.role === "SHELTER_ADMIN" ||
    (user?.role === "SUPER_ADMIN" && !!user?.shelterId);

  const fetchPledges = useCallback(async () => {
    setLoading(true);
    try {
      let endpoint = "/api/pledges/my";
      if (isShelterAdmin) {
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
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          setPledges(sorted);
        }
      }
    } catch (err) {
      console.error("Error fetching pledge records:", err);
    } finally {
      setLoading(false);
    }
  }, [isShelterAdmin, user?.shelterId]);

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

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
            <PackageCheck className="w-6 h-6 text-neo-sun" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              {isShelterAdmin ? "Incoming Shelter Pledges & Drop-Off Log" : "Pledge History & Drop-Off Log"}
            </h2>
            <p className="text-xs font-body text-neo-ash">
              {isShelterAdmin
                ? "Manage community donation drop-offs, verify pledge codes, and confirm receipts."
                : "Track your active donation reservations and retrieve your drop-off verification codes."}
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 rounded-xl bg-neo-bg border border-neo-line/60 shadow-sm shrink-0">
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

      {/* Active Pledges Alert Highlight Banner */}
      {activePledges.length > 0 && filter === "ALL" && (
        <div className="p-3.5 rounded-xl bg-neo-sun/10 border border-neo-sun/30 flex items-center justify-between gap-3 text-xs font-body text-neo-ink">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neo-sun shrink-0 animate-pulse" />
            <span>
              {isShelterAdmin ? (
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
          {isShelterAdmin ? (
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

      {/* Pledge List */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-neo-ash">
          <Loader2 className="w-6 h-6 animate-spin text-neo-sun" />
          <span className="text-xs font-body">Loading pledge ledger records...</span>
        </div>
      ) : displayedPledges.length === 0 ? (
        <div className="p-8 text-center space-y-2 border border-dashed border-neo-line/60 rounded-xl bg-neo-bg">
          <PackageCheck className="w-8 h-8 mx-auto text-neo-ash/60" />
          <h4 className="font-heading font-semibold text-sm text-neo-ink">
            No pledges in this view
          </h4>
          <p className="text-xs font-body text-neo-ash max-w-sm mx-auto">
            {filter === "ALL"
              ? isShelterAdmin
                ? "No pledges have been registered for your shelter yet."
                : "You have not made any donation pledges yet. Explore active shelter campaigns to start helping."
              : `No pledges currently marked as ${filter.toLowerCase()}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
          {displayedPledges.map((pledge) => {
            const isOngoing = pledge.status === "RESERVED";

            return (
              <div
                key={pledge.id}
                className={`p-4 rounded-xl border transition-all space-y-3 shadow-sm ${
                  isOngoing
                    ? isShelterAdmin
                      ? "bg-neo-sun/5 border-neo-sun/40 hover:border-neo-sun"
                      : "bg-neo-sun/5 border-neo-sun/40 hover:border-neo-sun"
                    : "bg-neo-bg border-neo-line/60 hover:border-neo-line"
                }`}
              >
                {/* Top Row: Shelter / Donor & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neo-line/40 pb-3">
                  {isShelterAdmin ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg border border-neo-line/60 bg-neo-rice flex items-center justify-center text-neo-sun shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-sm text-neo-ink">
                          {pledge.donor?.name || "Registered Donor"}
                        </h4>
                        <p className="text-xs font-body text-neo-ash">
                          {pledge.donor?.email || "Donor"}{" "}
                          {pledge.donor?.pledgesCompleted !== undefined && (
                            <span>• {pledge.donor.pledgesCompleted} drop-offs completed</span>
                          )}
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

                {/* Bottom Metadata & Actions */}
                <div className="pt-2 border-t border-neo-line/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-body">
                  <div className="flex items-center gap-3 text-neo-ash">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neo-sun" />
                      <span>
                        Drop-Off:{" "}
                        <strong className="text-neo-ink font-heading">
                          {formatDate(pledge.scheduledDropOffDate)}
                        </strong>
                      </span>
                    </span>
                  </div>

                  {isOngoing ? (
                    isShelterAdmin ? (
                      <button
                        type="button"
                        onClick={() => setSelectedShelterPledge(pledge)}
                        className="px-3.5 py-1.5 rounded-lg bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-neo-sun/20 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify dropoff</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedDonorPledge(pledge)}
                        className="px-3.5 py-1.5 rounded-lg bg-neo-sun text-neo-rice font-heading font-semibold text-xs hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Get Code</span>
                      </button>
                    )
                  ) : (
                    !isShelterAdmin &&
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
    </div>
  );
}
