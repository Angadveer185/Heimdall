"use client";

import React, { useState } from "react";
import {
  ShelterVerifyDropoffModal,
  ShelterPledgeData,
} from "@/components/dashboard/ShelterVerifyDropoffModal";
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Loader2,
  PackageCheck,
  Mail,
  Phone,
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

export interface PledgeRecord {
  id: string;
  pledgeCode: string;
  status: "RESERVED" | "DELIVERED" | "VERIFIED_FULFILLED" | "CANCELLED" | "EXPIRED" | string;
  scheduledDropOffDate: string;
  expiresAt: string;
  createdAt: string;
  impactPhotoUrl?: string | null;
  shelterThankYouNote?: string | null;
  fulfilledAt?: string | null;
  donor?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    pledgesCompleted?: number;
    profileImageUrl?: string | null;
  };
  items?: PledgedItemDetail[];
}

interface ShelterPledgesManagerProps {
  pledges: PledgeRecord[];
  loading: boolean;
  onRefresh: () => void;
}

export function ShelterPledgesManager({
  pledges,
  loading,
  onRefresh,
}: ShelterPledgesManagerProps) {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "DELIVERED" | "EXPIRED">("ALL");
  const [selectedPledge, setSelectedPledge] = useState<PledgeRecord | null>(null);

  const activePledges = pledges.filter((p) => p.status === "RESERVED");
  const deliveredPledges = pledges.filter(
    (p) => p.status === "DELIVERED" || p.status === "VERIFIED_FULFILLED"
  );
  const expiredPledges = pledges.filter(
    (p) => p.status === "EXPIRED" || p.status === "CANCELLED"
  );

  const displayedPledges = pledges.filter((p) => {
    if (filter === "ACTIVE") return p.status === "RESERVED";
    if (filter === "DELIVERED")
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
            <span>Active Drop-Off</span>
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
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-6 md:p-8 space-y-6 shadow-sm">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line/40 pb-5">
        <div>
          <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-neo-sun" />
            <span>Incoming Donation Pledges & Drop-Off Log</span>
          </h2>
          <p className="text-xs font-body text-neo-ash mt-0.5">
            Review community donations committed to your facility and verify donor pledge codes upon physical drop-off.
          </p>
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
            onClick={() => setFilter("DELIVERED")}
            className={`px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer ${
              filter === "DELIVERED"
                ? "bg-neo-sun text-neo-rice shadow-sm"
                : "text-neo-ink hover:text-neo-sun"
            }`}
          >
            Delivered ({deliveredPledges.length})
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

      {/* Pledges List */}
      {loading ? (
        <div className="p-8 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-center gap-2 text-xs font-body text-neo-ash">
          <Loader2 className="w-4 h-4 animate-spin text-neo-sun" />
          <span>Loading incoming donation pledges...</span>
        </div>
      ) : displayedPledges.length === 0 ? (
        <div className="p-10 rounded-xl bg-neo-bg border border-dashed border-neo-line/60 text-center space-y-3">
          <PackageCheck className="w-10 h-10 text-neo-ash mx-auto opacity-50" />
          <div className="space-y-1">
            <h4 className="font-heading font-semibold text-sm text-neo-ink">
              No Pledges Found
            </h4>
            <p className="text-xs font-body text-neo-ash max-w-sm mx-auto">
              {filter === "ALL"
                ? "No community pledges have been made to your shelter yet. Publish wishlist items to start receiving donation pledges!"
                : `No pledges matching filter "${filter}".`}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedPledges.map((pledge) => {
            const isOngoing = pledge.status === "RESERVED";

            return (
              <div
                key={pledge.id}
                className={`p-4 rounded-xl border transition-all space-y-3 shadow-sm ${
                  isOngoing
                    ? "bg-neo-sun/5 border-neo-sun/40 hover:border-neo-sun"
                    : "bg-neo-bg border-neo-line/60 hover:border-neo-line"
                }`}
              >
                {/* Top Row: Donor info & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neo-line/40 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg border border-neo-line/60 bg-neo-rice flex items-center justify-center text-neo-sun shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-sm text-neo-ink flex items-center gap-2">
                        <span>{pledge.donor?.name || "Registered Community Donor"}</span>
                        {pledge.donor?.pledgesCompleted !== undefined && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-normal">
                            {pledge.donor.pledgesCompleted} drop-offs verified
                          </span>
                        )}
                      </h4>
                      <p className="text-xs font-body text-neo-ash flex items-center gap-3">
                        {pledge.donor?.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-neo-sun" />
                            <span>{pledge.donor.email}</span>
                          </span>
                        )}
                        {pledge.donor?.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-neo-sun" />
                            <span>{pledge.donor.phone}</span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(pledge.status)}
                  </div>
                </div>

                {/* Items Pledged */}
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
                          <span>{item.requestedItem?.globalItem?.title || "Item"}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs font-body text-neo-ash italic">
                        Supplies & Equipment
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Scheduled Drop-off & Action */}
                <div className="pt-2 border-t border-neo-line/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-body">
                  <div className="flex items-center gap-3 text-neo-ash">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neo-sun" />
                      <span>
                        Scheduled Drop-Off:{" "}
                        <strong className="text-neo-ink font-heading">
                          {formatDate(pledge.scheduledDropOffDate)}
                        </strong>
                      </span>
                    </span>
                    {pledge.fulfilledAt && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        • Verified at {formatDate(pledge.fulfilledAt)}
                      </span>
                    )}
                  </div>

                  {isOngoing && (
                    <button
                      type="button"
                      onClick={() => setSelectedPledge(pledge)}
                      className="px-4 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-neo-sun/20 cursor-pointer shrink-0"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify pledge</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Verify Drop-Off Modal */}
      <ShelterVerifyDropoffModal
        pledge={selectedPledge as ShelterPledgeData | null}
        isOpen={!!selectedPledge}
        onClose={() => setSelectedPledge(null)}
        onSuccess={() => {
          onRefresh();
        }}
      />
    </div>
  );
}
