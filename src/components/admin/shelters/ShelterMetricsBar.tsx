"use client";

import React from "react";
import { Building2, CheckCircle2, Clock, AlertOctagon } from "lucide-react";

export interface ShelterMetrics {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
}

interface ShelterMetricsBarProps {
  metrics: ShelterMetrics;
}

export function ShelterMetricsBar({ metrics }: ShelterMetricsBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Total Shelters */}
      <div className="p-4 rounded-xl bg-neo-rice border border-neo-sun flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
            Total Registered Shelters
          </span>
          <div className="font-heading font-bold text-2xl text-neo-ink">
            {metrics.total}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-neo-sun/10 text-neo-sun border border-neo-sun/30 shadow-sm">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      {/* Verified Shelters */}
      <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
            Verified Non-Profits
          </span>
          <div className="font-heading font-bold text-2xl text-emerald-600 dark:text-emerald-400">
            {metrics.verified}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Pending Verification */}
      <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
            Pending Queue
          </span>
          <div className="font-heading font-bold text-2xl text-amber-600 dark:text-amber-400">
            {metrics.pending}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Rejected / Issue Shelters */}
      <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
            Rejected Applications
          </span>
          <div className="font-heading font-bold text-2xl text-rose-600 dark:text-rose-400">
            {metrics.rejected}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-sm">
          <AlertOctagon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
