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
    <div className="border border-neo-sun/40 bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neo-line pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 border border-neo-sun/40 bg-neo-sun/10 text-neo-sun dark:text-neo-sun shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-label tracking-widest text-neo-sun dark:text-neo-sun uppercase block">
              SYSTEM GOVERNANCE // ADMINISTRATOR
            </span>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Super Admin Management Console
            </h2>
          </div>
        </div>

        <span className="px-2.5 py-1 text-xs font-label bg-neo-sun/20 text-neo-sun dark:text-neo-sun border border-neo-sun/40 font-semibold">
          SUPER ADMIN PRIVILEGES
        </span>
      </div>

      {/* Grid of Admin Actions matching Wireframe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Tool 1: Manage Global Items */}
        <Link
          href="/admin/pools"
          className="group p-3.5 bg-neo-bg border border-neo-line hover:border-neo-sun/60 transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-label text-neo-sun dark:text-neo-sun font-semibold">
            <span>ITEMS</span>
            <Package className="w-4 h-4 text-neo-sun group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-heading font-semibold text-sm text-neo-ink group-hover:text-neo-sun dark:group-hover:text-neo-sun transition-colors">
            Manage Request Items
          </h4>
          <p className="text-[11px] font-body text-neo-ash">
            Manage standardized global items catalog, titles, and measurement units.
          </p>
        </Link>

        {/* Tool 2: Manage Categories */}
        <Link
          href="/admin/pools"
          className="group p-3.5 bg-neo-bg border border-neo-line hover:border-neo-sun/60 transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-label text-neo-sun dark:text-neo-sun font-semibold">
            <span>CATEGORIES</span>
            <FolderTree className="w-4 h-4 text-neo-sun group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-heading font-semibold text-sm text-neo-ink group-hover:text-neo-sun dark:group-hover:text-neo-sun transition-colors">
            Manage Categories
          </h4>
          <p className="text-[11px] font-body text-neo-ash">
            Create and edit global donation categories, icons, and descriptions.
          </p>
        </Link>

        {/* Tool 3: Manage Users */}
        <Link
          href="/admin/users"
          className="group p-3.5 bg-neo-bg border border-neo-line hover:border-neo-sun/60 transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-label text-neo-sun dark:text-neo-sun font-semibold">
            <span>USER ACCOUNTS</span>
            <Users className="w-4 h-4 text-neo-sun group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-heading font-semibold text-sm text-neo-ink group-hover:text-neo-sun dark:group-hover:text-neo-sun transition-colors">
            Manage Users
          </h4>
          <p className="text-[11px] font-body text-neo-ash">
            Inspect reported user accounts, role permissions, and access privileges.
          </p>
        </Link>

        {/* Tool 4: EIN Queue */}
        <Link
          href="/admin/verifications"
          className="group p-3.5 bg-neo-bg border border-neo-line hover:border-neo-sun/60 transition-all space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-label text-neo-sun dark:text-neo-sun font-semibold">
            <span>EIN VERIFICATION</span>
            <CheckSquare className="w-4 h-4 text-neo-sun group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="font-heading font-semibold text-sm text-neo-ink group-hover:text-neo-sun dark:group-hover:text-neo-sun transition-colors">
            Shelter EIN Approvals
          </h4>
          <p className="text-[11px] font-body text-neo-ash">
            Review and approve 501(c)(3) nonprofit registration verification requests.
          </p>
        </Link>
      </div>

      {/* System Health Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neo-line">
        <div className="flex items-center gap-2 text-xs font-label text-neo-ash">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>System Services Active // Database connected</span>
        </div>

        <Link
          href="/admin/dashboard"
          className="px-4 py-2 bg-neo-sun/30 text-neo-sun dark:text-neo-sun font-label text-xs uppercase tracking-wider border border-neo-sun/40 hover:bg-neo-sun/50 transition-all flex items-center gap-1.5"
        >
          <span>Admin Portal</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
