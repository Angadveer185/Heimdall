"use client";

import React, { useState } from "react";
import {
  Heart,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Check,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";

export interface WishlistItemDetail {
  id: string;
  requestId: string;
  globalItemId?: string;
  title: string;
  categoryName?: string;
  categoryIcon?: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  quantityNeeded: number;
  quantityReserved: number;
  quantityDelivered: number;
  unit: string;
  notes?: string | null;
}

export interface SelectedPledgeItem {
  requestedItemId: string;
  title: string;
  unit: string;
  quantityPledged: number;
  availableCapacity: number;
  isWishlistItem: boolean;
}

interface ShelterWishlistGridProps {
  items: WishlistItemDetail[];
  selectedItems: SelectedPledgeItem[];
  onToggleItem: (item: WishlistItemDetail, qty: number) => void;
  onUpdateQty: (requestedItemId: string, qty: number) => void;
  onOpenPledgeModal: () => void;
}

export function ShelterWishlistGrid({
  items,
  selectedItems,
  onToggleItem,
  onUpdateQty,
  onOpenPledgeModal,
}: ShelterWishlistGridProps) {
  const [filter, setFilter] = useState<"ALL" | "NEEDED" | "FULFILLED">("ALL");

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "CRITICAL":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-heading font-bold rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3 h-3 animate-pulse text-rose-500" />
            <span>Critical Need</span>
          </span>
        );
      case "HIGH":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 uppercase tracking-wider">
            High Priority
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 uppercase tracking-wider">
            Medium Urgency
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-heading font-semibold rounded-full bg-neo-ash/15 text-neo-ash border border-neo-line/60 uppercase tracking-wider">
            Standard Need
          </span>
        );
    }
  };

  const filteredItems = items.filter((item) => {
    const isFulfilled =
      item.quantityReserved >= item.quantityNeeded ||
      item.quantityDelivered >= item.quantityNeeded;
    if (filter === "NEEDED") return !isFulfilled;
    if (filter === "FULFILLED") return isFulfilled;
    return true;
  });

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
            <Heart className="w-6 h-6 fill-neo-sun/20 text-neo-sun" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neo-sun/10 text-neo-sun text-[11px] font-heading font-semibold uppercase tracking-wider mb-0.5">
              Live Wishlist & Inventory Needs
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Shelter Needs & Supply Wishlist
            </h2>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 rounded-xl bg-neo-bg border border-neo-line/60 shadow-sm shrink-0">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all ${
              filter === "ALL"
                ? "bg-neo-sun text-neo-rice shadow-sm"
                : "text-neo-ink hover:text-neo-sun"
            }`}
          >
            All Items ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("NEEDED")}
            className={`px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all ${
              filter === "NEEDED"
                ? "bg-neo-sun text-neo-rice shadow-sm"
                : "text-neo-ink hover:text-neo-sun"
            }`}
          >
            Needs Pledges
          </button>
          <button
            type="button"
            onClick={() => setFilter("FULFILLED")}
            className={`px-3 py-1 text-xs font-heading font-semibold rounded-lg transition-all ${
              filter === "FULFILLED"
                ? "bg-neo-sun text-neo-rice shadow-sm"
                : "text-neo-ink hover:text-neo-sun"
            }`}
          >
            Fulfilled Needs
          </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-xl bg-neo-bg border border-dashed border-neo-line/60 text-center space-y-2">
          <Package className="w-8 h-8 text-neo-ash mx-auto opacity-50" />
          <p className="text-xs font-body text-neo-ash">
            No wishlist items found matching filter &quot;{filter}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const availableToPledge = Math.max(
              0,
              item.quantityNeeded - item.quantityReserved
            );
            const isFulfilled =
              item.quantityReserved >= item.quantityNeeded ||
              item.quantityDelivered >= item.quantityNeeded;

            const percentage = Math.min(
              100,
              Math.round(
                ((item.quantityReserved + item.quantityDelivered) /
                  (item.quantityNeeded || 1)) *
                  100
              )
            );

            const selected = selectedItems.find(
              (s) => s.requestedItemId === item.id
            );

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-4 shadow-sm ${
                  selected
                    ? "bg-neo-sun/5 border-neo-sun/50 ring-1 ring-neo-sun/30"
                    : isFulfilled
                      ? "bg-neo-bg/60 border-neo-line/40 opacity-90"
                      : "bg-neo-bg border-neo-line/60 hover:border-neo-sun/50"
                }`}
              >
                {/* Header: Title & Urgency */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {item.categoryName && (
                        <span className="text-[10px] font-heading font-semibold uppercase text-neo-ash tracking-wide block mb-0.5">
                          {item.categoryName}
                        </span>
                      )}
                      <h3 className="font-heading font-bold text-base text-neo-ink leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    {isFulfilled ? (
                      <span className="px-2.5 py-0.5 text-[10px] font-heading font-semibold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Goal Met</span>
                      </span>
                    ) : (
                      getUrgencyBadge(item.urgency)
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs font-body text-neo-ash line-clamp-2">
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Metrics & Progress Rail */}
                <div className="space-y-2 pt-2 border-t border-neo-line/40 text-xs font-body">
                  <div className="flex items-center justify-between text-neo-ash">
                    <span>
                      Target:{" "}
                      <strong className="text-neo-ink font-heading">
                        {item.quantityNeeded} {item.unit}
                      </strong>
                    </span>
                    <span>
                      Pledged / Delivered:{" "}
                      <strong className="text-neo-ink font-heading">
                        {item.quantityReserved + item.quantityDelivered} {item.unit}
                      </strong>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-neo-rice border border-neo-line/60 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFulfilled
                          ? "bg-emerald-500"
                          : percentage > 50
                            ? "bg-neo-gold"
                            : "bg-neo-sun"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Interactive Selection Action */}
                <div className="pt-2">
                  {selected ? (
                    <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-neo-rice border border-neo-sun/40">
                      <div className="flex items-center gap-1.5 pl-1">
                        <Check className="w-4 h-4 text-neo-sun" />
                        <span className="text-xs font-heading font-bold text-neo-sun">
                          Selected
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(
                              item.id,
                              Math.max(1, selected.quantityPledged - 1)
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-neo-bg border border-neo-line/60 flex items-center justify-center text-neo-ink hover:border-neo-sun transition-all"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-heading font-bold text-sm min-w-[20px] text-center text-neo-ink">
                          {selected.quantityPledged}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(
                              item.id,
                              selected.quantityPledged + 1
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-neo-bg border border-neo-line/60 flex items-center justify-center text-neo-ink hover:border-neo-sun transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleItem(item, 0)}
                          className="text-[11px] font-heading font-semibold text-rose-500 hover:underline px-1.5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleItem(item, availableToPledge || 1)}
                      className={`w-full py-2.5 px-3 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                        isFulfilled
                          ? "bg-neo-bg border border-neo-line/60 text-neo-ink hover:border-neo-sun"
                          : "bg-neo-sun text-neo-rice hover:bg-neo-sun/90 shadow-neo-sun/20"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {isFulfilled ? "Pledge Extra Supplies" : "Pledge This Item"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Trigger Bar if items selected */}
      {selectedItems.length > 0 && (
        <div className="pt-4 border-t border-neo-line/40 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neo-bg p-4 rounded-xl border border-neo-sun/40 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neo-sun shrink-0 animate-pulse" />
            <span className="text-xs font-body text-neo-ink">
              Selected <strong className="font-heading text-neo-sun">{selectedItems.length} item(s)</strong> for your donation pledge.
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenPledgeModal}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20 cursor-pointer"
          >
            <span>Proceed to Create Pledge Pass</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
