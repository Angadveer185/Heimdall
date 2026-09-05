"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  PackageCheck,
  Building2,
  Calendar,
  MapPin,
  Clock,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

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

export interface DonorPledgeData {
  id: string;
  pledgeCode: string;
  status: string;
  scheduledDropOffDate: string;
  shelter?: {
    id: string;
    name: string;
    city: string;
    state: string;
    street?: string;
    dropOffHours?: string;
  };
  items?: PledgedItemDetail[];
}

interface DonorPledgeCodeModalProps {
  pledge: DonorPledgeData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DonorPledgeCodeModal({
  pledge,
  isOpen,
  onClose,
}: DonorPledgeCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !pledge) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pledge.pledgeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code to clipboard", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neo-night/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-neo-rice border border-neo-line/80 shadow-2xl p-6 md:p-8 space-y-6 text-neo-ink animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl border border-neo-line/60 bg-neo-bg hover:bg-neo-line/20 text-neo-ash hover:text-neo-ink transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-neo-sun/15 border border-neo-sun/30 flex items-center justify-center text-neo-sun shrink-0 shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neo-sun/10 text-neo-sun text-[10px] font-heading font-semibold uppercase tracking-wider mb-0.5">
              <ShieldCheck className="w-3 h-3" />
              Drop-Off Pass
            </div>
            <h3 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Your Pledge Drop-Off Code
            </h3>
          </div>
        </div>

        {/* Prominent Pledge Code Display Box */}
        <div className="p-5 rounded-2xl bg-neo-bg border-2 border-dashed border-neo-sun/40 text-center space-y-3 shadow-inner">
          <span className="text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash block">
            Pledge Verification Code
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono font-black text-2xl md:text-3xl text-neo-sun tracking-wider select-all bg-neo-rice/80 px-4 py-2 rounded-xl border border-neo-sun/30">
              {pledge.pledgeCode}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-1.5 font-heading text-xs font-semibold shadow-sm cursor-pointer ${
                copied
                  ? "bg-emerald-500 text-white border-emerald-600"
                  : "bg-neo-sun text-neo-rice border-neo-sun hover:bg-neo-sun/90"
              }`}
              title="Copy Pledge Code"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs font-body text-neo-ash">
            Show or give this code to the shelter admin at drop-off to verify your donation.
          </p>
        </div>

        {/* Shelter & Drop-off Details */}
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2.5 text-xs font-body">
          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-neo-sun shrink-0 mt-0.5" />
            <div>
              <span className="font-heading font-semibold text-neo-ink block">
                {pledge.shelter?.name || "Community Shelter"}
              </span>
              <span className="text-neo-ash flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                {pledge.shelter?.street ? `${pledge.shelter.street}, ` : ""}
                {pledge.shelter?.city}, {pledge.shelter?.state}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-neo-ash pt-1 border-t border-neo-line/40">
            <Calendar className="w-4 h-4 text-neo-sun shrink-0" />
            <span>
              Scheduled Drop-Off:{" "}
              <strong className="text-neo-ink font-heading">
                {formatDate(pledge.scheduledDropOffDate)}
              </strong>
            </span>
          </div>

          {pledge.shelter?.dropOffHours && (
            <div className="flex items-center gap-2.5 text-neo-ash">
              <Clock className="w-4 h-4 text-neo-sun shrink-0" />
              <span>
                Hours:{" "}
                <strong className="text-neo-ink font-heading">
                  {pledge.shelter.dropOffHours}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Items Pledged */}
        {pledge.items && pledge.items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash">
              <PackageCheck className="w-3.5 h-3.5 text-neo-sun" />
              <span>Items Included in this Pledge</span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {pledge.items.map((item) => (
                <span
                  key={item.id}
                  className="px-3 py-1.5 rounded-lg bg-neo-bg border border-neo-line/60 text-xs font-body text-neo-ink flex items-center gap-1.5"
                >
                  <span className="font-heading font-bold text-neo-sun">
                    {item.quantityPledged}x
                  </span>
                  <span>{item.requestedItem?.globalItem?.title || "Item"}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-neo-line/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-neo-bg text-neo-ink font-heading font-semibold text-xs border border-neo-line/60 hover:bg-neo-line/20 transition-all text-center shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
