"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserData, useUserStore } from "@/store/useUserStore";
import {
  AlertTriangle,
  Trash2,
  X,
  Loader2,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

interface ProfileDangerZoneProps {
  user: UserData;
}

export function ProfileDangerZone({ user }: ProfileDangerZoneProps) {
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmed =
    confirmationInput.trim().toLowerCase() === user.email.trim().toLowerCase() ||
    confirmationInput.trim() === "DELETE";

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/users/me", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to delete user account.");
        setDeleting(false);
        return;
      }

      // Clear user session from client Zustand store
      clearUser();
      setIsModalOpen(false);

      // Force reload / redirect to home page
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("An unexpected network error occurred while deleting your account.");
      setDeleting(false);
    }
  };

  return (
    <div className="border border-red-500/40 rounded-2xl bg-gradient-to-br from-red-500/10 via-neo-rice to-neo-rice p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
        <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-600 dark:text-red-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-red-600 dark:text-red-400">
            Account Danger Zone
          </h3>
          <p className="text-xs font-body text-neo-ash">
            Permanent, irreversible actions concerning your Heimdall user profile.
          </p>
        </div>
      </div>

      {/* Delete Account Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neo-bg border border-red-500/30 text-xs font-body text-neo-ink">
        <div className="space-y-1 max-w-xl">
          <h4 className="font-heading font-bold text-sm text-neo-ink">
            Permanently Delete Account: <span className="text-red-600 dark:text-red-400">{user.email}</span>
          </h4>
          <p className="text-neo-ash leading-relaxed">
            Permanently deletes your user profile, active and historical donation pledges, and any managed shelter facility associations from the Heimdall database.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfirmationInput("");
            setError(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-heading font-bold text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-md shadow-red-600/20 cursor-pointer shrink-0"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neo-night/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !deleting && setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-neo-rice border border-red-500/60 shadow-2xl p-6 md:p-8 space-y-5 text-neo-ink animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
                  Delete Account Confirmation
                </h4>
                <p className="text-[11px] font-body text-neo-ash">
                  This action is irreversible
                </p>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-body">
                {error}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-body text-red-700 dark:text-red-300 space-y-1">
              <p className="font-heading font-semibold">Are you completely certain?</p>
              <p className="leading-relaxed">
                Deleting your account will remove your profile, donor statistics, active pledges, and any shelter facility you manage.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash">
                  Type <strong className="text-neo-ink select-all">{user.email}</strong> or <strong className="text-neo-ink">DELETE</strong> to confirm:
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
                  onClick={() => setIsModalOpen(false)}
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
                      <span>Deleting Account...</span>
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
