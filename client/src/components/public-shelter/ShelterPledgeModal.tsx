"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SelectedPledgeItem } from "./ShelterWishlistGrid";
import {
  X,
  Calendar,
  Package,
  Plus,
  Trash2,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Building2,
  LogIn,
} from "lucide-react";

interface CustomPledgeItem {
  id: string;
  title: string;
  quantity: number;
  unit: string;
}

interface ShelterPledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelter: {
    id: string;
    name: string;
    dropOffHours?: string;
  };
  selectedWishlistItems: SelectedPledgeItem[];
  onUpdateQty: (requestedItemId: string, qty: number) => void;
  onRemoveItem: (requestedItemId: string) => void;
  onPledgeSuccess?: () => void;
}

export function ShelterPledgeModal({
  isOpen,
  onClose,
  shelter,
  selectedWishlistItems,
  onUpdateQty,
  onRemoveItem,
  onPledgeSuccess,
}: ShelterPledgeModalProps) {
  // Tomorrow's date default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [dropOffDate, setDropOffDate] = useState(defaultDateStr);
  const [customItems, setCustomItems] = useState<CustomPledgeItem[]>([]);
  const [customTitle, setCustomTitle] = useState("");
  const [customQty, setCustomQty] = useState(1);
  const [customUnit, setCustomUnit] = useState("units");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdPledgeCode, setCreatedPledgeCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddCustomItem = () => {
    if (!customTitle.trim()) return;
    const newItem: CustomPledgeItem = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      quantity: Math.max(1, customQty),
      unit: customUnit || "units",
    };
    setCustomItems([...customItems, newItem]);
    setCustomTitle("");
    setCustomQty(1);
    setCustomUnit("units");
  };

  const handleRemoveCustomItem = (id: string) => {
    setCustomItems(customItems.filter((c) => c.id !== id));
  };

  const handleSubmitPledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWishlistItems.length === 0 && customItems.length === 0) {
      setError("Please select at least one wishlist item or add a custom pledge item.");
      return;
    }

    if (!dropOffDate) {
      setError("Please choose a scheduled drop-off date.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare ISO date
      const scheduledDateTime = new Date(`${dropOffDate}T12:00:00.000Z`).toISOString();

      const payload = {
        items: selectedWishlistItems.map((item) => ({
          requestedItemId: item.requestedItemId,
          quantityPledged: item.quantityPledged,
        })),
        scheduledDropOffDate: scheduledDateTime,
      };

      const res = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const pledge = data.data;
        setCreatedPledgeCode(pledge.pledgeCode || "PLEDGE-SUCCESS");
        if (onPledgeSuccess) onPledgeSuccess();
      } else {
        if (res.status === 401) {
          setError("AUTH_REQUIRED");
        } else {
          setError(data.message || "Failed to create pledge. Please check availability.");
        }
      }
    } catch (err) {
      console.error("Error creating pledge:", err);
      setError("An unexpected error occurred while creating your pledge.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neo-night/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-neo-rice border border-neo-line/60 rounded-2xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] text-neo-ink">
        {/* Top Title Bar */}
        <div className="flex items-center justify-between border-b border-neo-line/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-neo-ink">
                Create Donation Pledge Pass
              </h2>
              <p className="text-xs font-body text-neo-ash">
                Targeting: <strong className="text-neo-ink font-heading">{shelter.name}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-ash hover:text-neo-sun transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success View */}
        {createdPledgeCode ? (
          <div className="p-6 rounded-xl bg-neo-bg border border-emerald-500/40 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-heading font-semibold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                Pledge Reservation Confirmed
              </span>
              <h3 className="font-heading font-bold text-2xl text-neo-ink">
                QR Drop-Off Ticket Created!
              </h3>
              <p className="text-xs font-body text-neo-ash max-w-md mx-auto">
                Present this pledge pass code or QR ticket at <strong>{shelter.name}</strong> during drop-off hours ({shelter.dropOffHours || "Mon-Sat 9am-5pm"}).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neo-rice border border-neo-line/60 font-mono text-center space-y-1">
              <span className="text-[10px] font-heading text-neo-ash uppercase block">
                Pledge Code
              </span>
              <span className="font-bold text-xl text-neo-sun tracking-wider">
                #{createdPledgeCode}
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/donor/pledges"
                className="px-5 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
              >
                <QrCode className="w-4 h-4" />
                <span>View My Active QR Passes</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neo-line/60 bg-neo-rice text-neo-ink font-heading font-semibold text-xs hover:border-neo-sun transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitPledge} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="p-3.5 rounded-xl bg-neo-sun/15 border border-neo-sun/30 text-neo-sun flex items-center justify-between gap-3 text-xs font-body">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {error === "AUTH_REQUIRED"
                      ? "You must be signed in to create a donation pledge."
                      : error}
                  </span>
                </div>
                {error === "AUTH_REQUIRED" && (
                  <Link
                    href="/login"
                    className="px-3 py-1 bg-neo-sun text-neo-rice rounded-lg font-heading font-semibold text-xs flex items-center gap-1 shrink-0 shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            )}

            {/* Priority Wishlist Items Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-semibold uppercase text-neo-ink tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neo-sun" />
                  Priority Wishlist Items Selected ({selectedWishlistItems.length})
                </span>
              </div>

              {selectedWishlistItems.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-neo-bg border border-dashed border-neo-line/60 text-xs font-body text-neo-ash text-center">
                  No wishlist items selected. Select items from the wishlist above or add custom supplies below.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedWishlistItems.map((item) => (
                    <div
                      key={item.requestedItemId}
                      className="p-3 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-between gap-3 text-xs font-body"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Package className="w-4 h-4 text-neo-sun shrink-0" />
                        <span className="font-heading font-bold text-neo-ink truncate">
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="number"
                          min="1"
                          value={item.quantityPledged}
                          onChange={(e) =>
                            onUpdateQty(
                              item.requestedItemId,
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="w-16 px-2 py-1 rounded-lg bg-neo-rice border border-neo-line/60 text-xs font-heading font-bold text-neo-ink text-center"
                        />
                        <span className="text-neo-ash font-mono text-[11px]">
                          {item.unit}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.requestedItemId)}
                          className="p-1 rounded-lg hover:bg-neo-rice text-neo-ash hover:text-rose-500 transition-all cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Contributions Section */}
            <div className="space-y-3 pt-3 border-t border-neo-line/40">
              <div className="space-y-1">
                <span className="text-xs font-heading font-semibold uppercase text-neo-ink tracking-wide block">
                  Additional / Custom Item Contributions
                </span>
                <p className="text-[11px] font-body text-neo-ash">
                  Wishlist items are prioritized, but you are welcome to donate any extra supplies!
                </p>
              </div>

              {/* Added Custom Items List */}
              {customItems.length > 0 && (
                <div className="space-y-2">
                  {customItems.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-between gap-3 text-xs font-body"
                    >
                      <span className="font-heading font-semibold text-neo-ink">
                        {c.quantity}x {c.title} ({c.unit})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomItem(c.id)}
                        className="text-neo-ash hover:text-rose-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Item Input Row */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Custom supply description (e.g. Winter Coats)..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-neo-bg border border-neo-line/70 text-xs font-body text-neo-ink focus:outline-none focus:border-neo-sun"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={customQty}
                    onChange={(e) => setCustomQty(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-2 rounded-xl bg-neo-bg border border-neo-line/70 text-xs font-heading font-bold text-center text-neo-ink"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="px-3 py-2 rounded-xl bg-neo-rice border border-neo-line/60 hover:border-neo-sun font-heading font-semibold text-xs text-neo-ink flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-neo-sun" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drop-Off Date Selection */}
            <div className="space-y-2 pt-3 border-t border-neo-line/40">
              <label className="text-xs font-heading font-semibold uppercase text-neo-ink tracking-wide block">
                Scheduled Drop-Off Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neo-ash">
                  <Calendar className="w-4 h-4 text-neo-sun" />
                </div>
                <input
                  type="date"
                  value={dropOffDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDropOffDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neo-bg border border-neo-line/70 text-xs font-heading font-semibold text-neo-ink focus:outline-none focus:border-neo-sun"
                />
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="pt-3 border-t border-neo-line/40 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neo-line/60 bg-neo-rice text-neo-ink font-heading font-semibold text-xs hover:border-neo-sun transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all flex items-center gap-2 shadow-md shadow-neo-sun/20 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-neo-rice" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                <span>Confirm & Generate Pledge Pass</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
