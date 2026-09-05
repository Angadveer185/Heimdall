"use client";

import React from "react";
import { PublicUserData } from "./PublicProfileHeaderCard";
import {
  CheckCircle2,
  PackageCheck,
  TrendingUp,
  Heart,
} from "lucide-react";

interface PublicProfileStatsCardProps {
  user: PublicUserData;
}

export function PublicProfileStatsCard({ user }: PublicProfileStatsCardProps) {
  const completed = user.pledgesCompleted || 0;
  const expired = user.pledgesExpired || 0;
  const total = completed + expired;
  const fulfillmentRate = total > 0 ? Math.round((completed / total) * 100) : 100;

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-6 space-y-5 shadow-sm">
      <div className="flex items-center gap-3 border-b border-neo-line/40 pb-4">
        <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
          <Heart className="w-5 h-5 fill-neo-sun/20 text-neo-sun" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neo-sun/10 text-neo-sun text-[11px] font-heading font-semibold uppercase tracking-wider mb-0.5">
            Contribution History
          </div>
          <h2 className="font-heading font-bold text-xl text-neo-ink">
            Public Impact Metrics
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-body text-neo-ash font-medium">
            <span>Verified Drop-offs</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-heading font-bold text-2xl text-neo-ink">
            {completed}
          </div>
          <p className="text-xs font-body text-neo-ash">Completed pledges</p>
        </div>

        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-body text-neo-ash font-medium">
            <span>Pledge Records</span>
            <PackageCheck className="w-4 h-4 text-neo-sun" />
          </div>
          <div className="font-heading font-bold text-2xl text-neo-ink">
            {total}
          </div>
          <p className="text-xs font-body text-neo-ash font-mono">Total initiated</p>
        </div>

        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-body text-neo-ash font-medium">
            <span>Fulfillment Score</span>
            <TrendingUp className="w-4 h-4 text-neo-sun" />
          </div>
          <div className="font-heading font-bold text-2xl text-neo-sun">
            {fulfillmentRate}%
          </div>
          <p className="text-xs font-body text-neo-ash">Pledge completion rate</p>
        </div>
      </div>
    </div>
  );
}
