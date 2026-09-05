"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Building2,
  Users,
  MapPin,
  ArrowUpRight,
  Loader2,
  X,
  ShieldCheck,
  SearchX,
  User,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type EntityType = "shelters" | "donors";

interface ShelterEntity {
  id: string;
  name: string;
  city: string;
  state: string;
  country?: string;
  profileImageUrl?: string | null;
  verificationStatus?: string;
  description?: string | null;
}

interface DonorEntity {
  id: string;
  name: string;
  email?: string;
  profileImageUrl?: string | null;
  role?: string;
  pledgesCompleted?: number;
}

const ITEMS_PER_PAGE = 6;

export function DashboardEntitySearch() {
  const [entityType, setEntityType] = useState<EntityType>("shelters");
  const [inputQuery, setInputQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [hasSearchedDonors, setHasSearchedDonors] = useState(false);

  const [shelters, setShelters] = useState<ShelterEntity[]>([]);
  const [donors, setDonors] = useState<DonorEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch shelters by default on mount or tab select
  useEffect(() => {
    async function fetchShelters() {
      if (entityType === "shelters" && shelters.length === 0) {
        setLoading(true);
        try {
          const res = await fetch("/api/shelters");
          if (res.ok) {
            const data = await res.json();
            console.log("Shelters: ", data);
            if (data.success && Array.isArray(data.data)) {
              setShelters(data.data);
            } else if (Array.isArray(data)) {
              setShelters(data);
            }
          }
        } catch (err) {
          console.error("Error fetching shelters for search:", err);
        } finally {
          setLoading(false);
        }
      }
    }

    if (entityType === "shelters") {
      fetchShelters();
    }
  }, [entityType, shelters.length]);

  // Tab switch handler
  const handleTabChange = (type: EntityType) => {
    setEntityType(type);
    setInputQuery("");
    setActiveSearchQuery("");
    setCurrentPage(1);
    if (type === "donors") {
      setHasSearchedDonors(false);
    }
  };

  // Explicit Search button or form submit handler
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryToApply = inputQuery.trim();
    setActiveSearchQuery(queryToApply);
    setCurrentPage(1);

    if (entityType === "donors") {
      setHasSearchedDonors(true);
      if (donors.length === 0) {
        setLoading(true);
        try {
          const res = await fetch("/api/users");
          if (res.ok) {
            const data = await res.json();
            console.log("Users: ", data);
            const list = data.success ? data.data : data;
            if (Array.isArray(list)) {
              setDonors(list.filter((u: DonorEntity) => u.role !== "SUPER_ADMIN"));
            }
          }
        } catch (err) {
          console.error("Error fetching donors for search:", err);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // Clear search input
  const handleClear = () => {
    setInputQuery("");
    setActiveSearchQuery("");
    setCurrentPage(1);
    if (entityType === "donors") {
      setHasSearchedDonors(false);
    }
  };

  // Filtered lists based on activeSearchQuery
  const filteredShelters = shelters.filter((s) => {
    if (!activeSearchQuery) return true;
    const q = activeSearchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      (s.country && s.country.toLowerCase().includes(q))
    );
  });

  const filteredDonors = hasSearchedDonors
    ? donors.filter((d) => {
      if (!activeSearchQuery) return true;
      const q = activeSearchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        (d.email && d.email.toLowerCase().includes(q))
      );
    })
    : [];

  // Pagination calculations
  const totalShelterPages = Math.max(1, Math.ceil(filteredShelters.length / ITEMS_PER_PAGE));
  const totalDonorPages = Math.max(1, Math.ceil(filteredDonors.length / ITEMS_PER_PAGE));
  const currentTotalPages = entityType === "shelters" ? totalShelterPages : totalDonorPages;

  const paginatedShelters = filteredShelters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginatedDonors = filteredDonors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-5 shadow-sm">
      {/* Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
            <Search className="w-6 h-6 text-neo-sun" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Pledge History & Drop-Off Log
            </h2>
          </div>
        </div>

        {/* Entity Type Selector Toggle */}
        <div className="inline-flex p-1 rounded-xl bg-neo-bg border border-neo-line/60 shadow-sm shrink-0">
          <button
            type="button"
            onClick={() => handleTabChange("shelters")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${entityType === "shelters"
              ? "bg-neo-sun text-neo-rice shadow-sm"
              : "text-neo-ink hover:text-neo-sun"
              }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Shelters</span>
            {shelters.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neo-rice/20 font-mono">
                {shelters.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("donors")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${entityType === "donors"
              ? "bg-neo-sun text-neo-rice shadow-sm"
              : "text-neo-ink hover:text-neo-sun"
              }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Donors</span>
          </button>
        </div>
      </div>

      {/* Search Bar Form with explicit Search Button */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={
              entityType === "shelters"
                ? "Type shelter name, city, or state and click Search..."
                : "Type donor name or email and click Search..."
            }
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-neo-bg border border-neo-line/70 text-neo-ink placeholder-neo-ash text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
          />
          {inputQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neo-ash hover:text-neo-sun cursor-pointer"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs hover:bg-neo-sun/90 transition-all flex items-center gap-2 shadow-md shadow-neo-sun/20 cursor-pointer shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-neo-rice" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>Search</span>
        </button>
      </form>

      {/* Active Filter Indicator */}
      {activeSearchQuery && (
        <div className="flex items-center justify-between text-xs font-body text-neo-ash px-1">
          <span>
            Active search filter: &quot;<strong className="text-neo-ink">{activeSearchQuery}</strong>&quot;
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-neo-sun hover:underline font-heading font-semibold text-[11px]"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Results Content Area */}
      {loading ? (
        <div className="p-10 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-center gap-2 text-xs font-body text-neo-ash">
          <Loader2 className="w-5 h-5 animate-spin text-neo-sun" />
          <span>Searching active {entityType}...</span>
        </div>
      ) : entityType === "shelters" ? (
        filteredShelters.length === 0 ? (
          <div className="p-8 rounded-xl bg-neo-bg border border-dashed border-neo-line/60 text-center space-y-2">
            <SearchX className="w-8 h-8 text-neo-ash mx-auto opacity-50" />
            <p className="text-xs font-body text-neo-ash">
              No shelters found matching &quot;{activeSearchQuery}&quot;. Try clearing your query to view all shelters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {paginatedShelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 hover:border-neo-sun/60 transition-all flex flex-col justify-between space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-neo-line/60 bg-neo-rice flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {shelter.profileImageUrl ? (
                          /* eslint-disable-next-next/no-img-element */
                          <img
                            src={shelter.profileImageUrl}
                            alt={shelter.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="w-5 h-5 text-neo-sun" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-sm text-neo-ink leading-snug truncate max-w-[140px]">
                          {shelter.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs font-body text-neo-ash mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                          <span className="truncate">
                            {shelter.city}, {shelter.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 text-[9px] font-heading font-semibold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase shrink-0 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {shelter.verificationStatus || "VERIFIED"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-neo-line/40 flex items-center justify-between text-xs font-body">
                    <span className="text-neo-ash truncate max-w-[130px]">
                      {shelter.description || "Active shelter"}
                    </span>

                    <Link
                      href={`/s/${shelter.id}`}
                      className="text-neo-sun hover:underline flex items-center gap-1 font-semibold font-heading shrink-0"
                    >
                      <span>Wishlist</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalShelterPages > 1 && (
              <div className="pt-3 border-t border-neo-line/40 flex items-center justify-between text-xs font-body">
                <span className="text-neo-ash">
                  Showing{" "}
                  <strong className="text-neo-ink font-heading">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-neo-ink font-heading">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredShelters.length)}
                  </strong>{" "}
                  of <strong className="text-neo-ink font-heading">{filteredShelters.length}</strong> shelters
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-neo-line/60 bg-neo-bg text-neo-ink hover:border-neo-sun disabled:opacity-40 disabled:hover:border-neo-line/60 cursor-pointer shadow-sm"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-3 py-1 font-heading font-semibold text-xs text-neo-ink">
                    Page {currentPage} of {totalShelterPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage === totalShelterPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalShelterPages, p + 1))}
                    className="p-1.5 rounded-lg border border-neo-line/60 bg-neo-bg text-neo-ink hover:border-neo-sun disabled:opacity-40 disabled:hover:border-neo-line/60 cursor-pointer shadow-sm"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      ) : !hasSearchedDonors ? (
        <div className="p-8 rounded-xl bg-neo-bg border border-dashed border-neo-line/60 text-center space-y-2">
          <Users className="w-8 h-8 text-neo-ash mx-auto opacity-50" />
          <div className="space-y-1">
            <h4 className="font-heading font-semibold text-sm text-neo-ink">
              Search Donor Registry
            </h4>
            <p className="text-xs font-body text-neo-ash max-w-md mx-auto">
              Type a donor name or email address in the search box above and click <strong className="text-neo-sun font-heading">Search</strong> to discover community donors.
            </p>
          </div>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="p-8 rounded-xl bg-neo-bg border border-dashed border-neo-line/60 text-center space-y-2">
          <SearchX className="w-8 h-8 text-neo-ash mx-auto opacity-50" />
          <p className="text-xs font-body text-neo-ash">
            No donors found matching &quot;{activeSearchQuery}&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {paginatedDonors.map((donor) => (
              <div
                key={donor.id}
                className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 hover:border-neo-sun/60 transition-all flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full border border-neo-line/60 bg-neo-rice text-neo-sun flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {donor.profileImageUrl ? (
                      /* eslint-disable-next-next/no-img-element */
                      <img
                        src={donor.profileImageUrl}
                        alt={donor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-neo-sun" />
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <h4 className="font-heading font-semibold text-sm text-neo-ink leading-snug truncate">
                      {donor.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs font-body text-neo-ash mt-0.5 truncate">
                      <Heart className="w-3.5 h-3.5 text-neo-sun shrink-0 fill-neo-sun/20" />
                      <span className="truncate">
                        {donor.pledgesCompleted !== undefined
                          ? `${donor.pledgesCompleted} Contributions`
                          : "Community Donor"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 text-[10px] font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 uppercase">
                    {donor.role || "DONOR"}
                  </span>
                  <Link
                    href={`/u/${donor.id}`}
                    className="p-1.5 rounded-lg border border-neo-line/60 bg-neo-rice text-neo-sun hover:border-neo-sun transition-all flex items-center justify-center shadow-sm"
                    title="View Public Profile"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalDonorPages > 1 && (
            <div className="pt-3 border-t border-neo-line/40 flex items-center justify-between text-xs font-body">
              <span className="text-neo-ash">
                Showing{" "}
                <strong className="text-neo-ink font-heading">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-neo-ink font-heading">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredDonors.length)}
                </strong>{" "}
                of <strong className="text-neo-ink font-heading">{filteredDonors.length}</strong> donors
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-neo-line/60 bg-neo-bg text-neo-ink hover:border-neo-sun disabled:opacity-40 disabled:hover:border-neo-line/60 cursor-pointer shadow-sm"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-1 font-heading font-semibold text-xs text-neo-ink">
                  Page {currentPage} of {totalDonorPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalDonorPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalDonorPages, p + 1))}
                  className="p-1.5 rounded-lg border border-neo-line/60 bg-neo-bg text-neo-ink hover:border-neo-sun disabled:opacity-40 disabled:hover:border-neo-line/60 cursor-pointer shadow-sm"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

