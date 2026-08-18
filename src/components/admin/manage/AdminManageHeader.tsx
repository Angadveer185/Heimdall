"use client";

import React from "react";
import {
  Users,
  FolderTree,
  Package,
  RefreshCw,
  Layers,
  Shield,
  Building2,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

export type AdminViewTab = "USERS" | "ALL" | "CATEGORIES" | "ITEMS";

interface AdminManageHeaderProps {
  userCount: number;
  donorCount: number;
  shelterAdminCount: number;
  superAdminCount: number;
  reportedUserCount: number;
  categoryCount: number;
  itemCount: number;
  uncategorizedCount: number;
  activeTab: AdminViewTab;
  isRefreshing: boolean;
  onTabChange: (tab: AdminViewTab) => void;
  onRefresh: () => void;
}

export function AdminManageHeader({
  userCount,
  donorCount,
  shelterAdminCount,
  superAdminCount,
  reportedUserCount,
  categoryCount,
  itemCount,
  uncategorizedCount,
  activeTab,
  isRefreshing,
  onTabChange,
  onRefresh,
}: AdminManageHeaderProps) {
  return (
    <div className="space-y-6">

      {/* Main Banner Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neo-line pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold">
              SUPER ADMIN // CONTROL CENTER
            </span>
            <span className="px-2 py-0.5 text-[10px] font-label bg-neo-sun/10 text-neo-sun border border-neo-sun/30 font-semibold">
              CRUD ACTIVE
            </span>
          </div>

          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
            System Administration & Management
          </h1>
          <p className="text-xs font-body text-neo-ash max-w-2xl">
            Manage system users across all roles (Donors, Shelter Admins, Super Admins) and standardize global catalog categories & items.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-neo-rice border border-neo-line text-neo-ink hover:border-neo-sun transition-all font-label text-xs uppercase flex items-center gap-2 disabled:opacity-50"
            title="Refresh All System Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neo-sun ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metric Counters & View Tabs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total Users Roster */}
        <div
          onClick={() => onTabChange("USERS")}
          className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
            activeTab === "USERS"
              ? "bg-neo-rice border-neo-sun shadow-sm"
              : "bg-neo-bg border-neo-line hover:border-neo-sun/60"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-label tracking-wider text-neo-ash uppercase block font-bold">
                USER ROSTER
              </span>
              {reportedUserCount > 0 && (
                <span className="text-[9px] font-label bg-red-900/20 text-red-500 border border-red-500/30 px-1 py-0.2 font-bold">
                  {reportedUserCount} Flagged
                </span>
              )}
            </div>
            <div className="font-heading font-bold text-2xl text-neo-ink">
              {userCount}
            </div>
          </div>
          <div className="p-2.5 bg-neo-sun/10 text-neo-sun border border-neo-sun/30">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Donors */}
        <div
          onClick={() => onTabChange("USERS")}
          className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
            activeTab === "USERS"
              ? "bg-neo-rice border-neo-sun shadow-sm"
              : "bg-neo-bg border-neo-line hover:border-neo-sun/60"
          }`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-label tracking-wider text-neo-ash uppercase block font-bold">
              REGISTERED DONORS
            </span>
            <div className="font-heading font-bold text-2xl text-neo-ink">
              {donorCount}
            </div>
          </div>
          <div className="p-2.5 bg-neo-ash/10 text-neo-ash border border-neo-line">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Shelter Admins */}
        <div
          onClick={() => onTabChange("USERS")}
          className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
            activeTab === "USERS"
              ? "bg-neo-rice border-neo-sun shadow-sm"
              : "bg-neo-bg border-neo-line hover:border-neo-sun/60"
          }`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-label tracking-wider text-neo-ash uppercase block font-bold">
              SHELTER ADMINS
            </span>
            <div className="font-heading font-bold text-2xl text-neo-ink">
              {shelterAdminCount}
            </div>
          </div>
          <div className="p-2.5 bg-amber-900/20 text-amber-500 border border-amber-500/40">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Global Categories & Items */}
        <div
          onClick={() => onTabChange("ALL")}
          className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
            activeTab === "ALL" || activeTab === "CATEGORIES" || activeTab === "ITEMS"
              ? "bg-neo-rice border-neo-sun shadow-sm"
              : "bg-neo-bg border-neo-line hover:border-neo-sun/60"
          }`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-label tracking-wider text-neo-ash uppercase block font-bold">
              CATALOG POOLS
            </span>
            <div className="font-heading font-bold text-2xl text-neo-ink">
              {categoryCount} / {itemCount}
            </div>
          </div>
          <div className="p-2.5 bg-neo-sun/10 text-neo-sun border border-neo-sun/30">
            <FolderTree className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab Filter Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neo-line pb-3">
        <button
          onClick={() => onTabChange("USERS")}
          className={`px-4 py-2 font-label text-xs uppercase tracking-wider transition-all border ${
            activeTab === "USERS"
              ? "bg-neo-sun text-neo-rice border-neo-sun font-bold shadow-xs"
              : "bg-neo-rice text-neo-ink border-neo-line hover:border-neo-sun"
          }`}
        >
          User Accounts Roster ({userCount})
        </button>

        <button
          onClick={() => onTabChange("ALL")}
          className={`px-4 py-2 font-label text-xs uppercase tracking-wider transition-all border ${
            activeTab === "ALL"
              ? "bg-neo-sun text-neo-rice border-neo-sun font-bold shadow-xs"
              : "bg-neo-rice text-neo-ink border-neo-line hover:border-neo-sun"
          }`}
        >
          All Catalog Pools
        </button>

        <button
          onClick={() => onTabChange("CATEGORIES")}
          className={`px-4 py-2 font-label text-xs uppercase tracking-wider transition-all border ${
            activeTab === "CATEGORIES"
              ? "bg-neo-sun text-neo-rice border-neo-sun font-bold shadow-xs"
              : "bg-neo-rice text-neo-ink border-neo-line hover:border-neo-sun"
          }`}
        >
          Categories Pool ({categoryCount})
        </button>

        <button
          onClick={() => onTabChange("ITEMS")}
          className={`px-4 py-2 font-label text-xs uppercase tracking-wider transition-all border ${
            activeTab === "ITEMS"
              ? "bg-neo-sun text-neo-rice border-neo-sun font-bold shadow-xs"
              : "bg-neo-rice text-neo-ink border-neo-line hover:border-neo-sun"
          }`}
        >
          Global Items Pool ({itemCount})
        </button>
      </div>
    </div>
  );
}

