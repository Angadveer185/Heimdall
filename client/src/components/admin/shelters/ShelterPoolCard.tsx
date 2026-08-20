"use client";

import React, { useState } from "react";
import { FullShelterData } from "./ShelterDetailModal";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertOctagon,
  MapPin,
  Mail,
  Phone,
  Eye,
  Edit3,
  Trash2,
  Filter,
} from "lucide-react";

interface ShelterPoolCardProps {
  shelters: FullShelterData[];
  onAddShelter: () => void;
  onViewShelter: (shelter: FullShelterData) => void;
  onEditShelter: (shelter: FullShelterData) => void;
  onDeleteShelter: (shelter: FullShelterData) => void;
}

export function ShelterPoolCard({
  shelters,
  onAddShelter,
  onViewShelter,
  onEditShelter,
  onDeleteShelter,
}: ShelterPoolCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VERIFIED" | "PENDING" | "REJECTED">("ALL");

  const filteredShelters = shelters.filter((s) => {
    // Status Filter
    if (statusFilter !== "ALL" && s.verificationStatus !== statusFilter) {
      return false;
    }

    // Search Query Filter
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    return (
      s.name.toLowerCase().includes(q) ||
      s.organizationId.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      s.contactEmail.toLowerCase().includes(q) ||
      s.organizationIdType.toLowerCase().includes(q)
    );
  });

  const renderVerificationBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[11px] font-semibold shrink-0">
            <AlertOctagon className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[11px] font-semibold shrink-0">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide mb-1">
              Shelter Registry Pool
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              All Shelters Pool ({shelters.length})
            </h2>
          </div>
        </div>

        {/* Action Controls: Status Tabs, Search Bar, Add Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center bg-neo-bg p-1 rounded-xl border border-neo-line/60 gap-1 overflow-x-auto text-[11px] font-heading font-semibold">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-neo-sun text-neo-rice shadow-xs"
                  : "text-neo-ash hover:text-neo-ink"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("VERIFIED")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === "VERIFIED"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-neo-ash hover:text-neo-ink"
              }`}
            >
              Verified
            </button>
            <button
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === "PENDING"
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-neo-ash hover:text-neo-ink"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("REJECTED")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === "REJECTED"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "text-neo-ash hover:text-neo-ink"
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shelters..."
              className="w-full sm:w-48 bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink pl-10 pr-3 py-2 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
            />
          </div>

          {/* Add Shelter Button */}
          <button
            onClick={onAddShelter}
            className="px-4 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Shelter</span>
          </button>
        </div>
      </div>

      {/* Shelter Cards Grid */}
      {filteredShelters.length === 0 ? (
        <div className="p-10 rounded-xl text-center bg-neo-bg border border-dashed border-neo-line/60 space-y-3">
          <Building2 className="w-10 h-10 text-neo-ash mx-auto opacity-50" />
          <p className="font-heading font-semibold text-sm text-neo-ink">
            {searchQuery || statusFilter !== "ALL"
              ? "No shelters match the selected filter criteria"
              : "No Shelters Registered Yet"}
          </p>
          <p className="text-xs font-body text-neo-ash max-w-md mx-auto">
            {searchQuery || statusFilter !== "ALL"
              ? "Try adjusting your search query or status filter."
              : "Registered shelters receive community donations, publish supply requests, and issue drop-off QR vouchers."}
          </p>
          {!searchQuery && statusFilter === "ALL" && (
            <button
              onClick={onAddShelter}
              className="mt-2 px-4 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all inline-flex items-center gap-2 shadow-md shadow-neo-sun/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register First Shelter</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShelters.map((s) => (
            <div
              key={s.id}
              className="group p-5 rounded-2xl bg-neo-bg border border-neo-line/60 hover:border-neo-sun/60 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-neo-line/40 pb-3">
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-neo-gold/15 text-neo-gold border border-neo-gold/30 text-[10px] font-heading font-semibold uppercase tracking-wider shrink-0">
                        {s.organizationIdType}: {s.organizationId}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base md:text-lg text-neo-ink group-hover:text-neo-sun transition-colors truncate">
                      {s.name}
                    </h3>
                  </div>
                  {renderVerificationBadge(s.verificationStatus)}
                </div>

                {/* Location & Details */}
                <div className="space-y-2 text-xs font-body text-neo-ash">
                  <div className="flex items-start gap-2 text-neo-ink">
                    <MapPin className="w-3.5 h-3.5 text-neo-sun shrink-0 mt-0.5" />
                    <span className="line-clamp-1">
                      {s.street}, {s.city}, {s.state} {s.zip}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-neo-ash shrink-0" />
                    <span className="truncate">{s.contactEmail}</span>
                  </div>

                  {s.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neo-ash shrink-0" />
                      <span>{s.phone}</span>
                    </div>
                  )}

                  {s.description && (
                    <p className="line-clamp-2 text-[11px] leading-relaxed pt-1 text-neo-ash/90">
                      {s.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="pt-3 border-t border-neo-line/40 flex items-center justify-between">
                <span className="text-[10px] font-label text-neo-ash">
                  ID: {s.id.substring(s.id.length - 6)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onViewShelter(s)}
                    className="p-1.5 rounded-lg bg-neo-rice border border-neo-line/60 text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all shadow-xs cursor-pointer"
                    title="View Full Dossier"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onEditShelter(s)}
                    className="p-1.5 rounded-lg bg-neo-rice border border-neo-line/60 text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all shadow-xs cursor-pointer"
                    title="Edit Shelter Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteShelter(s)}
                    className="p-1.5 rounded-lg bg-neo-rice border border-neo-line/60 text-neo-sun hover:bg-neo-sun hover:text-neo-rice hover:border-neo-sun transition-all shadow-xs cursor-pointer"
                    title="Delete Shelter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
