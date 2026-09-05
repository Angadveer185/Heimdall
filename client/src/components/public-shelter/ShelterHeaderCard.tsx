"use client";

import React from "react";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Clock,
  Mail,
  Phone,
  Globe,
  Award,
  Sparkles,
} from "lucide-react";

export interface PublicShelterData {
  id: string;
  name: string;
  country?: string;
  organizationIdType?: string;
  organizationId?: string;
  verificationStatus: string;
  description?: string | null;
  street?: string;
  city: string;
  state: string;
  zip?: string;
  dropOffHours?: string;
  contactEmail?: string;
  phone?: string | null;
  website?: string | null;
  profileImageUrl?: string | null;
  createdAt?: string;
}

interface ShelterHeaderCardProps {
  shelter: PublicShelterData;
}

export function ShelterHeaderCard({ shelter }: ShelterHeaderCardProps) {
  const isVerified = shelter.verificationStatus === "VERIFIED";

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center overflow-hidden shrink-0 shadow-md">
            {shelter.profileImageUrl ? (
              /* eslint-disable-next-next/no-img-element */
              <img
                src={shelter.profileImageUrl}
                alt={shelter.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-8 h-8 text-neo-sun" />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink leading-tight">
                {shelter.name}
              </h1>

              <span
                className={`px-3 py-0.5 text-xs font-heading font-semibold rounded-full border uppercase tracking-wider flex items-center gap-1 ${
                  isVerified
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-neo-sun/15 border-neo-sun/30 text-neo-sun"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {shelter.verificationStatus || "VERIFIED"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-body text-neo-ash">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                <span>
                  {shelter.street ? `${shelter.street}, ` : ""}
                  {shelter.city}, {shelter.state} {shelter.zip ? shelter.zip : ""}
                </span>
              </span>

              {shelter.organizationId && (
                <span className="flex items-center gap-1.5 font-mono text-[11px] bg-neo-bg px-2 py-0.5 rounded border border-neo-line/60 text-neo-ink font-semibold">
                  <Award className="w-3 h-3 text-neo-gold" />
                  <span>
                    {shelter.organizationIdType || "ID"}: {shelter.organizationId}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Operating Status Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neo-bg border border-neo-line/60 shadow-sm shrink-0">
          <Clock className="w-5 h-5 text-neo-sun" />
          <div className="text-left">
            <span className="text-[10px] font-heading text-neo-ash uppercase block font-semibold">
              Drop-Off Hours
            </span>
            <span className="text-xs font-heading font-bold text-neo-ink">
              {shelter.dropOffHours || "Mon - Sat: 9:00 AM - 5:00 PM"}
            </span>
          </div>
        </div>
      </div>

      {/* Description / Mission */}
      {shelter.description && (
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 text-xs font-body text-neo-ink leading-relaxed shadow-sm">
          <div className="inline-flex items-center gap-1.5 text-neo-sun font-heading font-semibold text-[11px] uppercase mb-1">
            <Sparkles className="w-3 h-3" />
            Facility Overview & Mission
          </div>
          <p>{shelter.description}</p>
        </div>
      )}

      {/* Contact Details Bar */}
      <div className="pt-4 border-t border-neo-line/40 flex flex-wrap items-center gap-6 text-xs font-body">
        {shelter.contactEmail && (
          <div className="flex items-center gap-2 text-neo-ink font-medium">
            <Mail className="w-4 h-4 text-neo-sun shrink-0" />
            <span>{shelter.contactEmail}</span>
          </div>
        )}

        {shelter.phone && (
          <div className="flex items-center gap-2 text-neo-ink font-medium">
            <Phone className="w-4 h-4 text-neo-sun shrink-0" />
            <span>{shelter.phone}</span>
          </div>
        )}

        {shelter.website && (
          <div className="flex items-center gap-2 text-neo-ink font-medium">
            <Globe className="w-4 h-4 text-neo-sun shrink-0" />
            <a
              href={shelter.website.startsWith("http") ? shelter.website : `https://${shelter.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neo-sun hover:underline font-semibold font-heading"
            >
              {shelter.website}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
