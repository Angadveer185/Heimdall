"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Building2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Filter,
  UserCheck,
} from "lucide-react";

export interface FullUserData {
  id: string;
  name: string;
  email: string;
  role: "DONOR" | "SHELTER_ADMIN" | "SUPER_ADMIN";
  phone?: string | null;
  profileImageUrl?: string | null;
  shelterId?: string | null;
  shelter?: {
    id: string;
    name: string;
  } | null;
  isReported: boolean;
  pledgesCompleted: number;
  pledgesExpired: number;
  createdAt: string;
  updatedAt?: string;
}

interface UserPoolCardProps {
  users: FullUserData[];
  onAddUser: () => void;
  onEditUser: (user: FullUserData) => void;
  onDeleteUser: (user: FullUserData) => void;
  onToggleReported: (user: FullUserData) => void;
}

export function UserPoolCard({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onToggleReported,
}: UserPoolCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Filter users based on search query, role, and reported status
  const filteredUsers = users.filter((user) => {
    // 1. Search Query Filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchName = user.name?.toLowerCase().includes(q);
      const matchEmail = user.email?.toLowerCase().includes(q);
      const matchPhone = user.phone?.toLowerCase().includes(q);
      const matchShelter = user.shelter?.name.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchShelter) {
        return false;
      }
    }

    // 2. Role Filter
    if (roleFilter !== "ALL" && user.role !== roleFilter) {
      return false;
    }

    // 3. Status Filter
    if (statusFilter === "REPORTED" && !user.isReported) {
      return false;
    }
    if (statusFilter === "ACTIVE" && user.isReported) {
      return false;
    }

    return true;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <span className="px-2 py-0.5 text-[10px] font-label bg-neo-sun/15 border border-neo-sun text-neo-sun font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <Shield className="w-3 h-3 text-neo-sun" />
            <span>Super Admin</span>
          </span>
        );
      case "SHELTER_ADMIN":
        return (
          <span className="px-2 py-0.5 text-[10px] font-label bg-amber-900/20 border border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
            <Building2 className="w-3 h-3 text-amber-500" />
            <span>Shelter Admin</span>
          </span>
        );
      case "DONOR":
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-label bg-neo-ash/10 border border-neo-line text-neo-ink font-semibold uppercase tracking-wider flex items-center gap-1 w-fit">
            <UserCheck className="w-3 h-3 text-neo-ash" />
            <span>Donor</span>
          </span>
        );
    }
  };

  return (
    <div className="border border-neo-line bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold">
                USER ROSTER DIRECTORY
              </span>
              <span className="px-2 py-0.5 text-[10px] font-label bg-neo-bg border border-neo-line text-neo-ink font-semibold">
                {users.length} TOTAL USERS
              </span>
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              User Accounts Directory
            </h2>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onAddUser}
          className="px-4 py-2.5 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neo-bg p-3 border border-neo-line">
        {/* Search Input */}
        <div className="relative sm:col-span-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neo-ash">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full bg-neo-rice border border-neo-line text-neo-ink pl-9 pr-3 py-2 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors placeholder:text-neo-ash/60"
          />
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neo-ash shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-neo-rice border border-neo-line text-neo-ink px-3 py-2 text-xs font-label uppercase focus:outline-none focus:border-neo-sun"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="DONOR">
              Donors ({users.filter((u) => u.role === "DONOR").length})
            </option>
            <option value="SHELTER_ADMIN">
              Shelter Admins ({users.filter((u) => u.role === "SHELTER_ADMIN").length})
            </option>
            <option value="SUPER_ADMIN">
              Super Admins ({users.filter((u) => u.role === "SUPER_ADMIN").length})
            </option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-neo-ash shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-neo-rice border border-neo-line text-neo-ink px-3 py-2 text-xs font-label uppercase focus:outline-none focus:border-neo-sun"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">
              Active Accounts ({users.filter((u) => !u.isReported).length})
            </option>
            <option value="REPORTED">
              Reported / Suspended ({users.filter((u) => u.isReported).length})
            </option>
          </select>
        </div>
      </div>

      {/* User Table / Empty State */}
      {filteredUsers.length === 0 ? (
        <div className="p-8 text-center bg-neo-bg border border-dashed border-neo-line space-y-3">
          <Users className="w-10 h-10 text-neo-ash/50 mx-auto" />
          <p className="font-heading font-semibold text-sm text-neo-ink">
            No matching user entries found
          </p>
          <p className="text-xs font-body text-neo-ash max-w-sm mx-auto">
            {searchQuery || roleFilter !== "ALL" || statusFilter !== "ALL"
              ? "Try adjusting your search terms or filter constraints."
              : "No user accounts have been created yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-neo-line bg-neo-bg">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-neo-rice border-b border-neo-line text-[10px] font-label text-neo-ash uppercase tracking-wider">
                <th className="py-3 px-4">User Info</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Shelter</th>
                <th className="py-3 px-4">Pledges</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neo-line/60 text-xs">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className={`hover:bg-neo-rice/60 transition-colors ${
                    u.isReported ? "bg-red-950/10" : ""
                  }`}
                >
                  {/* User Info (Avatar, Name, ID) */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 border border-neo-line bg-neo-rice text-neo-sun flex items-center justify-center overflow-hidden shrink-0 shadow-xs font-heading font-bold text-sm">
                        {u.profileImageUrl ? (
                          /* eslint-disable-next-next/no-img-element */
                          <img
                            src={u.profileImageUrl}
                            alt={u.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          u.name?.charAt(0) || "U"
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-heading font-semibold text-sm text-neo-ink">
                          {u.name}
                        </div>
                        <div className="text-[10px] font-label text-neo-ash">
                          ID: {u.id.substring(u.id.length - 6)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact (Email, Phone) */}
                  <td className="py-3 px-4 space-y-1">
                    <div className="flex items-center gap-1.5 font-body text-neo-ink text-xs">
                      <Mail className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                      <span className="truncate max-w-[180px]">{u.email}</span>
                    </div>
                    {u.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] font-label text-neo-ash">
                        <Phone className="w-3 h-3 text-neo-ash shrink-0" />
                        <span>{u.phone}</span>
                      </div>
                    )}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4">{getRoleBadge(u.role)}</td>

                  {/* Shelter */}
                  <td className="py-3 px-4">
                    {u.shelter ? (
                      <div className="flex items-center gap-1.5 text-xs font-body text-neo-ink">
                        <Building2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate max-w-[140px]" title={u.shelter.name}>
                          {u.shelter.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-label text-neo-ash italic">
                        Unattached
                      </span>
                    )}
                  </td>

                  {/* Pledge Stats */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-[11px] font-label">
                      <span
                        className="px-1.5 py-0.5 border border-emerald-500/30 bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                        title="Pledges Completed"
                      >
                        ✓ {u.pledgesCompleted}
                      </span>
                      {u.pledgesExpired > 0 && (
                        <span
                          className="px-1.5 py-0.5 border border-red-500/30 bg-red-900/10 text-red-600 dark:text-red-400 font-semibold"
                          title="Pledges Expired"
                        >
                          ✕ {u.pledgesExpired}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status (Reported / Active) */}
                  <td className="py-3 px-4">
                    {u.isReported ? (
                      <span className="px-2 py-0.5 text-[10px] font-label bg-red-900/20 border border-red-500/40 text-red-500 font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span>Reported</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-label bg-emerald-900/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Active</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Flag / Unflag Reported Status */}
                      <button
                        onClick={() => onToggleReported(u)}
                        className={`p-1.5 text-xs font-label border transition-all ${
                          u.isReported
                            ? "bg-emerald-900/20 border-emerald-500/40 text-emerald-500 hover:bg-emerald-900/40"
                            : "bg-neo-rice border-neo-line text-neo-ash hover:border-neo-sun hover:text-neo-sun"
                        }`}
                        title={
                          u.isReported ? "Unflag / Clear Reported Status" : "Flag as Reported"
                        }
                      >
                        {u.isReported ? (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Edit User */}
                      <button
                        onClick={() => onEditUser(u)}
                        className="p-1.5 text-xs font-label bg-neo-rice border border-neo-line text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all"
                        title="Edit User Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete User */}
                      <button
                        onClick={() => onDeleteUser(u)}
                        className="p-1.5 text-xs font-label bg-neo-rice border border-neo-line text-neo-sun/80 hover:bg-neo-sun hover:text-neo-rice hover:border-neo-sun transition-all"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
