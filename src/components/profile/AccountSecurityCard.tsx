"use client";

import React from "react";
import { UserData } from "@/store/useUserStore";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface AccountSecurityCardProps {
  user: UserData;
  onEditClick: () => void;
}

export function AccountSecurityCard({ user, onEditClick }: AccountSecurityCardProps) {
  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide mb-1">
              Security & Credentials
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Account Security & Access Policy
            </h2>
          </div>
        </div>
      </div>

      {/* Grid Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Auth Cookie Security */}
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 text-neo-ink font-heading font-semibold text-xs border-b border-neo-line/40 pb-2 uppercase">
            <Lock className="w-4 h-4 text-neo-sun" />
            <span>Session & Cookie Policy</span>
          </div>
          <div className="space-y-1.5 text-neo-ash font-body text-xs">
            <div className="flex items-center justify-between">
              <span>Token Transmission:</span>
              <span className="font-heading text-emerald-600 dark:text-emerald-400 font-semibold">httpOnly, Secure</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SameSite Policy:</span>
              <span className="font-heading text-neo-ink font-semibold">Strict</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Client State Storage:</span>
              <span className="font-heading text-emerald-600 dark:text-emerald-400 font-semibold">Disabled (Zero Token Leaks)</span>
            </div>
          </div>
        </div>

        {/* Role Authorization */}
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2 text-neo-ink font-heading font-semibold text-xs border-b border-neo-line/40 pb-2 uppercase">
            <KeyRound className="w-4 h-4 text-neo-sun" />
            <span>Role & Permissions Tier</span>
          </div>
          <div className="space-y-1.5 text-neo-ash font-body text-xs">
            <div className="flex items-center justify-between">
              <span>Active Scope:</span>
              <span className="font-heading font-semibold text-neo-sun">{user.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Account Standing:</span>
              {user.isReported ? (
                <span className="font-heading text-neo-sun font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Flagged
                </span>
              ) : (
                <span className="font-heading text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active & Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Action Footer */}
      <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-neo-line/40">
        <p className="text-xs font-body text-neo-ash">
          Need to update your password or account credentials?
        </p>

        <button
          onClick={onEditClick}
          className="px-4.5 py-2.5 rounded-xl bg-neo-rice text-neo-ink font-heading font-semibold text-xs border border-neo-line/60 hover:border-neo-sun hover:text-neo-sun transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-neo-sun" />
          <span>Change Password</span>
        </button>
      </div>
    </div>
  );
}
