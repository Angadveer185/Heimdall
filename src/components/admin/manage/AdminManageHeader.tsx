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
  ShieldCheck,
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              Super Admin Command Center
            </div>
            <span className="px-3 py-1 text-xs font-heading font-semibold rounded-full bg-neo-gold/15 text-neo-gold border border-neo-gold/30">
              System Control Active
            </span>
          </div>

          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
            System Administration & Management
          </h1>
          <p className="text-xs font-body text-neo-ash max-w-2xl leading-relaxed">
            Manage system users across all roles (Donors, Shelter Admins, Super Admins) and standardize global catalog categories & items.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-xl bg-neo-rice border border-neo-line/60 text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all font-heading font-semibold text-xs flex items-center gap-2 disabled:opacity-50 shadow-sm cursor-pointer"
            title="Refresh All System Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neo-sun ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh System Data</span>
          </button>
        </div>
      </div>

      {/* Metric Counters & View Tabs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total Users Roster */}
        <div
          onClick={() => onTabChange("USERS")}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
            activeTab === "USERS"
              ? "bg-neo-rice border-neo-sun shadow-md"
              : "bg-neo-bg border-neo-line/60 hover:border-neo-sun/60"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
                User Roster
              </span>
              {reportedUserCount > 0 && (
                <span className="text-[10px] font-heading font-semibold bg-neo-sun/15 text-neo-sun border border-neo-sun/30 px-2 py-0.5 rounded-full">
                  {reportedUserCount} Flagged
                </span>
              )}
            </div>
            <div className="font-heading font-bold text-2xl text-neo-ink">
              {userCount}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-neo-sun/10 text-neo-sun border border-neo-sun/30 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2: Donors */}
        <div
          onClick={() => onTabChange("USERS")}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
            activeTab === "USERS"
              ? "bg-neo-rice border-neo-sun shadow-md"
              : "bg-neo-bg border-neo-line/60 hover:border-neo-sun/60"
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
              Registered Donors
            </span>
            <div className="font-heading font-bold text-2xl text-neo-ink">
              {donorCount}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-neo-ash/10 text-neo-ash border border-neo-line/60 shadow-sm">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3: Shelter Admins */}
        <div
          onClick={() => onTabChange("USERS")}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
            activeTab === "USERS"
              ? "bg-neo-rice border-neo-sun shadow-md"
              : "bg-neo-bg border-neo-line/60 hover:border-neo-sun/60"
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
              Shelter Admins
            </span>
            <div className="font-heading font-bold text-2xl text-neo-ink">
              {shelterAdminCount}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4: Global Categories & Items */}
        <div
          onClick={() => onTabChange("ALL")}
          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
            activeTab === "ALL" || activeTab === "CATEGORIES" || activeTab === "ITEMS"
              ? "bg-neo-rice border-neo-sun shadow-md"
              : "bg-neo-bg border-neo-line/60 hover:border-neo-sun/60"
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
              Catalog Pools
            </span>
            <div className="font-heading font-bold text-2xl text-neo-ink">
              {categoryCount} / {itemCount}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-neo-sun/10 text-neo-sun border border-neo-sun/30 shadow-sm">
            <FolderTree className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab Filter Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neo-line/40 pb-3">
        <button
          onClick={() => onTabChange("USERS")}
          className={`px-4 py-2 rounded-xl font-heading text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
            activeTab === "USERS"
              ? "bg-neo-sun text-neo-rice border-neo-sun shadow-md shadow-neo-sun/20"
              : "bg-neo-rice text-neo-ink border-neo-line/60 hover:border-neo-sun"
          }`}
        >
          User Accounts Roster ({userCount})
        </button>

        <button
          onClick={() => onTabChange("ALL")}
          className={`px-4 py-2 rounded-xl font-heading text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
            activeTab === "ALL"
              ? "bg-neo-sun text-neo-rice border-neo-sun shadow-md shadow-neo-sun/20"
              : "bg-neo-rice text-neo-ink border-neo-line/60 hover:border-neo-sun"
          }`}
        >
          All Catalog Pools
        </button>

        <button
          onClick={() => onTabChange("CATEGORIES")}
          className={`px-4 py-2 rounded-xl font-heading text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
            activeTab === "CATEGORIES"
              ? "bg-neo-sun text-neo-rice border-neo-sun shadow-md shadow-neo-sun/20"
              : "bg-neo-rice text-neo-ink border-neo-line/60 hover:border-neo-sun"
          }`}
        >
          Categories Pool ({categoryCount})
        </button>

        <button
          onClick={() => onTabChange("ITEMS")}
          className={`px-4 py-2 rounded-xl font-heading text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
            activeTab === "ITEMS"
              ? "bg-neo-sun text-neo-rice border-neo-sun shadow-md shadow-neo-sun/20"
              : "bg-neo-rice text-neo-ink border-neo-line/60 hover:border-neo-sun"
          }`}
        >
          Global Items Pool ({itemCount})
        </button>
      </div>
    </div>
  );
}
