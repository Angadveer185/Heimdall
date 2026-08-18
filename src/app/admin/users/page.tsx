"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import { UserPoolCard, FullUserData } from "@/components/admin/manage/UserPoolCard";
import { UserFormModal } from "@/components/admin/manage/UserFormModal";
import { DeleteConfirmModal } from "@/components/admin/manage/DeleteConfirmModal";
import {
  ShieldAlert,
  ShieldCheck,
  LogIn,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Users,
  RefreshCw,
  UserCheck,
  Building2,
  Shield,
} from "lucide-react";

export default function AdminUsersPage() {
  const user = useUserStore((state) => state.user);

  // User Roster State
  const [users, setUsers] = useState<FullUserData[]>([]);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // User Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<FullUserData | null>(null);

  // Delete Target Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "User";
    id: string;
    title: string;
    warningMessage?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Users Roster ONLY
  const fetchUserData = useCallback(async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    setFetchError(null);

    try {
      const res = await fetch("/api/users", { credentials: "include" });
      const data = await res.json();

      if (res.ok && data.success) {
        setUsers(data.data || []);
      } else {
        throw new Error(data.message || "Failed to load user roster");
      }
    } catch (err: unknown) {
      console.error("Error fetching user roster:", err);
      const msg = err instanceof Error ? err.message : "Failed to load user roster";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "SUPER_ADMIN") {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchUserData]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // User CRUD Handlers
  const handleOpenAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u: FullUserData) => {
    setEditingUser(u);
    setIsUserModalOpen(true);
  };

  const handleOpenDeleteUser = (u: FullUserData) => {
    let warning: string | undefined;
    if (u.id === user?.id) {
      warning = "Caution: You are attempting to delete your own Super Admin account!";
    }

    setDeleteTarget({
      type: "User",
      id: u.id,
      title: `${u.name} (${u.email})`,
      warningMessage: warning,
    });
  };

  const handleToggleReportedUser = async (u: FullUserData) => {
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isReported: !u.isReported }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update user reported status.");
      }

      showNotification(
        "success",
        `User "${u.name}" was ${!u.isReported ? "flagged as reported" : "cleared from reported status"}.`
      );
      fetchUserData();
    } catch (err: unknown) {
      console.error("Reported toggle error:", err);
      const msg = err instanceof Error ? err.message : "Failed to toggle reported status";
      showNotification("error", msg);
    }
  };

  // Confirm Delete User
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete user account.");
      }

      showNotification(
        "success",
        `User account "${deleteTarget.title}" was successfully deleted.`
      );

      setDeleteTarget(null);
      fetchUserData();
    } catch (err: unknown) {
      console.error("Delete user error:", err);
      const msg = err instanceof Error ? err.message : "Failed to delete user account";
      showNotification("error", msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Guard Screens
  if (!user) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border border-neo-line bg-neo-rice p-8 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 border-2 border-neo-line bg-neo-bg text-neo-sun flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-label tracking-widest text-neo-ash uppercase">
              AUTHENTICATION REQUIRED // USER DIRECTORY
            </span>
            <h1 className="font-heading font-bold text-2xl text-neo-ink">
              Access Restricted
            </h1>
            <p className="text-xs font-body text-neo-ash">
              Please sign in with a Super Admin account to access user directory management.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as Super Admin</span>
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 bg-neo-bg text-neo-ink font-label text-xs uppercase border border-neo-line hover:border-neo-sun transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "SUPER_ADMIN") {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border-2 border-neo-sun/60 bg-neo-rice p-8 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 border-2 border-neo-sun bg-neo-sun/10 text-neo-sun flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold">
              PRIVILEGE MISMATCH // ACCESS DENIED
            </span>
            <h1 className="font-heading font-bold text-2xl text-neo-ink">
              Super Admin Privileges Required
            </h1>
            <p className="text-xs font-body text-neo-ash">
              Your account current role (<strong>{user.role}</strong>) does not have authorization to view and manage user rosters.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/profile"
              className="w-full py-3 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Your Profile</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const donorCount = users.filter((u) => u.role === "DONOR").length;
  const shelterAdminCount = users.filter((u) => u.role === "SHELTER_ADMIN").length;
  const superAdminCount = users.filter((u) => u.role === "SUPER_ADMIN").length;
  const reportedUserCount = users.filter((u) => u.isReported).length;

  return (
    <div className="h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink flex flex-col md:flex-row">
      <Sidebar user={user} />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-neo-bg">
        {notification && (
          <div
            className={`px-6 py-3 text-xs font-label flex items-center justify-between border-b shrink-0 ${
              notification.type === "success"
                ? "bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
                : "bg-red-900/20 text-red-600 dark:text-red-400 border-red-500/40"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs uppercase font-bold tracking-wider hover:opacity-75"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header Banner */}
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neo-line pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold">
                    SUPER ADMIN // USER DIRECTORY
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-label bg-neo-sun/10 text-neo-sun border border-neo-sun/30 font-semibold">
                    CRUD ACTIVE
                  </span>
                </div>

                <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
                  User Accounts Directory Management
                </h1>
                <p className="text-xs font-body text-neo-ash max-w-2xl">
                  Manage registered users across all roles (Donors, Shelter Admins, Super Admins), perform profile edits, and flag reported accounts.
                </p>
              </div>

              <button
                onClick={() => fetchUserData(true)}
                disabled={isRefreshing}
                className="px-3.5 py-2 bg-neo-rice border border-neo-line text-neo-ink hover:border-neo-sun transition-all font-label text-xs uppercase flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-neo-sun ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh Directory</span>
              </button>
            </div>

            {/* User Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-neo-rice border border-neo-sun flex items-center justify-between shadow-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-label tracking-wider text-neo-ash uppercase block font-bold">
                    TOTAL REGISTERED USERS
                  </span>
                  <div className="font-heading font-bold text-2xl text-neo-ink">
                    {users.length}
                  </div>
                </div>
                <div className="p-2.5 bg-neo-sun/10 text-neo-sun border border-neo-sun/30">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3.5 bg-neo-bg border border-neo-line flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-label tracking-wider text-neo-ash uppercase block font-bold">
                    DONORS
                  </span>
                  <div className="font-heading font-bold text-2xl text-neo-ink">
                    {donorCount}
                  </div>
                </div>
                <div className="p-2.5 bg-neo-ash/10 text-neo-ash border border-neo-line">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="p-3.5 bg-neo-bg border border-neo-line flex items-center justify-between">
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

              <div className="p-3.5 bg-neo-bg border border-neo-line flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-label tracking-wider text-neo-ash uppercase block font-bold">
                    SUPER ADMINS
                  </span>
                  <div className="font-heading font-bold text-2xl text-neo-ink">
                    {superAdminCount}
                  </div>
                </div>
                <div className="p-2.5 bg-neo-sun/15 text-neo-sun border border-neo-sun">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* User Pool Table */}
          {isLoading ? (
            <div className="p-12 text-center bg-neo-rice border border-neo-line space-y-3">
              <Loader2 className="w-8 h-8 text-neo-sun animate-spin mx-auto" />
              <p className="font-heading font-semibold text-sm text-neo-ink">
                Loading User Directory...
              </p>
            </div>
          ) : fetchError ? (
            <div className="p-6 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun space-y-3">
              <div className="flex items-center gap-2 font-heading font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Failed to Sync User Directory</span>
              </div>
              <p className="text-xs font-body text-neo-ink">{fetchError}</p>
              <button
                onClick={() => fetchUserData(true)}
                className="px-4 py-2 bg-neo-sun text-neo-rice font-label text-xs uppercase border border-neo-sun hover:bg-neo-sun/90 transition-all"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <UserPoolCard
              users={users}
              onAddUser={handleOpenAddUser}
              onEditUser={handleOpenEditUser}
              onDeleteUser={handleOpenDeleteUser}
              onToggleReported={handleToggleReportedUser}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <UserFormModal
        isOpen={isUserModalOpen}
        user={editingUser}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={() => {
          showNotification(
            "success",
            `User ${editingUser ? "updated" : "created"} successfully.`
          );
          fetchUserData();
        }}
      />

      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={Boolean(deleteTarget)}
          title={`Delete ${deleteTarget.type}`}
          itemTitle={deleteTarget.title}
          itemType={deleteTarget.type}
          warningMessage={deleteTarget.warningMessage}
          isDeleting={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
