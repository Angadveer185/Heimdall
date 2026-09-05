"use client";

import React, { useState } from "react";
import { CreateWishlistModal } from "./CreateWishlistModal";
import {
  PackageCheck,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export interface RequestedItemData {
  id: string;
  quantityNeeded: number;
  quantityReserved: number;
  quantityDelivered: number;
  unit: string;
  notes?: string | null;
  globalItem?: {
    id: string;
    title: string;
    defaultUnit?: string;
  };
}

export interface ShelterRequestData {
  id: string;
  shelterId: string;
  title: string;
  description?: string | null;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "ACTIVE" | "FULFILLED" | "ARCHIVED";
  createdAt: string;
  items?: RequestedItemData[];
  categories?: { id: string; name: string }[];
}

interface ShelterWishlistManagerProps {
  shelterId: string;
  requests: ShelterRequestData[];
  loading: boolean;
  onRefresh: () => void;
}

export function ShelterWishlistManager({
  shelterId,
  requests,
  loading,
  onRefresh,
}: ShelterWishlistManagerProps) {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "FULFILLED">("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeRequests = requests.filter((r) => r.status === "ACTIVE");
  const fulfilledRequests = requests.filter((r) => r.status === "FULFILLED");

  const displayedRequests = requests.filter((r) => {
    if (filter === "ACTIVE") return r.status === "ACTIVE";
    if (filter === "FULFILLED") return r.status === "FULFILLED";
    return true;
  });

  const handleDeleteRequest = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the wishlist request "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/shelter-requests/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onRefresh();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete request.");
      }
    } catch (err) {
      console.error("Error deleting request:", err);
      alert("Network error while deleting request.");
    } finally {
      setDeletingId(null);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "CRITICAL":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-heading font-semibold rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 uppercase">
            Critical
          </span>
        );
      case "HIGH":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 uppercase">
            High Urgency
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 uppercase">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-heading font-semibold rounded-full bg-neo-ash/15 text-neo-ash border border-neo-line/60 uppercase">
            Low
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
            <PackageCheck className="w-5 h-5 text-neo-sun" />
            <span>Shelter Wishlist & Inventory Requests</span>
          </h2>
          <p className="text-xs font-body text-neo-ash mt-0.5">
            Manage live donation requests, monitor reserved pipeline quantities, and track verified handoffs.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Filter Pills */}
          <div className="inline-flex p-1 rounded-xl bg-neo-bg border border-neo-line/60 shadow-sm">
            <button
              type="button"
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer ${
                filter === "ALL"
                  ? "bg-neo-sun text-neo-rice shadow-sm"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              All ({requests.length})
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
              {activeRequests.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-neo-rice/20 text-[10px] font-mono">
                  {activeRequests.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setFilter("FULFILLED")}
              className={`px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer ${
                filter === "FULFILLED"
                  ? "bg-neo-sun text-neo-rice shadow-sm"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              Fulfilled ({fulfilledRequests.length})
            </button>
          </div>

          {/* Create Button */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-neo-sun text-neo-rice font-heading font-bold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-1.5 shadow-md shadow-neo-sun/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="p-8 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-center gap-2 text-xs font-body text-neo-ash">
          <Loader2 className="w-4 h-4 animate-spin text-neo-sun" />
          <span>Loading wishlist inventory requests...</span>
        </div>
      ) : displayedRequests.length === 0 ? (
        <div className="p-10 rounded-xl bg-neo-bg border border-dashed border-neo-line/60 text-center space-y-3">
          <PackageCheck className="w-10 h-10 text-neo-ash mx-auto opacity-50" />
          <div className="space-y-1">
            <h4 className="font-heading font-semibold text-sm text-neo-ink">
              No Wishlist Requests Found
            </h4>
            <p className="text-xs font-body text-neo-ash max-w-sm mx-auto">
              {filter === "ALL"
                ? "Your shelter doesn't have any active wishlist campaigns. Publish requests to receive essential goods from local donors!"
                : `No requests matching filter "${filter}".`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-md shadow-neo-sun/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Publish Your First Request</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedRequests.map((req) => {
            const isFulfilled = req.status === "FULFILLED";

            return (
              <div
                key={req.id}
                className="p-5 rounded-xl bg-neo-bg border border-neo-line/60 space-y-4 shadow-sm hover:border-neo-line transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neo-line/40 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-bold text-base text-neo-ink">
                        {req.title}
                      </h3>
                      {getUrgencyBadge(req.urgency)}
                      {isFulfilled ? (
                        <span className="px-2 py-0.5 text-[10px] font-heading font-semibold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Fully Fulfilled</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neo-sun animate-pulse" />
                          <span>Active Needs</span>
                        </span>
                      )}
                    </div>
                    {req.description && (
                      <p className="text-xs font-body text-neo-ash max-w-2xl">
                        {req.description}
                      </p>
                    )}
                  </div>

                  {/* Delete Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req.id, req.title)}
                      disabled={deletingId === req.id}
                      className="p-2 rounded-lg border border-neo-line/60 bg-neo-rice text-neo-ash hover:text-red-600 hover:border-red-500/40 transition-all cursor-pointer disabled:opacity-50"
                      title="Delete wishlist request"
                    >
                      {deletingId === req.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Items & Fulfillment Progress Bars */}
                {req.items && req.items.length > 0 ? (
                  <div className="space-y-3">
                    <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-neo-ash block">
                      Requested Items & Inventory Progress
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {req.items.map((item) => {
                        const totalNeeded = item.quantityNeeded || 1;
                        const delivered = item.quantityDelivered || 0;
                        const reserved = item.quantityReserved || 0;
                        const deliveredPct = Math.min(100, (delivered / totalNeeded) * 100);
                        const reservedPct = Math.min(
                          100 - deliveredPct,
                          (reserved / totalNeeded) * 100
                        );
                        const remaining = Math.max(0, totalNeeded - delivered - reserved);

                        return (
                          <div
                            key={item.id}
                            className="p-3.5 rounded-xl bg-neo-rice border border-neo-line/60 space-y-2.5 text-xs font-body shadow-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="font-heading font-bold text-sm text-neo-ink block">
                                  {item.globalItem?.title || "Item"}
                                </span>
                                {item.notes && (
                                  <span className="text-[11px] text-neo-ash italic block">
                                    "{item.notes}"
                                  </span>
                                )}
                              </div>
                              <span className="font-mono font-bold text-xs text-neo-sun px-2 py-0.5 rounded bg-neo-bg border border-neo-line/60">
                                {totalNeeded} {item.unit}
                              </span>
                            </div>

                            {/* Tri-color Inventory Progress Bar */}
                            <div className="space-y-1">
                              <div className="h-2 w-full rounded-full bg-neo-bg overflow-hidden flex border border-neo-line/40">
                                {/* Delivered portion (Emerald) */}
                                <div
                                  style={{ width: `${deliveredPct}%` }}
                                  className="h-full bg-emerald-500 transition-all duration-300"
                                  title={`Delivered: ${delivered}`}
                                />
                                {/* Reserved portion (Neo-Sun) */}
                                <div
                                  style={{ width: `${reservedPct}%` }}
                                  className="h-full bg-neo-sun transition-all duration-300"
                                  title={`Reserved: ${reserved}`}
                                />
                              </div>

                              {/* Progress Stats Breakdown */}
                              <div className="flex items-center justify-between text-[11px] font-mono text-neo-ash pt-0.5">
                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                  <span>{delivered} delivered</span>
                                </span>
                                <span className="text-neo-sun font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-neo-sun shrink-0" />
                                  <span>{reserved} reserved</span>
                                </span>
                                <span className="text-neo-ink font-semibold flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-neo-ash shrink-0" />
                                  <span>{remaining} needed</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-body text-neo-ash italic">
                    No individual inventory items linked to this campaign.
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Wishlist Request Modal */}
      <CreateWishlistModal
        shelterId={shelterId}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={onRefresh}
      />
    </div>
  );
}
