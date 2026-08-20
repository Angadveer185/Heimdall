"use client";

import React from "react";
import Link from "next/link";
import { UserData } from "@/store/useUserStore";
import {
  ShieldAlert,
  CheckSquare,
  Users,
  FolderTree,
  ArrowUpRight,
  Activity,
  Package,
} from "lucide-react";

interface AdminControlCardProps {
  user: UserData;
}

export function AdminControlCard({ user }: AdminControlCardProps) {
  return (
    <div className="border border-neo-sun/30 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-sun/30 bg-neo-sun/10 text-neo-sun shrink-0 shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide mb-1">
              System Governance & Control
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Super Admin Management Console
            </h2>
          </div>
        </div>

        <span className="px-3 py-1 text-xs font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30">
          Super Admin Privileges
        </span>
      </div>

      {/* Grid of Admin Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Tool 1: Global Catalog Pools */}
        <Link
          href="/admin/pools"
          className="group p-4 rounded-xl bg-neo-bg border border-neo-line/60 hover:border-neo-sun/60 transition-all space-y-2 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-xs font-heading text-neo-sun font-semibold">
            <span className="px-2 py-0.5 rounded-full bg-neo-sun/10 text-[10px]">CATALOG POOLS</span>
            <FolderTree className="w-4 h-4 text-neo-sun group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-heading font-semibold text-sm text-neo-ink group-hover:text-neo-sun transition-colors">
            Global Catalog Pools
          </h4>
          <p className="text-xs font-body text-neo-ash leading-relaxed">
            Manage global donation categories, icons, and standardized request item pools.
          </p>
        </Link>

        {/* Tool 2: Manage Users */}
        <Link
          href="/admin/users"
          className="group p-4 rounded-xl bg-neo-bg border border-neo-line/60 hover:border-neo-sun/60 transition-all space-y-2 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-xs font-heading text-neo-sun font-semibold">
            <span className="px-2 py-0.5 rounded-full bg-neo-sun/10 text-[10px]">USER ACCOUNTS</span>
            <Users className="w-4 h-4 text-neo-sun group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-heading font-semibold text-sm text-neo-ink group-hover:text-neo-sun transition-colors">
            Manage Users
          </h4>
          <p className="text-xs font-body text-neo-ash leading-relaxed">
            Inspect reported user accounts, role permissions, and access privileges.
          </p>
        </Link>

        {/* Tool 3: EIN Queue */}
        <Link
          href="/admin/shelters"
          className="group p-4 rounded-xl bg-neo-bg border border-neo-line/60 hover:border-neo-sun/60 transition-all space-y-2 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center justify-between text-xs font-heading text-neo-sun font-semibold">
            <span className="px-2 py-0.5 rounded-full bg-neo-sun/10 text-[10px]">SHELTERS</span>
            <CheckSquare className="w-4 h-4 text-neo-sun group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-heading font-semibold text-sm text-neo-ink group-hover:text-neo-sun transition-colors">
            Shelter EIN Approvals
          </h4>
          <p className="text-xs font-body text-neo-ash leading-relaxed">
            Review and approve 501(c)(3) nonprofit registration verification requests.
          </p>
        </Link>
      </div>

      {/* System Health Footer */}
      <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-neo-line/40">
        <div className="flex items-center gap-2 text-xs font-body text-neo-ash">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>System Services Active · Database connected</span>
        </div>

        <Link
          href="/admin/dashboard"
          className="px-4.5 py-2 rounded-xl bg-neo-sun/15 text-neo-sun font-heading font-semibold text-xs border border-neo-sun/30 hover:bg-neo-sun/25 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>Admin Portal</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
