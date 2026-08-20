"use client";

import React from "react";
import Link from "next/link";
import { UserData } from "@/store/useUserStore";
import {
  Heart,
  QrCode,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  PackageCheck,
} from "lucide-react";

interface DonorActivityCardProps {
  user: UserData;
}

export function DonorActivityCard({ user }: DonorActivityCardProps) {
  const completed = user.pledgesCompleted || 0;
  const expired = user.pledgesExpired || 0;
  const totalPledges = completed + expired;

  const fulfillmentRate =
    totalPledges > 0 ? Math.round((completed / totalPledges) * 100) : 100;

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
            <Heart className="w-6 h-6 fill-neo-sun/20 text-neo-sun" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide mb-1">
              Donor Impact & Metrics
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Community Impact & Activity
            </h2>
          </div>
        </div>

        <span className="hidden sm:inline-block px-3 py-1 text-xs font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30">
          3-Stage Transparency
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Completed */}
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-body text-neo-ash font-medium">
            <span>Completed Pledges</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-heading font-bold text-2xl md:text-3xl text-neo-ink">
            {completed}
          </div>
          <p className="text-xs font-body text-neo-ash">
            Delivered via QR code scan
          </p>
        </div>

        {/* Metric 2: Expired */}
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-body text-neo-ash font-medium">
            <span>Expired Reservations</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-heading font-bold text-2xl md:text-3xl text-neo-ink">
            {expired}
          </div>
          <p className="text-xs font-body text-neo-ash">
            Unfulfilled drop-offs
          </p>
        </div>

        {/* Metric 3: Fulfillment Rate */}
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-body text-neo-ash font-medium">
            <span>Reliability Score</span>
            <TrendingUp className="w-4 h-4 text-neo-sun" />
          </div>
          <div className="font-heading font-bold text-2xl md:text-3xl text-neo-sun">
            {fulfillmentRate}%
          </div>
          <p className="text-xs font-body text-neo-ash">
            Pledge-to-delivery success
          </p>
        </div>
      </div>

      {/* Protocol Banner */}
      <div className="p-4 rounded-xl bg-neo-night text-[#faf6ec] border border-neo-line/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neo-sun/20 border border-neo-sun/40 text-neo-sun shrink-0">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-heading font-semibold text-sm text-[#faf6ec]">
              QR Code Drop-Off Passes
            </h4>
            <p className="text-xs font-body text-[#faf6ec]/75">
              Present your digital pass at the shelter facility for real-time inventory validation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Link
            href="/donor/pledges"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-neo-rice text-neo-ink font-heading font-semibold text-xs border border-neo-line/60 hover:border-neo-sun hover:text-neo-sun transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <PackageCheck className="w-3.5 h-3.5 text-neo-sun" />
            <span>My Active Passes</span>
          </Link>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-neo-line/40">
        <p className="text-xs font-body text-neo-ash">
          Need to donate goods? Support verified local shelter wishlists directly.
        </p>

        <Link
          href="/#hero-wishlists"
          className="px-5 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-1.5 shadow-md shadow-neo-sun/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>Browse Active Wishlists</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
