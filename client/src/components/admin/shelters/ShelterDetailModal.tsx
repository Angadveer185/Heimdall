"use client";

import React from "react";
import {
  X,
  Building2,
  CheckCircle2,
  Clock,
  AlertOctagon,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  ShieldCheck,
  Compass,
} from "lucide-react";

export interface FullShelterData {
  id: string;
  name: string;
  country: string;
  organizationIdType: string;
  organizationId: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  rejectionReason?: string | null;
  description?: string | null;
  street: string;
  city: string;
  state: string;
  zip: string;
  longitude: number;
  latitude: number;
  dropOffHours: string;
  contactEmail: string;
  phone?: string | null;
  website?: string | null;
  profileImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ShelterDetailModalProps {
  isOpen: boolean;
  shelter: FullShelterData | null;
  onClose: () => void;
  onEdit: (shelter: FullShelterData) => void;
}

export function ShelterDetailModal({
  isOpen,
  shelter,
  onClose,
  onEdit,
}: ShelterDetailModalProps) {
  if (!isOpen || !shelter) return null;

  const renderStatusBadge = () => {
    switch (shelter.verificationStatus) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Non-Profit
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold">
            <AlertOctagon className="w-3.5 h-3.5" />
            Registration Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neo-rice border border-neo-line/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl my-8 text-neo-ink">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neo-line/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl border border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center shrink-0 shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {renderStatusBadge()}
                <span className="px-2.5 py-0.5 rounded-full bg-neo-gold/15 text-neo-gold border border-neo-gold/30 text-[10px] font-heading font-semibold uppercase tracking-wider">
                  {shelter.organizationIdType}: {shelter.organizationId}
                </span>
              </div>
              <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink pt-0.5">
                {shelter.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-ash hover:text-neo-sun hover:border-neo-sun transition-all cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-5 text-xs font-body">
          {/* Description */}
          {shelter.description && (
            <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-1">
              <span className="font-heading font-semibold text-neo-ash uppercase text-[10px] tracking-wider block">
                Mission / Overview
              </span>
              <p className="text-neo-ink leading-relaxed">{shelter.description}</p>
            </div>
          )}

          {/* Rejection Reason Notice if Rejected */}
          {shelter.verificationStatus === "REJECTED" && shelter.rejectionReason && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 space-y-1">
              <span className="font-heading font-bold uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" />
                Rejection Reason
              </span>
              <p className="text-neo-ink leading-relaxed">{shelter.rejectionReason}</p>
            </div>
          )}

          {/* Grid Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address Details */}
            <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2">
              <div className="flex items-center gap-2 font-heading font-bold text-neo-sun text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Physical Address</span>
              </div>
              <div className="text-neo-ink space-y-0.5 leading-relaxed">
                <div>{shelter.street}</div>
                <div>
                  {shelter.city}, {shelter.state} {shelter.zip}
                </div>
                <div className="font-semibold text-neo-ash">{shelter.country}</div>
              </div>
            </div>

            {/* Coordinates & Hours */}
            <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2">
              <div className="flex items-center gap-2 font-heading font-bold text-neo-sun text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Location & Operations</span>
              </div>
              <div className="space-y-1 text-neo-ink">
                <div>
                  <span className="text-neo-ash">Coordinates:</span>{" "}
                  <code className="font-label text-[11px] bg-neo-rice px-1.5 py-0.5 rounded border border-neo-line/60">
                    {shelter.latitude.toFixed(4)}, {shelter.longitude.toFixed(4)}
                  </code>
                </div>
                <div>
                  <span className="text-neo-ash">Drop-off Hours:</span>{" "}
                  <span className="font-semibold">{shelter.dropOffHours}</span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2">
              <div className="flex items-center gap-2 font-heading font-bold text-neo-sun text-xs uppercase tracking-wider">
                <Mail className="w-4 h-4" />
                <span>Contact Channels</span>
              </div>
              <div className="space-y-1.5 text-neo-ink">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-neo-ash shrink-0" />
                  <a
                    href={`mailto:${shelter.contactEmail}`}
                    className="hover:text-neo-sun transition-colors underline truncate"
                  >
                    {shelter.contactEmail}
                  </a>
                </div>
                {shelter.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neo-ash shrink-0" />
                    <span>{shelter.phone}</span>
                  </div>
                )}
                {shelter.website && (
                  <div className="flex items-center gap-2 truncate">
                    <Globe className="w-3.5 h-3.5 text-neo-ash shrink-0" />
                    <a
                      href={shelter.website.startsWith("http") ? shelter.website : `https://${shelter.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-neo-sun transition-colors underline truncate"
                    >
                      {shelter.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps & Identifiers */}
            <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2">
              <div className="flex items-center gap-2 font-heading font-bold text-neo-sun text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>System Roster Data</span>
              </div>
              <div className="space-y-1 text-neo-ink">
                <div>
                  <span className="text-neo-ash">System ID:</span>{" "}
                  <code className="font-label text-[11px] bg-neo-rice px-1.5 py-0.5 rounded border border-neo-line/60">
                    {shelter.id}
                  </code>
                </div>
                <div className="flex items-center gap-1.5 text-neo-ash text-[11px] pt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Registered: {new Date(shelter.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-neo-line/40 pt-4">
          <button
            onClick={() => {
              onClose();
              onEdit(shelter);
            }}
            className="px-4 py-2 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-md shadow-neo-sun/20 cursor-pointer"
          >
            Edit Shelter Record
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neo-bg text-neo-ink font-body text-xs rounded-xl border border-neo-line/60 hover:border-neo-sun transition-all cursor-pointer shadow-sm"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
