"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { UserData, useUserStore } from "@/store/useUserStore";
import {
  ArrowLeft,
  User,
  LayoutDashboard,
  Shield,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Users,
  FolderTree,
  ChevronDown,
  Layers,
  Sun,
  Moon,
  Search,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "@/components/theme/theme-context";

interface SidebarProps {
  user: UserData;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const clearUser = useUserStore((state) => state.clearUser);
  const { theme, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const searchLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const adminLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-expand accordions if current route matches
  useEffect(() => {
    if (pathname.startsWith("/search")) {
      setSearchMenuOpen(true);
    }
    if (pathname.startsWith("/admin")) {
      setAdminMenuOpen(true);
    }
  }, [pathname]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchLeaveTimeoutRef.current) clearTimeout(searchLeaveTimeoutRef.current);
      if (adminLeaveTimeoutRef.current) clearTimeout(adminLeaveTimeoutRef.current);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearUser();
      router.push("/");
    }
  };

  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const isShelterAdmin = user.role === "SHELTER_ADMIN";

  // Super admin conditionally manages a shelter if shelterId is set
  const superAdminManagesShelter = isSuperAdmin && Boolean(user.shelterId || user.shelter?.id);

  // Helper to check active state
  const isActive = (href: string, exact = false) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  // Hover Handlers for Search Dropdown
  const handleSearchMouseEnter = () => {
    if (searchLeaveTimeoutRef.current) {
      clearTimeout(searchLeaveTimeoutRef.current);
      searchLeaveTimeoutRef.current = null;
    }
    setSearchMenuOpen(true);
  };

  const handleSearchMouseLeave = () => {
    if (!pathname.startsWith("/search")) {
      if (searchLeaveTimeoutRef.current) {
        clearTimeout(searchLeaveTimeoutRef.current);
      }
      searchLeaveTimeoutRef.current = setTimeout(() => {
        setSearchMenuOpen(false);
      }, 300);
    }
  };

  // Hover Handlers for Admin Control Center Dropdown
  const handleAdminMouseEnter = () => {
    if (adminLeaveTimeoutRef.current) {
      clearTimeout(adminLeaveTimeoutRef.current);
      adminLeaveTimeoutRef.current = null;
    }
    setAdminMenuOpen(true);
  };

  const handleAdminMouseLeave = () => {
    if (!pathname.startsWith("/admin")) {
      if (adminLeaveTimeoutRef.current) {
        clearTimeout(adminLeaveTimeoutRef.current);
      }
      adminLeaveTimeoutRef.current = setTimeout(() => {
        setAdminMenuOpen(false);
      }, 300);
    }
  };

  return (
    <>
      {/* Mobile Navigation Header Bar */}
      <div className="md:hidden bg-neo-rice border-b border-neo-line/60 px-4 py-3.5 flex items-center justify-between z-30 shrink-0 text-neo-ink transition-colors duration-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              window.history.back();
              setMobileOpen(false);
            }}
            className="p-2 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-neo-sun" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-neo-line/60 bg-neo-sun text-neo-rice flex items-center justify-center font-heading font-bold text-xs shadow-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="font-heading font-semibold text-sm truncate max-w-[150px] text-neo-ink">
              {user.name}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-ink hover:border-neo-sun shadow-sm cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-neo-sun" />
          ) : (
            <Menu className="w-5 h-5 text-neo-sun" />
          )}
        </button>
      </div>

      {/* Main Desktop Sidebar */}
      <aside
        className={`${mobileOpen ? "flex" : "hidden"
          } md:flex flex-col justify-between w-full md:w-72 lg:w-80 bg-neo-rice text-neo-ink border-r border-neo-line/60 p-5 lg:p-6 h-auto md:h-full shrink-0 z-20 overflow-y-auto transition-colors duration-200 shadow-sm`}
      >
        {/* Top Scrollable Container */}
        <div className="space-y-5">
          {/* Header Actions: Back Button & Theme / Brand */}
          <div className="flex items-center justify-between border-b border-neo-line/40 pb-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neo-line/60 bg-neo-bg hover:border-neo-sun hover:text-neo-sun transition-all text-xs font-heading font-semibold text-neo-ink cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-neo-sun" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all cursor-pointer shadow-xs"
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 text-neo-sun" />
                ) : (
                  <Sun className="w-4 h-4 text-neo-sun" />
                )}
              </button>
              <Link
                href="/"
                className="p-2.5 rounded-xl border border-neo-line/60 text-neo-sun bg-neo-bg hover:border-neo-sun transition-all flex items-center justify-center cursor-pointer shadow-xs"
                aria-label="Home"
              >
                <ShieldCheck className="w-4 h-4 text-neo-sun" />
              </Link>
            </div>
          </div>

          {/* User Profile Card Summary */}
          <div className="p-3.5 rounded-2xl bg-neo-bg border border-neo-line/70 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-2xl border border-neo-line/70 bg-neo-rice text-neo-sun flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
              {user.profileImageUrl ? (
                /* eslint-disable-next-next/no-img-element */
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-heading font-bold text-lg uppercase text-neo-sun">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>

            <div className="space-y-1 overflow-hidden flex-1">
              <h3 className="font-heading font-bold text-sm text-neo-ink truncate">
                {user.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-heading font-semibold px-2.5 py-0.5 rounded-full border border-neo-sun/30 bg-neo-sun/15 text-neo-sun uppercase tracking-wider">
                  {isSuperAdmin
                    ? "Super Admin"
                    : isShelterAdmin
                      ? "Shelter Admin"
                      : "Community Donor"}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Menu Links - Consistent Card Backgrounds for Every Item */}
          <nav className="space-y-2.5">
            <span className="text-[11px] font-heading text-neo-ash uppercase tracking-wider px-2 block font-bold">
              Console Navigation
            </span>

            {/* 1. Dashboard */}
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-heading font-semibold rounded-xl transition-all border shadow-xs ${isActive("/dashboard", true)
                ? "bg-neo-sun text-neo-rice border-neo-sun shadow-md shadow-neo-sun/25 font-bold"
                : "bg-neo-bg text-neo-ink border-neo-line/70 hover:border-neo-sun hover:text-neo-sun hover:shadow-sm"
                }`}
            >
              <LayoutDashboard
                className={`w-5 h-5 shrink-0 ${isActive("/dashboard", true) ? "text-neo-rice" : "text-neo-sun"
                  }`}
              />
              <span>Dashboard</span>
            </Link>

            {/* 2. Profile & Account */}
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-heading font-semibold rounded-xl transition-all border shadow-xs ${isActive("/profile", true)
                ? "bg-neo-sun text-neo-rice border-neo-sun shadow-md shadow-neo-sun/25 font-bold"
                : "bg-neo-bg text-neo-ink border-neo-line/70 hover:border-neo-sun hover:text-neo-sun hover:shadow-sm"
                }`}
            >
              <User
                className={`w-5 h-5 shrink-0 ${isActive("/profile", true) ? "text-neo-rice" : "text-neo-sun"
                  }`}
              />
              <span>Profile & Account</span>
            </Link>

            {/* 3. Search Dropdown (Opens on Hover or Click) */}
            <div
              className="relative space-y-1.5"
              onMouseEnter={handleSearchMouseEnter}
              onMouseLeave={handleSearchMouseLeave}
            >
              <button
                type="button"
                onClick={() => setSearchMenuOpen(!searchMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-heading font-semibold rounded-xl transition-all border shadow-xs cursor-pointer ${pathname.startsWith("/search")
                  ? "bg-neo-sun/15 text-neo-sun border-neo-sun/40 shadow-sm font-bold"
                  : "bg-neo-bg text-neo-ink border-neo-line/70 hover:border-neo-sun hover:text-neo-sun hover:shadow-sm"
                  }`}
              >
                <div className="flex items-center gap-3.5">
                  <Search className="w-5 h-5 text-neo-sun shrink-0" />
                  <span>Search Directory</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-neo-sun transition-transform duration-200 ${searchMenuOpen ? "rotate-180" : "rotate-0"
                    }`}
                />
              </button>

              {/* Search Submenu Items with Framer Motion Accordion */}
              <AnimatePresence initial={false}>
                {searchMenuOpen && (
                  <motion.div
                    key="search-submenu"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 space-y-1.5 border-l-2 border-neo-sun/40 ml-4 pt-1.5 pb-1">
                      {/* 3.1 Shelters */}
                      <Link
                        href="/search/shelters"
                        onClick={() => setMobileOpen(false)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-heading font-semibold rounded-xl transition-all border shadow-xs ${isActive("/search/shelters")
                          ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm font-bold"
                          : "bg-neo-bg text-neo-ink border-neo-line/60 hover:bg-neo-rice hover:border-neo-sun hover:text-neo-sun"
                          }`}
                      >
                        <Building2 className="w-4 h-4 text-neo-sun shrink-0" />
                        <span>Shelters</span>
                      </Link>

                      {/* 3.2 Users */}
                      <Link
                        href="/search/users"
                        onClick={() => setMobileOpen(false)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-heading font-semibold rounded-xl transition-all border shadow-xs ${isActive("/search/users")
                          ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm font-bold"
                          : "bg-neo-bg text-neo-ink border-neo-line/60 hover:bg-neo-rice hover:border-neo-sun hover:text-neo-sun"
                          }`}
                      >
                        <Users className="w-4 h-4 text-neo-sun shrink-0" />
                        <span>Users</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. My Shelter Console (SHELTER_ADMIN or SUPER_ADMIN managing a shelter) */}
            {(isShelterAdmin || superAdminManagesShelter) && (
              <Link
                href="/shelter/manage"
                onClick={() => setMobileOpen(false)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-heading font-semibold rounded-xl transition-all border shadow-xs ${isActive("/shelter/manage")
                  ? "bg-neo-sun text-neo-rice border-neo-sun shadow-md shadow-neo-sun/25 font-bold"
                  : "bg-neo-bg text-neo-ink border-neo-line/70 hover:border-neo-sun hover:text-neo-sun hover:shadow-sm"
                  }`}
              >
                <Building2
                  className={`w-5 h-5 shrink-0 ${isActive("/shelter/manage") ? "text-neo-rice" : "text-neo-sun"
                    }`}
                />
                <span>My Shelter Console</span>
              </Link>
            )}

            {/* 4.1 Register Shelter (DONOR role) */}
            {user.role === "DONOR" && (
              <Link
                href="/shelter/register"
                onClick={() => setMobileOpen(false)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-heading font-semibold rounded-xl transition-all border shadow-xs ${isActive("/shelter/register")
                  ? "bg-neo-sun text-neo-rice border-neo-sun shadow-md shadow-neo-sun/25 font-bold"
                  : "bg-neo-bg text-neo-ink border-neo-line/70 hover:border-neo-sun hover:text-neo-sun hover:shadow-sm"
                  }`}
              >
                <Building2
                  className={`w-5 h-5 shrink-0 ${isActive("/shelter/register") ? "text-neo-rice" : "text-neo-sun"
                    }`}
                />
                <span>Register Shelter</span>
              </Link>
            )}

            {/* 5. Admin Control Center (SUPER_ADMIN Dropdown - Opens on Hover or Click) */}
            {isSuperAdmin && (
              <div
                className="relative space-y-1.5 pt-1"
                onMouseEnter={handleAdminMouseEnter}
                onMouseLeave={handleAdminMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-heading font-semibold rounded-xl transition-all border shadow-xs cursor-pointer ${pathname.startsWith("/admin")
                    ? "bg-neo-sun/15 text-neo-sun border-neo-sun/40 shadow-sm font-bold"
                    : "bg-neo-bg text-neo-ink border-neo-line/70 hover:border-neo-sun hover:text-neo-sun hover:shadow-sm"
                    }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Shield className="w-5 h-5 text-neo-sun shrink-0" />
                    <span>Admin Control Center</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neo-sun transition-transform duration-200 ${adminMenuOpen ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </button>

                {/* Admin Submenu Items with Framer Motion Accordion */}
                <AnimatePresence initial={false}>
                  {adminMenuOpen && (
                    <motion.div
                      key="admin-submenu"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 space-y-1.5 border-l-2 border-neo-sun/40 ml-4 pt-1.5 pb-1">
                        {/* 5.1 Overview Panel */}
                        <Link
                          href="/admin"
                          onClick={() => setMobileOpen(false)}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-heading font-semibold rounded-xl transition-all border shadow-xs ${pathname === "/admin"
                            ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm font-bold"
                            : "bg-neo-bg text-neo-ink border-neo-line/60 hover:bg-neo-rice hover:border-neo-sun hover:text-neo-sun"
                            }`}
                        >
                          <Layers className="w-4 h-4 text-neo-sun shrink-0" />
                          <span>Overview Panel</span>
                        </Link>

                        {/* 5.2 User Roster */}
                        <Link
                          href="/admin/users"
                          onClick={() => setMobileOpen(false)}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-heading font-semibold rounded-xl transition-all border shadow-xs ${isActive("/admin/users")
                            ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm font-bold"
                            : "bg-neo-bg text-neo-ink border-neo-line/60 hover:bg-neo-rice hover:border-neo-sun hover:text-neo-sun"
                            }`}
                        >
                          <Users className="w-4 h-4 text-neo-sun shrink-0" />
                          <span>User Roster</span>
                        </Link>

                        {/* 5.3 Shelter Repository */}
                        <Link
                          href="/admin/shelters"
                          onClick={() => setMobileOpen(false)}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-heading font-semibold rounded-xl transition-all border shadow-xs ${isActive("/admin/shelters")
                            ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm font-bold"
                            : "bg-neo-bg text-neo-ink border-neo-line/60 hover:bg-neo-rice hover:border-neo-sun hover:text-neo-sun"
                            }`}
                        >
                          <Building2 className="w-4 h-4 text-neo-sun shrink-0" />
                          <span>Shelter Repository</span>
                        </Link>

                        {/* 5.4 Catalog Pools */}
                        <Link
                          href="/admin/pools"
                          onClick={() => setMobileOpen(false)}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-heading font-semibold rounded-xl transition-all border shadow-xs ${isActive("/admin/pools")
                            ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm font-bold"
                            : "bg-neo-bg text-neo-ink border-neo-line/60 hover:bg-neo-rice hover:border-neo-sun hover:text-neo-sun"
                            }`}
                        >
                          <FolderTree className="w-4 h-4 text-neo-sun shrink-0" />
                          <span>Catalog Pools</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>
        </div>

        {/* Fancy Clean Bottom Logout Dock */}
        <div className="pt-4 border-t border-neo-line/40 mt-4">
          <div className="p-2.5 rounded-2xl bg-neo-bg border border-neo-line/70 shadow-xs">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full group py-3 px-4 rounded-xl bg-neo-rice text-neo-sun border border-neo-sun/40 hover:bg-neo-sun hover:text-neo-rice hover:border-neo-sun font-heading font-semibold text-xs transition-all flex items-center justify-between cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Sign Out</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
