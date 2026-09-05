"use client";

import React from "react";
import Link from "next/link";
import { PublicUserData } from "./PublicProfileHeaderCard";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowUpRight,
  Mail,
  Phone,
  Globe,
  Sparkles,
} from "lucide-react";

interface PublicShelterFacilityCardProps {
  shelter: NonNullable<PublicUserData["shelter"]>;
}

export function PublicShelterFacilityCard({ shelter }: PublicShelterFacilityCardProps) {
  return (
    <div className="border border-neo-sun/30 rounded-2xl bg-gradient-to-br from-neo-sun/10 via-neo-rice to-neo-rice p-6 space-y-6 shadow-sm">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl border border-neo-sun/40 bg-neo-rice text-neo-sun flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {shelter.profileImageUrl ? (
              /* eslint-disable-next-next/no-img-element */
              <img
                src={shelter.profileImageUrl}
                alt={shelter.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-6 h-6 text-neo-sun" />
            )}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 text-[11px] font-heading font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-neo-sun" />
              Managed Shelter Facility
            </div>
            <h2 className="font-heading font-bold text-2xl text-neo-ink">
              {shelter.name}
            </h2>
          </div>
        </div>

        <Link
          href={`/s/${shelter.id}`}
          className="px-4 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20 cursor-pointer shrink-0"
        >
          <span>View Shelter Wishlist & Needs</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Description & Metadata */}
      {shelter.description && (
        <p className="text-xs font-body text-neo-ink leading-relaxed">
          {shelter.description}
        </p>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Verification Status & Location */}
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-body text-neo-ash font-medium">
              Verification Status
            </span>
            <span
              className={`px-2.5 py-0.5 text-[10px] font-heading font-semibold rounded-full border uppercase flex items-center gap-1 ${
                shelter.verificationStatus === "VERIFIED"
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-neo-sun/15 border-neo-sun/30 text-neo-sun"
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              {shelter.verificationStatus || "VERIFIED"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-body text-neo-ink pt-1">
            <MapPin className="w-4 h-4 text-neo-sun shrink-0" />
            <span>
              {shelter.city}, {shelter.state} {shelter.country ? `(${shelter.country})` : ""}
            </span>
          </div>
        </div>

        {/* Operating Drop-off Hours */}
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2 shadow-sm">
          <span className="text-xs font-body text-neo-ash font-medium block">
            Drop-Off Operating Hours
          </span>
          <div className="flex items-center gap-1.5 text-xs font-body text-neo-ink pt-1">
            <Clock className="w-4 h-4 text-neo-sun shrink-0" />
            <span className="font-heading font-semibold">
              {shelter.dropOffHours || "Mon - Sat: 9:00 AM - 5:00 PM"}
            </span>
          </div>
        </div>

        {/* Facility Contact Details */}
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2 shadow-sm">
          <span className="text-xs font-body text-neo-ash font-medium block">
            Facility Contact Information
          </span>
          <div className="space-y-1 pt-1 text-xs font-body text-neo-ink">
            {shelter.contactEmail && (
              <div className="flex items-center gap-1.5 text-neo-ash">
                <Mail className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                <span className="truncate">{shelter.contactEmail}</span>
              </div>
            )}
            {shelter.phone && (
              <div className="flex items-center gap-1.5 text-neo-ash">
                <Phone className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                <span>{shelter.phone}</span>
              </div>
            )}
            {shelter.website && (
              <div className="flex items-center gap-1.5 text-neo-ash">
                <Globe className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                <a
                  href={shelter.website.startsWith("http") ? shelter.website : `https://${shelter.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
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
  );
}
