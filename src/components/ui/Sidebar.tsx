"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserData, useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  LayoutDashboard,
  HeartHandshake,
  Shield,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Users as UsersIcon,
  FolderTree,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/components/theme/theme-context";

interface SidebarProps {
  user: UserData;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const clearUser = useUserStore((state) => state.clearUser);
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(true);

  const router = useRouter();

  // Auto-expand admin sub-menu if current route is under /admin
  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setAdminMenuOpen(true);
    }
  }, [pathname]);

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
  const isShelterAdmin = user.role === "SHELTER_ADMIN" || isSuperAdmin;

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-neo-rice border-b border-neo-line px-4 py-3 flex items-center justify-between z-30 shrink-0 text-neo-ink transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.history.back();
              setMobileOpen(false);
            }}
            className="p-1.5 border border-neo-line bg-neo-bg text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-neo-sun" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border border-neo-line bg-neo-bg text-neo-sun flex items-center justify-center font-heading font-bold text-xs uppercase shadow-sm">
              {user.name ? user.name.charAt(0) : "U"}
            </div>
            <span className="font-heading font-semibold text-sm truncate max-w-[140px] text-neo-ink">
              {user.name}
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 border border-neo-line bg-neo-bg text-neo-ink hover:border-neo-sun"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-neo-sun" />
          ) : (
            <Menu className="w-5 h-5 text-neo-sun" />
          )}
        </button>
      </div>

      {/* Universal Left Sidebar Container */}
      <aside
        className={`${
          mobileOpen ? "flex" : "hidden"
        } md:flex flex-col justify-between w-full md:w-64 lg:w-72 bg-neo-rice text-neo-ink border-r border-neo-line p-5 h-auto md:h-full shrink-0 z-20 overflow-y-auto transition-colors duration-200`}
      >
        {/* Top Area: Logo Header & User Profile Header */}
        <div className="space-y-6">
          {/* Back Button & Logo Header */}
          <div className="flex items-center justify-between border-b border-neo-line pb-4">
            <button
              onClick={() => {
                window.history.back();
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 p-2 border border-neo-line bg-neo-bg hover:border-neo-sun hover:text-neo-sun transition-all text-xs font-label uppercase tracking-wider text-neo-ink cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-neo-sun" />
            </button>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 border border-neo-line bg-neo-rice text-neo-ink cursor-pointer"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4 text-neo-sun" />
                ) : (
                  <Sun className="w-4 h-4 text-neo-sun" />
                )}
              </button>
              <Link
                href="/"
                className="p-2 border border-neo-line text-neo-sun bg-neo-bg hover:border-neo-sun hover:text-neo-sun transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-neo-sun" />
              </Link>
            </div>
          </div>

          {/* User Profile Card Summary */}
          <div className="p-3.5 bg-neo-bg border border-neo-line flex items-center gap-3">
            <div className="w-10 h-10 border border-neo-line bg-neo-rice text-neo-sun flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {user.profileImageUrl ? (
                /* eslint-disable-next-next/no-img-element */
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-heading font-bold text-base uppercase text-neo-sun">
                  {user.name ? user.name.charAt(0) : "U"}
                </span>
              )}
            </div>

            <div className="space-y-0.5 overflow-hidden">
              <h3 className="font-heading font-semibold text-sm text-neo-ink truncate">
                {user.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-label px-1.5 py-0.5 border uppercase font-semibold ${
                    isSuperAdmin
                      ? "bg-neo-sun/15 border-neo-sun text-neo-sun font-bold"
                      : isShelterAdmin
                        ? "bg-amber-900/20 border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold"
                        : "bg-neo-ash/10 border-neo-line text-neo-ash"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Role-Aware Navigation Menu */}
          <nav className="space-y-1 pt-1">
            <span className="text-[10px] font-label text-neo-ash uppercase tracking-widest px-2 block mb-2 font-bold">
              NAVIGATION MENU
            </span>

            {/* Profile Dossier Link */}
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-label uppercase tracking-wider transition-all border ${
                pathname === "/profile"
                  ? "bg-neo-sun/15 text-neo-sun border-neo-sun font-semibold"
                  : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line"
              }`}
            >
              <User
                className={`w-4 h-4 ${pathname === "/profile" ? "text-neo-sun" : "text-neo-ash"}`}
              />
              <span>Profile Dossier</span>
            </Link>

            {/* Overview / Home */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-label uppercase tracking-wider transition-all border ${
                pathname === "/"
                  ? "bg-neo-sun/15 text-neo-sun border-neo-sun font-semibold"
                  : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line"
              }`}
            >
              <LayoutDashboard
                className={`w-4 h-4 ${pathname === "/" ? "text-neo-sun" : "text-neo-ash"}`}
              />
              <span>Overview</span>
            </Link>

            {/* SHELTER ADMIN ROUTE */}
            {isShelterAdmin && (
              <Link
                href="/shelter/manage"
                onClick={() => setMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-label uppercase tracking-wider transition-all border ${
                  pathname.startsWith("/shelter/manage")
                    ? "bg-amber-900/20 text-amber-500 border-amber-500/50 font-semibold"
                    : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line"
                }`}
              >
                <Building2
                  className={`w-4 h-4 ${pathname.startsWith("/shelter/manage") ? "text-amber-500" : "text-neo-ash"}`}
                />
                <span>My Shelter Console</span>
              </Link>
            )}

            {/* SUPER ADMIN NESTED ACCORDION ROUTE GROUP */}
            {isSuperAdmin && (
              <div className="pt-3 space-y-1">
                {/* Accordion Parent Toggle Button */}
                <button
                  type="button"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-label uppercase tracking-wider transition-all border ${
                    pathname.startsWith("/admin")
                      ? "bg-neo-sun/10 text-neo-sun border-neo-sun/50 font-bold"
                      : "text-neo-ink bg-neo-bg/60 border-neo-line hover:border-neo-sun"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-neo-sun" />
                    <span>Admin Control Center</span>
                  </div>
                  {adminMenuOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-neo-sun" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-neo-ash" />
                  )}
                </button>

                {/* Nested Sub-routes */}
                {adminMenuOpen && (
                  <div className="pl-3 space-y-1 border-l-2 border-neo-sun/40 ml-3 pt-1">
                    {/* Admin Dashboard */}
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-label uppercase tracking-wider transition-all border ${
                        pathname === "/admin"
                          ? "bg-neo-sun text-neo-rice border-neo-sun font-bold"
                          : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Overview Panel</span>
                    </Link>

                    {/* /admin/users -> User Roster (ONLY) */}
                    <Link
                      href="/admin/users"
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-label uppercase tracking-wider transition-all border ${
                        pathname.startsWith("/admin/users")
                          ? "bg-neo-sun text-neo-rice border-neo-sun font-bold"
                          : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line"
                      }`}
                    >
                      <UsersIcon className="w-3.5 h-3.5" />
                      <span>User Roster</span>
                    </Link>

                    {/* /admin/pools -> Catalog Pools (ONLY) */}
                    <Link
                      href="/admin/pools"
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-label uppercase tracking-wider transition-all border ${
                        pathname.startsWith("/admin/pools")
                          ? "bg-neo-sun text-neo-rice border-neo-sun font-bold"
                          : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line"
                      }`}
                    >
                      <FolderTree className="w-3.5 h-3.5" />
                      <span>Catalog Pools</span>
                    </Link>

                    {/* /admin/shelter -> Shelter Registry (ONLY) */}
                    <Link
                      href="/admin/shelter"
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-label uppercase tracking-wider transition-all border ${
                        pathname.startsWith("/admin/shelter")
                          ? "bg-neo-sun text-neo-rice border-neo-sun font-bold"
                          : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Shelter Registry</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Area: Logout Button */}
        <div className="pt-6 border-t border-neo-line mt-6 md:mt-0">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-neo-rice text-neo-sun border border-neo-sun hover:bg-neo-sun hover:text-neo-rice font-label text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
