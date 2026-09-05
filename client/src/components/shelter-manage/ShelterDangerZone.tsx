"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import {
  AlertTriangle,
  Trash2,
  X,
  Loader2,
  ShieldAlert,
  ArrowRight,
  ArrowRightLeft,
  Mail,
  UserCheck,
} from "lucide-react";

interface ShelterDangerZoneProps {
  shelter: {
    id: string;
    name: string;
  };
}

export function ShelterDangerZone({ shelter }: ShelterDangerZoneProps) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // Deletion state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Transfer ownership state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  const isConfirmed =
    confirmationInput.trim().toLowerCase() === shelter.name.trim().toLowerCase() ||
    confirmationInput.trim() === "DELETE";

  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;

    setTransferring(true);
    setTransferError(null);

    try {
      const res = await fetch(`/api/shelters/${shelter.id}/transfer-ownership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserEmail: targetEmail.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setTransferError(data.message || "Failed to transfer facility ownership.");
        setTransferring(false);
        return;
      }

      // Revert user in local Zustand store to DONOR
      if (user) {
        setUser({
          ...user,
          role: "DONOR",
          shelterId: null,
          shelter: null,
        });
      }

      try {
        const meRes = await fetch("/api/users/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.success && meData.data) {
            setUser(meData.data);
          }
        }
      } catch (syncErr) {
        console.warn("Could not sync /api/users/me after ownership transfer:", syncErr);
      }

      setIsTransferModalOpen(false);
      alert(`Ownership of "${shelter.name}" has been transferred to ${targetEmail.trim()}. Your account has reverted to Community Donor.`);
      router.push("/profile");
    } catch (err) {
      console.error("Error transferring shelter ownership:", err);
      setTransferError("An unexpected network error occurred while transferring ownership.");
      setTransferring(false);
    }
  };

  const handleDeleteShelter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/shelters/${shelter.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setDeleteError(data.message || "Failed to delete shelter facility.");
        setDeleting(false);
        return;
      }

      // 1. Revert user in local Zustand store to DONOR and clear shelter
      if (user) {
        setUser({
          ...user,
          role: "DONOR",
          shelterId: null,
          shelter: null,
        });
      }

      // 2. Fetch /api/users/me to sync fresh session state
      try {
        const meRes = await fetch("/api/users/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.success && meData.data) {
            setUser(meData.data);
          }
        }
      } catch (syncErr) {
        console.warn("Could not sync /api/users/me after deletion:", syncErr);
      }

      // 3. Redirect to /profile
      setIsDeleteModalOpen(false);
      router.push("/profile");
    } catch (err) {
      console.error("Error deleting shelter:", err);
      setDeleteError("An unexpected network error occurred while deleting the shelter.");
      setDeleting(false);
    }
  };

  return (
    <div className="border border-red-500/40 rounded-2xl bg-gradient-to-br from-red-500/10 via-neo-rice to-neo-rice p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-600 dark:text-red-400 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-xl text-red-600 dark:text-red-400">
            Danger Zone
          </h3>
          <p className="text-xs font-body text-neo-ash">
            Permanent, administrative actions concerning your non-profit shelter facility.
          </p>
        </div>
      </div>

      {/* Action 1: Transfer Ownership */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neo-bg border border-neo-line/70 text-xs font-body text-neo-ink">
        <div className="space-y-1 max-w-xl">
          <h4 className="font-heading font-bold text-sm text-neo-ink flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-neo-sun" />
            <span>Transfer Facility Ownership</span>
          </h4>
          <p className="text-neo-ash leading-relaxed">
            Reassign administrative ownership of <strong>{shelter.name}</strong> to another registered user using their email address. Upon transfer, your account will immediately revert to <strong>DONOR</strong> and you will lose access to this console.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTargetEmail("");
            setTransferError(null);
            setIsTransferModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20 cursor-pointer shrink-0"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Transfer Ownership</span>
        </button>
      </div>

      {/* Action 2: Delete Shelter Facility */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neo-bg border border-red-500/30 text-xs font-body text-neo-ink">
        <div className="space-y-1 max-w-xl">
          <h4 className="font-heading font-bold text-sm text-neo-ink">
            Delete Shelter Facility: <span className="text-red-600 dark:text-red-400">{shelter.name}</span>
          </h4>
          <p className="text-neo-ash leading-relaxed">
            Permanently deletes this shelter from the database, removes all active wishlist campaigns, cancels ongoing drop-off reservations, and removes the facility from community discovery. <strong>Your account role will be automatically reverted to DONOR.</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfirmationInput("");
            setDeleteError(null);
            setIsDeleteModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-red-600 text-white font-heading font-bold text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-red-600/20 cursor-pointer shrink-0"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Shelter Facility</span>
        </button>
      </div>

      {/* Transfer Ownership Modal */}
      {isTransferModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neo-night/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !transferring && setIsTransferModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-neo-rice border border-neo-sun/60 shadow-2xl p-6 md:p-8 space-y-5 text-neo-ink animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsTransferModalOpen(false)}
              disabled={transferring}
              className="absolute top-4 right-4 p-2 rounded-xl border border-neo-line/60 bg-neo-bg hover:bg-neo-line/20 text-neo-ash hover:text-neo-ink transition-all cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-neo-sun/15 border border-neo-sun/30 flex items-center justify-center text-neo-sun shrink-0">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg text-neo-ink">
                  Transfer Facility Ownership
                </h4>
                <p className="text-[11px] font-body text-neo-ash">
                  Reassign primary control of this shelter
                </p>
              </div>
            </div>

            {/* Error banner */}
            {transferError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-body">
                {transferError}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-neo-sun/10 border border-neo-sun/25 text-xs font-body text-neo-ink space-y-1">
              <p className="font-heading font-semibold text-neo-sun">Transfer Confirmation Notice</p>
              <p className="leading-relaxed">
                You are about to transfer <strong>{shelter.name}</strong>. The target user must be registered in Heimdall. Once completed, you will lose admin access to this shelter and revert to a <strong>Community Donor</strong>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleTransferOwnership} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash">
                  Target User's Registered Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neo-ash absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="user@example.com"
                    autoFocus
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-xs font-body text-neo-ink outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-neo-line/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  disabled={transferring}
                  className="px-4 py-2.5 rounded-xl bg-neo-bg text-neo-ink font-heading font-semibold text-xs border border-neo-line/60 hover:bg-neo-line/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!targetEmail.trim() || transferring}
                  className="px-5 py-2.5 rounded-xl bg-neo-sun hover:bg-neo-sun/90 text-neo-rice font-heading font-bold text-xs transition-all flex items-center gap-2 shadow-md shadow-neo-sun/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {transferring ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transferring...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Transfer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Shelter Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neo-night/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !deleting && setIsDeleteModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-neo-rice border border-red-500/60 shadow-2xl p-6 md:p-8 space-y-5 text-neo-ink animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className="absolute top-4 right-4 p-2 rounded-xl border border-neo-line/60 bg-neo-bg hover:bg-neo-line/20 text-neo-ash hover:text-neo-ink transition-all cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-lg text-neo-ink">
                  Confirm Shelter Deletion
                </h4>
                <p className="text-[11px] font-body text-neo-ash">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Error banner */}
            {deleteError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-body">
                {deleteError}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-body text-red-700 dark:text-red-300 space-y-1">
              <p className="font-heading font-semibold">Are you absolutely sure?</p>
              <p>
                Deleting <strong>{shelter.name}</strong> will remove all wishlist items and active pledges. You will be redirected to your profile as a <strong>DONOR</strong>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleDeleteShelter} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash">
                  Type <strong className="text-neo-ink select-all">{shelter.name}</strong> or <strong className="text-neo-ink">DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  required
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder="Enter confirmation..."
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-xs font-body text-neo-ink outline-none"
                />
              </div>

              <div className="pt-2 border-t border-neo-line/40 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={deleting}
                  className="px-4 py-2.5 rounded-xl bg-neo-bg text-neo-ink font-heading font-semibold text-xs border border-neo-line/60 hover:bg-neo-line/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isConfirmed || deleting}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-xs transition-all flex items-center gap-2 shadow-md shadow-red-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting Shelter...</span>
                    </>
                  ) : (
                    <>
                      <span>Permanently Delete</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
