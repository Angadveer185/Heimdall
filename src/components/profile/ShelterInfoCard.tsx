"use client";

import React from "react";
import Link from "next/link";
import { ShelterData } from "@/store/useUserStore";
import {
  Building2,
  MapPin,
  Clock,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  Clock3,
  XCircle,
  ArrowUpRight,
  PlusCircle,
  AlertCircle,
} from "lucide-react";

interface ShelterInfoCardProps {
  shelter?: ShelterData | null;
}

export function ShelterInfoCard({ shelter }: ShelterInfoCardProps) {
  if (!shelter) {
    return (
      <div className="border border-neo-line bg-neo-rice p-5 md:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-neo-line pb-3">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-neo-sun" />
            <h2 className="font-heading font-bold text-lg md:text-xl text-neo-ink">
              Your Managed Shelter Facility
            </h2>
          </div>
          <span className="text-[10px] font-label tracking-widest text-neo-ash uppercase">
            STATUS // UNLINKED
          </span>
        </div>

        <div className="p-6 bg-neo-bg border border-dashed border-neo-line text-center space-y-3">
          <Building2 className="w-10 h-10 text-neo-ash mx-auto opacity-50" />
          <h3 className="font-heading font-semibold text-base text-neo-ink">
            No Active Shelter Facility Linked
          </h3>
          <p className="text-xs font-body text-neo-ash max-w-md mx-auto">
            You are registered as a Shelter Admin, but your account is not connected to a facility. Complete organization verification to start managing wishlist requests.
          </p>
          <div className="pt-2">
            <Link
              href="/register?type=shelter"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Shelter Facility</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: ShelterData["verificationStatus"]) => {
    switch (status) {
      case "VERIFIED":
        return {
          label: "501(c)(3) VERIFIED",
          icon: CheckCircle2,
          bg: "bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40",
        };
      case "REJECTED":
        return {
          label: "VERIFICATION REJECTED",
          icon: XCircle,
          bg: "bg-red-900/20 text-red-500 border-red-500/40",
        };
      case "PENDING":
      default:
        return {
          label: "VERIFICATION PENDING",
          icon: Clock3,
          bg: "bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-500/40",
        };
    }
  };

  const statusBadge = getStatusBadge(shelter.verificationStatus);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="border border-neo-line bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-line pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 border border-neo-line bg-neo-bg text-neo-sun shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-label tracking-widest text-neo-ash uppercase block">
              MANAGED SHELTER FACILITY
            </span>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              {shelter.name}
            </h2>
          </div>
        </div>

        {/* Verification Status Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-label font-semibold border flex items-center gap-1.5 ${statusBadge.bg}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusBadge.label}</span>
          </span>
        </div>
      </div>

      {/* Rejection Alert Callout if Rejected */}
      {shelter.verificationStatus === "REJECTED" && (
        <div className="p-4 bg-red-900/10 border border-red-500/40 space-y-1.5">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-label text-xs uppercase font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Verification Rejection Notice</span>
          </div>
          <p className="text-xs font-body text-neo-ink pl-6">
            {shelter.rejectionReason ||
              "Your organization verification could not be validated against official registries. Please review your Tax EIN or registration document."}
          </p>
        </div>
      )}

      {/* Grid Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: ID & Location */}
        <div className="space-y-4">
          <div className="p-3.5 bg-neo-bg border border-neo-line/60 space-y-2">
            <span className="text-[11px] font-label text-neo-ash uppercase block">
              Tax Registration & Identifier
            </span>
            <div className="flex items-center justify-between text-xs font-label text-neo-ink">
              <span className="text-neo-ash">{shelter.organizationIdType}:</span>
              <span className="font-semibold tracking-wider">{shelter.organizationId}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-label text-neo-ink">
              <span className="text-neo-ash">Country Jurisdiction:</span>
              <span className="font-semibold">{shelter.country}</span>
            </div>
          </div>

          <div className="p-3.5 bg-neo-bg border border-neo-line/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-label text-neo-ink font-semibold uppercase border-b border-neo-line/40 pb-2">
              <MapPin className="w-4 h-4 text-neo-sun" />
              <span>Drop-Off & Facility Address</span>
            </div>
            <p className="text-xs font-body text-neo-ink leading-relaxed">
              {shelter.street}<br />
              {shelter.city}, {shelter.state} {shelter.zip}
            </p>
          </div>
        </div>

        {/* Right Column: Contact & Operations */}
        <div className="space-y-4">
          <div className="p-3.5 bg-neo-bg border border-neo-line/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-label text-neo-ink font-semibold uppercase border-b border-neo-line/40 pb-2">
              <Clock className="w-4 h-4 text-neo-sun" />
              <span>Drop-Off Hours</span>
            </div>
            <p className="text-xs font-body text-neo-ink">
              {shelter.dropOffHours}
            </p>
          </div>

          <div className="p-3.5 bg-neo-bg border border-neo-line/60 space-y-2">
            <span className="text-[11px] font-label text-neo-ash uppercase block mb-1">
              Contact & Web Links
            </span>
            <div className="space-y-1.5 text-xs font-label text-neo-ink">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                <span className="truncate">{shelter.contactEmail}</span>
              </div>
              {shelter.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                  <span>{shelter.phone}</span>
                </div>
              )}
              {shelter.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                  <a
                    href={shelter.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-neo-sun hover:underline truncate"
                  >
                    {shelter.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-neo-line flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-label text-neo-ash">
          Facility ID: <span className="text-neo-ink">{shelter.id}</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shelter/dashboard"
            className="px-4 py-2 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Shelter Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
