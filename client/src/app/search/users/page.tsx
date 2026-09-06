"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Users,
  Search,
  X,
  ShieldCheck,
  Shield,
  Building2,
  Award,
  ArrowUpRight,
  Loader2,
  SearchX,
  LogIn,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Mail,
  Heart,
  Calendar,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email?: string;
  role: string;
  phone?: string | null;
  profileImageUrl?: string | null;
  shelterId?: string | null;
  shelter?: {
    id: string;
    name: string;
    city?: string;
    state?: string;
  } | null;
  pledgesCompleted?: number;
  createdAt?: string;
}

const ITEMS_PER_PAGE = 9;

type RoleFilter = "ALL" | "DONOR" | "SHELTER_ADMIN" | "SUPER_ADMIN";

export default function SearchUsersPage() {
  const user = useUserStore((state) => state.user);

  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const res = await fetch("/api/users", { credentials: "include" });
        if (res.ok) {
          const json = await res.json();
          const list = json.success && Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
          setUsers(list);
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // Filter users by search query and role
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      // Role filter
      if (roleFilter !== "ALL" && u.role !== roleFilter) {
        return false;
      }

      // Query filter
      if (!q) return true;

      const nameMatch = u.name?.toLowerCase().includes(q);
      const emailMatch = u.email?.toLowerCase().includes(q);
      const roleMatch = u.role?.toLowerCase().includes(q);
      const shelterMatch = u.shelter?.name?.toLowerCase().includes(q);

      return nameMatch || emailMatch || roleMatch || shelterMatch;
    });
  }, [users, searchQuery, roleFilter]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  // Role counts
  const donorCount = useMemo(
    () => users.filter((u) => u.role === "DONOR").length,
    [users]
  );
  const shelterAdminCount = useMemo(
    () => users.filter((u) => u.role === "SHELTER_ADMIN").length,
    [users]
  );
  const superAdminCount = useMemo(
    () => users.filter((u) => u.role === "SUPER_ADMIN").length,
    [users]
  );

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (!user) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border border-neo-line/60 rounded-2xl bg-neo-rice p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl border border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center mx-auto shadow-sm">
            <Users className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Authentication Required</span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-neo-ink pt-1">
              Search Community
            </h1>
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              Please sign in to browse verified community members, shelter administrators, and donor profiles.
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
              <Users className="w-3.5 h-3.5" />
              <span>Community Directory</span>
            </div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
              Search Community Members
            </h1>
            <p className="text-xs font-body text-neo-ash max-w-xl leading-relaxed">
              Connect with fellow supporters, registered shelter administrators, and verified donors across the network.
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
                placeholder="Search by member name, email, or role..."
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
          {/* Role Filter Buttons */}
          <div className="inline-flex p-1 rounded-xl bg-neo-rice border border-neo-line/60 shadow-xs flex-wrap">
            <button
              type="button"
              onClick={() => setRoleFilter("ALL")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                roleFilter === "ALL"
                  ? "bg-neo-sun text-neo-rice shadow-xs"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              <span>All Members</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neo-bg font-mono text-neo-ink">
                {users.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRoleFilter("DONOR")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                roleFilter === "DONOR"
                  ? "bg-neo-sun text-neo-rice shadow-xs"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Donors</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neo-bg font-mono text-neo-ink">
                {donorCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRoleFilter("SHELTER_ADMIN")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                roleFilter === "SHELTER_ADMIN"
                  ? "bg-neo-sun text-neo-rice shadow-xs"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Shelter Admins</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neo-bg font-mono text-neo-ink">
                {shelterAdminCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRoleFilter("SUPER_ADMIN")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                roleFilter === "SUPER_ADMIN"
                  ? "bg-neo-sun text-neo-rice shadow-xs"
                  : "text-neo-ink hover:text-neo-sun"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Super Admins</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neo-bg font-mono text-neo-ink">
                {superAdminCount}
              </span>
            </button>
          </div>

          {/* Active Query Status Indicator */}
          <div className="text-xs font-body text-neo-ash flex items-center gap-2">
            <span>
              Showing{" "}
              <strong className="text-neo-ink font-heading">
                {filteredUsers.length}
              </strong>{" "}
              {filteredUsers.length === 1 ? "member" : "members"}
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

        {/* User Content Grid */}
        {loading ? (
          <div className="p-16 rounded-2xl bg-neo-rice border border-neo-line/60 flex flex-col items-center justify-center gap-3 text-neo-ash">
            <Loader2 className="w-7 h-7 animate-spin text-neo-sun" />
            <p className="text-xs font-heading font-semibold">
              Loading community members...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 md:p-16 rounded-2xl bg-neo-rice border border-dashed border-neo-line/70 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-neo-bg border border-neo-line/60 text-neo-ash flex items-center justify-center mx-auto shadow-xs">
              <SearchX className="w-7 h-7 text-neo-sun opacity-80" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-heading font-bold text-lg text-neo-ink">
                No Members Found
              </h3>
              <p className="text-xs font-body text-neo-ash leading-relaxed">
                {searchQuery
                  ? `No community members match "${searchQuery}". Try searching for another name or resetting role filters.`
                  : "No member profiles found in this category."}
              </p>
            </div>
            {(searchQuery || roleFilter !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("ALL");
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
              {paginatedUsers.map((member) => {
                const isSuperAdmin = member.role === "SUPER_ADMIN";
                const isShelterAdmin = member.role === "SHELTER_ADMIN";

                return (
                  <div
                    key={member.id}
                    className="p-5 rounded-2xl bg-neo-rice border border-neo-line/60 hover:border-neo-sun/60 transition-all flex flex-col justify-between space-y-4 shadow-xs group"
                  >
                    {/* Top Row: Avatar & Name & Role Badge */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-12 h-12 rounded-xl border border-neo-line/70 bg-neo-bg text-neo-sun flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                            {member.profileImageUrl ? (
                              /* eslint-disable-next-next/no-img-element */
                              <img
                                src={member.profileImageUrl}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-heading font-bold text-lg uppercase text-neo-sun">
                                {member.name ? member.name.charAt(0).toUpperCase() : "U"}
                              </span>
                            )}
                          </div>

                          <div className="overflow-hidden">
                            <h3 className="font-heading font-bold text-base text-neo-ink leading-snug truncate group-hover:text-neo-sun transition-colors">
                              {member.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs font-body text-neo-ash mt-0.5 truncate">
                              <Mail className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                              <span className="truncate">{member.email || "Confidential Contact"}</span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`px-2.5 py-1 text-[10px] font-heading font-semibold rounded-full uppercase shrink-0 flex items-center gap-1 border ${
                            isSuperAdmin
                              ? "bg-neo-sun/15 text-neo-sun border-neo-sun/30"
                              : isShelterAdmin
                              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : "bg-neo-ash/15 text-neo-ash border-neo-line/60"
                          }`}
                        >
                          {isSuperAdmin ? (
                            <Shield className="w-3 h-3" />
                          ) : isShelterAdmin ? (
                            <Building2 className="w-3 h-3" />
                          ) : (
                            <Heart className="w-3 h-3 text-neo-sun" />
                          )}
                          <span>
                            {isSuperAdmin
                              ? "Super Admin"
                              : isShelterAdmin
                              ? "Shelter Admin"
                              : "Donor"}
                          </span>
                        </span>
                      </div>

                      {/* Associated shelter facility if shelter admin */}
                      {member.shelter && (
                        <div className="p-2.5 rounded-xl bg-neo-bg border border-neo-line/50 flex items-center gap-2 text-xs font-body text-neo-ash">
                          <Building2 className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                          <span className="truncate">
                            Managing: <strong className="text-neo-ink font-heading">{member.shelter.name}</strong>
                          </span>
                        </div>
                      )}

                      {/* Quick Contribution / Activity Stats */}
                      <div className="pt-2 border-t border-neo-line/30 flex items-center justify-between text-xs font-body text-neo-ash">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                          <span>
                            <strong className="text-neo-ink font-heading">
                              {member.pledgesCompleted || 0}
                            </strong>{" "}
                            Delivered
                          </span>
                        </div>

                        {member.createdAt && (
                          <div className="flex items-center gap-1 text-[11px] font-body text-neo-ash">
                            <Calendar className="w-3 h-3 text-neo-sun" />
                            <span>
                              Joined {new Date(member.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-neo-line/40 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-neo-ash">
                        ID: {member.id ? `${member.id.slice(0, 8)}...` : ""}
                      </span>

                      <Link
                        href={`/u/${member.id}`}
                        className="px-3.5 py-2 rounded-xl bg-neo-bg text-neo-sun border border-neo-line/70 hover:bg-neo-sun hover:text-neo-rice hover:border-neo-sun transition-all font-heading font-semibold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                      >
                        <span>View Profile</span>
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
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-neo-ink font-heading">
                    {filteredUsers.length}
                  </strong>{" "}
                  members
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
