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
      <div className="md:hidden bg-neo-rice border-b border-neo-line/60 px-4 py-3 flex items-center justify-between z-30 shrink-0 text-neo-ink transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              window.history.back();
              setMobileOpen(false);
            }}
            className="p-2 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-neo-sun" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-neo-line/60 bg-gradient-to-br from-neo-gold to-neo-sun text-neo-night flex items-center justify-center font-heading font-bold text-xs shadow-sm">
              {user.name ? user.name.charAt(0) : "U"}
            </div>
            <span className="font-heading font-semibold text-sm truncate max-w-[140px] text-neo-ink">
              {user.name}
            </span>
          </div>
        </div>

        <button
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

      {/* Universal Left Sidebar Container */}
      <aside
        className={`${
          mobileOpen ? "flex" : "hidden"
        } md:flex flex-col justify-between w-full md:w-64 lg:w-72 bg-neo-rice text-neo-ink border-r border-neo-line/60 p-5 h-auto md:h-full shrink-0 z-20 overflow-y-auto transition-colors duration-200`}
      >
        {/* Top Area: Logo Header & User Profile Header */}
        <div className="space-y-6">
          {/* Back Button & Logo Header */}
          <div className="flex items-center justify-between border-b border-neo-line/40 pb-4">
            <button
              onClick={() => {
                window.history.back();
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neo-line/60 bg-neo-bg hover:border-neo-sun hover:text-neo-sun transition-all text-xs font-heading font-semibold text-neo-ink cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-neo-sun" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full border border-neo-line/60 bg-neo-rice text-neo-ink hover:shadow transition-all cursor-pointer"
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
                className="p-2.5 rounded-full border border-neo-line/60 text-neo-sun bg-neo-bg hover:border-neo-sun hover:shadow transition-all flex items-center justify-center"
              >
                <ShieldCheck className="w-4 h-4 text-neo-sun" />
              </Link>
            </div>
          </div>

          {/* User Profile Card Summary */}
          <div className="p-3.5 rounded-2xl bg-neo-bg border border-neo-line/60 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full border border-neo-line/60 bg-neo-rice text-neo-sun flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
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

            <div className="space-y-1 overflow-hidden">
              <h3 className="font-heading font-semibold text-sm text-neo-ink truncate">
                {user.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-body px-2.5 py-0.5 rounded-full border uppercase font-medium ${
                    isSuperAdmin
                      ? "bg-neo-sun/15 border-neo-sun/30 text-neo-sun font-semibold"
                      : isShelterAdmin
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold"
                        : "bg-neo-ash/15 border-neo-line/60 text-neo-ash"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Role-Aware Navigation Menu */}
          <nav className="space-y-1.5 pt-1">
            <span className="text-[10px] font-heading text-neo-ash uppercase tracking-wider px-2 block mb-2 font-bold">
              Navigation Menu
            </span>

            {/* Profile Dossier Link */}
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-heading font-semibold rounded-xl transition-all border ${
                pathname === "/profile"
                  ? "bg-neo-sun/15 text-neo-sun border-neo-sun/30 shadow-sm"
                  : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line/60"
              }`}
            >
              <User
                className={`w-4 h-4 ${pathname === "/profile" ? "text-neo-sun" : "text-neo-ash"}`}
              />
              <span>Profile & Account</span>
            </Link>

            {/* Overview / Home */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-heading font-semibold rounded-xl transition-all border ${
                pathname === "/"
                  ? "bg-neo-sun/15 text-neo-sun border-neo-sun/30 shadow-sm"
                  : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line/60"
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-heading font-semibold rounded-xl transition-all border ${
                  pathname.startsWith("/shelter/manage")
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 shadow-sm"
                    : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line/60"
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
              <div className="pt-2 space-y-1.5">
                {/* Accordion Parent Toggle Button */}
                <button
                  type="button"
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-heading font-semibold rounded-xl transition-all border ${
                    pathname.startsWith("/admin")
                      ? "bg-neo-sun/10 text-neo-sun border-neo-sun/30 shadow-sm"
                      : "text-neo-ink bg-neo-bg/60 border-neo-line/60 hover:border-neo-sun"
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
                  <div className="pl-3.5 space-y-1 border-l-2 border-neo-sun/30 ml-3.5 pt-1">
                    {/* Admin Dashboard */}
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-heading font-semibold rounded-lg transition-all border ${
                        pathname === "/admin"
                          ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm"
                          : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line/60"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Overview Panel</span>
                    </Link>

                    {/* /admin/users -> User Roster */}
                    <Link
                      href="/admin/users"
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-heading font-semibold rounded-lg transition-all border ${
                        pathname.startsWith("/admin/users")
                          ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm"
                          : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line/60"
                      }`}
                    >
                      <UsersIcon className="w-3.5 h-3.5" />
                      <span>User Roster</span>
                    </Link>

                    {/* /admin/pools -> Catalog Pools */}
                    <Link
                      href="/admin/pools"
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-heading font-semibold rounded-lg transition-all border ${
                        pathname.startsWith("/admin/pools")
                          ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm"
                          : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line/60"
                      }`}
                    >
                      <FolderTree className="w-3.5 h-3.5" />
                      <span>Catalog Pools</span>
                    </Link>

                    {/* /admin/shelters -> Shelter Registry */}
                    <Link
                      href="/admin/shelters"
                      onClick={() => setMobileOpen(false)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-heading font-semibold rounded-lg transition-all border ${
                        pathname.startsWith("/admin/shelters")
                          ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm"
                          : "text-neo-ink border-transparent hover:bg-neo-bg hover:text-neo-sun hover:border-neo-line/60"
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
        <div className="pt-6 border-t border-neo-line/40 mt-6 md:mt-0">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-xl bg-neo-rice text-neo-sun border border-neo-sun/40 hover:bg-neo-sun hover:text-neo-rice font-heading font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
