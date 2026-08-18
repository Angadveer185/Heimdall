"use client";

import React from "react";
import { UserData } from "@/store/useUserStore";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface AccountSecurityCardProps {
  user: UserData;
  onEditClick: () => void;
}

export function AccountSecurityCard({ user, onEditClick }: AccountSecurityCardProps) {
  return (
    <div className="border border-neo-line bg-neo-rice p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neo-line pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 border border-neo-line bg-neo-bg text-neo-sun shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-label tracking-widest text-neo-ash uppercase block">
              SECURITY & CREDENTIALS // PROTOCOL
            </span>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Account Security & Access
            </h2>
          </div>
        </div>
      </div>

      {/* Grid Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-label">
        {/* Auth Cookie Security */}
        <div className="p-4 bg-neo-bg border border-neo-line/60 space-y-2">
          <div className="flex items-center gap-2 text-neo-ink font-semibold border-b border-neo-line/40 pb-2">
            <Lock className="w-4 h-4 text-neo-sun" />
            <span>JWT Cookie Token Policy</span>
          </div>
          <div className="space-y-1 text-neo-ash font-body text-xs">
            <div className="flex items-center justify-between">
              <span>Token Transmission:</span>
              <span className="font-label text-emerald-600 dark:text-emerald-400 font-semibold">httpOnly, Secure</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SameSite Policy:</span>
              <span className="font-label text-neo-ink">Strict</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Client State Storage:</span>
              <span className="font-label text-emerald-600 dark:text-emerald-400 font-semibold">Disabled (Zero Token Leaks)</span>
            </div>
          </div>
        </div>

        {/* Role Authorization */}
        <div className="p-4 bg-neo-bg border border-neo-line/60 space-y-2">
          <div className="flex items-center gap-2 text-neo-ink font-semibold border-b border-neo-line/40 pb-2">
            <KeyRound className="w-4 h-4 text-neo-sun" />
            <span>Role Permissions Tier</span>
          </div>
          <div className="space-y-1 text-neo-ash font-body text-xs">
            <div className="flex items-center justify-between">
              <span>Active Scope:</span>
              <span className="font-label font-semibold text-neo-sun">{user.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Account Standing:</span>
              {user.isReported ? (
                <span className="font-label text-red-500 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Flagged
                </span>
              ) : (
                <span className="font-label text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active & Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Action Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neo-line">
        <p className="text-xs font-body text-neo-ash">
          Need to update your password or account credentials?
        </p>

        <button
          onClick={onEditClick}
          className="px-4 py-2 bg-neo-rice text-neo-ink font-label text-xs uppercase border border-neo-line hover:border-neo-sun hover:text-neo-sun transition-all flex items-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5 text-neo-sun" />
          <span>Change Password</span>
        </button>
      </div>
    </div>
  );
}
