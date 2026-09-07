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
  Heart,
  Camera,
  Edit3,
  Eye,
  X,
  ImageIcon,
  MessageSquareHeart,
  Upload,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

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
  scheduledDropOffDate?: string | null;
  expiresAt?: string | null;
  createdAt?: string | null;
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

  // Thank You Note & Cloudinary Impact Photo management state
  const [uploadingPledgeId, setUploadingPledgeId] = useState<string | null>(null);
  const [editingNotePledge, setEditingNotePledge] = useState<PledgeRecord | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedImpactPreview, setSelectedImpactPreview] = useState<string | null>(null);

  const handleImpactPhotoUpload = async (pledgeId: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose a valid image file (JPEG, PNG, WebP).");
      return;
    }
    setUploadingPledgeId(pledgeId);
    setUploadError(null);
    try {
      await uploadImageToCloudinary(file, "impact", pledgeId);
      onRefresh();
    } catch (err: any) {
      console.error("Failed to upload impact photo:", err);
      setUploadError(err.message || "Failed to upload impact photo. Please try again.");
    } finally {
      setUploadingPledgeId(null);
    }
  };

  const handleSaveThankYouNote = async () => {
    if (!editingNotePledge) return;
    setSavingNote(true);
    setNoteError(null);
    try {
      const res = await fetch(`/api/pledges/${editingNotePledge.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shelterThankYouNote: noteInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update thank you note");
      }
      setEditingNotePledge(null);
      onRefresh();
    } catch (err: any) {
      console.error("Error saving thank you note:", err);
      setNoteError(err.message || "Failed to save thank you note");
    } finally {
      setSavingNote(false);
    }
  };

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
            const isCompleted =
              pledge.status === "DELIVERED" ||
              pledge.status === "VERIFIED_FULFILLED";

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

                {/* Completed Pledge Feedback: Shelter Thank-You Note & Impact Photo */}
                {isCompleted && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/5 via-amber-500/10 to-transparent border border-amber-500/20 space-y-3">
                    {/* Thank You Note */}
                    {pledge.shelterThankYouNote ? (
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 text-xs font-body">
                        <div className="flex items-start gap-2.5">
                          <Heart className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-heading font-bold text-[11px] uppercase tracking-wide text-amber-700 dark:text-amber-400">
                              Thank-You Note to {pledge.donor?.name || "Donor"}
                            </span>
                            <p className="italic text-neo-ink/90 font-serif text-[13px] leading-relaxed mt-0.5">
                              &ldquo;{pledge.shelterThankYouNote}&rdquo;
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNotePledge(pledge);
                            setNoteInput(pledge.shelterThankYouNote || "");
                            setNoteError(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-neo-rice border border-neo-line/60 text-neo-ink hover:text-neo-sun text-[11px] font-heading font-semibold flex items-center gap-1 shrink-0 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Note</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-body">
                        <div className="flex items-center gap-2 text-neo-ash">
                          <MessageSquareHeart className="w-4 h-4 text-amber-500 shrink-0" />
                          <span>No thank-you note shared yet with {pledge.donor?.name || "donor"}.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNotePledge(pledge);
                            setNoteInput("");
                            setNoteError(null);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-heading font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Add Thank-You Note</span>
                        </button>
                      </div>
                    )}

                    {/* Impact Photo */}
                    {pledge.impactPhotoUrl ? (
                      <div className="pt-2.5 border-t border-amber-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedImpactPreview(pledge.impactPhotoUrl!)}
                            className="relative group rounded-lg overflow-hidden border border-amber-500/30 shrink-0 cursor-pointer shadow-xs bg-neo-charcoal/5"
                          >
                            <img
                              src={pledge.impactPhotoUrl}
                              alt="Impact proof"
                              className="w-16 h-12 object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="w-3.5 h-3.5 text-white" />
                            </div>
                          </button>
                          <div className="text-xs font-body">
                            <span className="font-heading font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Impact Photo Verified
                            </span>
                            <span className="text-[11px] text-neo-ash">
                              Donor can view this on their pledge history card.
                            </span>
                          </div>
                        </div>

                        <label className="px-3 py-1.5 rounded-lg bg-neo-rice border border-neo-line/60 text-neo-ink hover:text-neo-sun text-xs font-heading font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors self-start sm:self-auto">
                          {uploadingPledgeId === pledge.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-neo-sun" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Camera className="w-3.5 h-3.5 text-neo-sun" />
                              <span>Replace Photo</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingPledgeId === pledge.id}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImpactPhotoUpload(pledge.id, file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="pt-2.5 border-t border-amber-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-body">
                        <div className="flex items-center gap-2 text-neo-ash">
                          <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Show the impact of this donation with a proof photo.</span>
                        </div>
                        <label className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-bold flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs transition-colors self-start sm:self-auto">
                          {uploadingPledgeId === pledge.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Impact Photo</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingPledgeId === pledge.id}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImpactPhotoUpload(pledge.id, file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Row: Scheduled Drop-off & Action */}
                <div className="pt-2 border-t border-neo-line/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-body">
                  <div className="flex items-center gap-3 text-neo-ash">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neo-sun" />
                      <span>
                        Scheduled Drop-Off:{" "}
                        <strong className="text-neo-ink font-heading">
                          {formatDate(pledge.scheduledDropOffDate || pledge.createdAt)}
                        </strong>
                      </span>
                    </span>
                    {pledge.fulfilledAt && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        • Verified at {formatDate(pledge.fulfilledAt || pledge.createdAt)}
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

      {/* Add / Edit Thank-You Note Modal */}
      {editingNotePledge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => {
            if (!savingNote) setEditingNotePledge(null);
          }}
        >
          <div
            className="relative max-w-lg w-full bg-neo-rice rounded-2xl overflow-hidden border border-neo-line shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-heading font-bold text-lg text-neo-ink">
                  {editingNotePledge.shelterThankYouNote ? "Edit Thank-You Note" : "Send Thank-You Note"}
                </h3>
              </div>
              <button
                type="button"
                disabled={savingNote}
                onClick={() => setEditingNotePledge(null)}
                className="w-7 h-7 rounded-lg bg-neo-cream/50 text-neo-ash hover:text-neo-ink flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-body text-neo-ash">
              Express your appreciation to{" "}
              <strong className="text-neo-ink font-heading">{editingNotePledge.donor?.name || "the donor"}</strong>{" "}
              for pledge <span className="font-mono font-semibold">#{editingNotePledge.pledgeCode}</span>. This message will appear on their dashboard.
            </p>

            {noteError && (
              <div className="p-3 rounded-xl bg-neo-coral/10 border border-neo-coral/30 text-xs font-body text-neo-coral">
                {noteError}
              </div>
            )}

            <div className="space-y-1.5">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                maxLength={1000}
                rows={4}
                placeholder="e.g. Thank you so much! Your generous delivery of hygiene kits and blankets helped 10 families today."
                className="w-full p-3 text-xs font-body bg-neo-cream/40 border border-neo-line rounded-xl text-neo-ink placeholder:text-neo-ash/60 focus:outline-none focus:border-neo-sun transition-all resize-none"
              />
              <div className="flex justify-between items-center text-[11px] text-neo-ash font-mono">
                <span>Maximum 1,000 characters</span>
                <span>{noteInput.length} / 1000</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={savingNote}
                onClick={() => setEditingNotePledge(null)}
                className="px-4 py-2 rounded-xl border border-neo-line text-xs font-heading font-semibold text-neo-ash hover:text-neo-ink transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingNote || !noteInput.trim()}
                onClick={handleSaveThankYouNote}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-heading font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                {savingNote ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Impact Photo Lightbox Preview Modal */}
      {selectedImpactPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setSelectedImpactPreview(null)}
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
                onClick={() => setSelectedImpactPreview(null)}
                className="w-7 h-7 rounded-lg bg-neo-cream/50 text-neo-ash hover:text-neo-ink flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black/5 rounded-xl mt-2 overflow-hidden">
              <img
                src={selectedImpactPreview}
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
