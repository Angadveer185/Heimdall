"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Building2,
  Search,
  X,
  MapPin,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  Loader2,
  SearchX,
  LogIn,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react";

interface ShelterItem {
  id: string;
  name: string;
  country?: string;
  organizationIdType?: string;
  organizationId?: string;
  verificationStatus?: string;
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
  shelterImages?: string[];
}

const ITEMS_PER_PAGE = 9;

type VerificationFilter = "ALL" | "VERIFIED" | "PENDING";

export default function SearchSheltersPage() {
  const user = useUserStore((state) => state.user);

  const [shelters, setShelters] = useState<ShelterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VerificationFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadShelters() {
      setLoading(true);
      try {
        const res = await fetch("/api/shelters");
        if (res.ok) {
          const json = await res.json();
          const list = json.success && Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
          setShelters(list);
        }
      } catch (err) {
        console.error("Failed to load shelters:", err);
      } finally {
        setLoading(false);
      }
    }

    loadShelters();
  }, []);

  // Filter shelters by search query and verification status
  const filteredShelters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return shelters.filter((s) => {
      // Status filter
      if (statusFilter === "VERIFIED" && s.verificationStatus !== "VERIFIED") {
        return false;
      }
      if (statusFilter === "PENDING" && s.verificationStatus === "VERIFIED") {
        return false;
      }

      // Query filter
      if (!q) return true;

      const nameMatch = s.name?.toLowerCase().includes(q);
      const cityMatch = s.city?.toLowerCase().includes(q);
      const stateMatch = s.state?.toLowerCase().includes(q);
      const countryMatch = s.country?.toLowerCase().includes(q);
      const descMatch = s.description?.toLowerCase().includes(q);

      return nameMatch || cityMatch || stateMatch || countryMatch || descMatch;
    });
  }, [shelters, searchQuery, statusFilter]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Status counts
  const verifiedCount = useMemo(
    () => shelters.filter((s) => s.verificationStatus === "VERIFIED").length,
    [shelters]
  );
  const pendingCount = useMemo(
    () => shelters.filter((s) => s.verificationStatus !== "VERIFIED").length,
    [shelters]
  );

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredShelters.length / ITEMS_PER_PAGE));
  const paginatedShelters = filteredShelters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!user) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border border-neo-line/60 rounded-2xl bg-neo-rice p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl border border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center mx-auto shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Authentication Required</span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-neo-ink pt-1">
              Search Shelters
            </h1>
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              Please sign in to browse non-profit shelter facilities, view donation wishlists, and reserve supplies.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink selection:bg-neo-sun selection:text-neo-rice transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar user={user} />

      {/* Main Work Area */}
      <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Header Bar with Search Bar positioned on the Right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-neo-line/40 pb-6">
          {/* Left Title & Metadata */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 text-xs font-heading font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Shelter Directory</span>
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
              Search Non-Profit Shelters
            </h1>
            <p className="text-xs font-body text-neo-ash max-w-xl leading-relaxed">
              Locate verified community shelters, emergency food pantries, and relief centers across the network.
            </p>
          </div>

          {/* Right Search Bar */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                <Search className="w-4 h-4 text-neo-sun" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by shelter name, city, state, or country..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-neo-rice border border-neo-line/70 text-neo-ink placeholder-neo-ash text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neo-ash hover:text-neo-sun transition-colors cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Controls & Result Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Status Filter Buttons */}
          <div className="inline-flex p-1 rounded-xl bg-neo-rice border border-neo-line/60 shadow-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-neo-sun text-neo-rice shadow-xs"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              <span>All Facilities</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neo-bg font-mono text-neo-ink">
                {shelters.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("VERIFIED")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                statusFilter === "VERIFIED"
                  ? "bg-neo-sun text-neo-rice shadow-xs"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neo-bg font-mono text-neo-ink">
                {verifiedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("PENDING")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                statusFilter === "PENDING"
                  ? "bg-neo-sun text-neo-rice shadow-xs"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              <span>Pending</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neo-bg font-mono text-neo-ink">
                {pendingCount}
              </span>
            </button>
          </div>

          {/* Active Query Status Indicator */}
          <div className="text-xs font-body text-neo-ash flex items-center gap-2">
            <span>
              Showing{" "}
              <strong className="text-neo-ink font-heading">
                {filteredShelters.length}
              </strong>{" "}
              {filteredShelters.length === 1 ? "shelter" : "shelters"}
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neo-sun/10 text-neo-sun text-[11px] font-heading font-semibold">
                &quot;{searchQuery}&quot;
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Shelter Content Grid */}
        {loading ? (
          <div className="p-16 rounded-2xl bg-neo-rice border border-neo-line/60 flex flex-col items-center justify-center gap-3 text-neo-ash">
            <Loader2 className="w-7 h-7 animate-spin text-neo-sun" />
            <p className="text-xs font-heading font-semibold">
              Loading shelter directory...
            </p>
          </div>
        ) : filteredShelters.length === 0 ? (
          <div className="p-12 md:p-16 rounded-2xl bg-neo-rice border border-dashed border-neo-line/70 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-neo-bg border border-neo-line/60 text-neo-ash flex items-center justify-center mx-auto shadow-xs">
              <SearchX className="w-7 h-7 text-neo-sun opacity-80" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-heading font-bold text-lg text-neo-ink">
                No Shelters Found
              </h3>
              <p className="text-xs font-body text-neo-ash leading-relaxed">
                {searchQuery
                  ? `No shelter facilities match "${searchQuery}". Try broadening your search or adjusting verification filters.`
                  : "No shelter records are currently registered in this category."}
              </p>
            </div>
            {(searchQuery || statusFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
                className="px-4 py-2 rounded-xl bg-neo-bg border border-neo-line/70 text-neo-sun hover:border-neo-sun font-heading font-semibold text-xs transition-all shadow-xs cursor-pointer"
              >
                Reset Search & Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedShelters.map((shelter) => {
                const isVerified = shelter.verificationStatus === "VERIFIED";

                return (
                  <div
                    key={shelter.id}
                    className="p-5 rounded-2xl bg-neo-rice border border-neo-line/60 hover:border-neo-sun/60 transition-all flex flex-col justify-between space-y-4 shadow-xs group"
                  >
                    {/* Top Row: Avatar & Name & Status Badge */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-12 h-12 rounded-xl border border-neo-line/70 bg-neo-bg text-neo-sun flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
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

                          <div className="overflow-hidden">
                            <h3 className="font-heading font-bold text-base text-neo-ink leading-snug truncate group-hover:text-neo-sun transition-colors">
                              {shelter.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs font-body text-neo-ash mt-0.5 truncate">
                              <MapPin className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                              <span className="truncate">
                                {shelter.city}, {shelter.state}
                                {shelter.country ? ` · ${shelter.country}` : ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 text-[10px] font-heading font-semibold rounded-full uppercase shrink-0 flex items-center gap-1 border ${
                            isVerified
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{isVerified ? "Verified" : "Pending"}</span>
                        </span>
                      </div>

                      {/* Description snippet */}
                      <p className="text-xs font-body text-neo-ash line-clamp-2 leading-relaxed">
                        {shelter.description ||
                          "Registered non-profit shelter facilitating community donations and urgent relief supplies."}
                      </p>

                      {/* Quick Meta: Hours & Contact */}
                      <div className="pt-2 border-t border-neo-line/30 space-y-1 text-xs font-body text-neo-ash">
                        {shelter.dropOffHours && (
                          <div className="flex items-center gap-2 truncate">
                            <Clock className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                            <span className="truncate">Drop-off: {shelter.dropOffHours}</span>
                          </div>
                        )}
                        {shelter.contactEmail && (
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                            <span className="truncate">{shelter.contactEmail}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-neo-line/40 flex items-center justify-between">
                      <span className="text-[11px] font-label font-bold text-neo-ash uppercase">
                        {shelter.organizationIdType || "NGO"} · {shelter.organizationId || "Registered"}
                      </span>

                      <Link
                        href={`/s/${shelter.id}`}
                        className="px-3.5 py-2 rounded-xl bg-neo-bg text-neo-sun border border-neo-line/70 hover:bg-neo-sun hover:text-neo-rice hover:border-neo-sun transition-all font-heading font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                      >
                        <span>View Wishlist</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-4 border-t border-neo-line/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-body">
                <span className="text-neo-ash">
                  Showing{" "}
                  <strong className="text-neo-ink font-heading">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-neo-ink font-heading">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredShelters.length)}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-neo-ink font-heading">
                    {filteredShelters.length}
                  </strong>{" "}
                  facilities
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-neo-line/60 bg-neo-rice text-neo-ink hover:border-neo-sun hover:text-neo-sun disabled:opacity-40 disabled:hover:border-neo-line/60 cursor-pointer shadow-xs flex items-center gap-1 font-heading text-xs"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <span className="px-3 py-1.5 font-heading font-semibold text-xs text-neo-ink rounded-lg bg-neo-rice border border-neo-line/60">
                    {currentPage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-neo-line/60 bg-neo-rice text-neo-ink hover:border-neo-sun hover:text-neo-sun disabled:opacity-40 disabled:hover:border-neo-line/60 cursor-pointer shadow-xs flex items-center gap-1 font-heading text-xs"
                    aria-label="Next Page"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
