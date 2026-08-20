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
        <div className="w-full max-w-md border border-neo-line/60 rounded-2xl bg-neo-rice p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl border border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide">
              <UserCheck className="w-3.5 h-3.5" />
              Authentication Required
            </div>
            <h1 className="font-heading font-bold text-2xl text-neo-ink pt-1">
              Access Restricted
            </h1>
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              Please sign in with a Super Admin account to access user directory management.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as Super Admin</span>
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 bg-neo-bg text-neo-ink font-body text-xs rounded-xl border border-neo-line/60 hover:border-neo-sun transition-all flex items-center justify-center gap-1.5 shadow-sm"
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
        <div className="w-full max-w-md border border-neo-sun/30 rounded-2xl bg-neo-rice p-8 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-2xl border border-neo-sun/30 bg-neo-sun/10 text-neo-sun flex items-center justify-center mx-auto shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              Privilege Mismatch
            </div>
            <h1 className="font-heading font-bold text-2xl text-neo-ink pt-1">
              Super Admin Privileges Required
            </h1>
            <p className="text-xs font-body text-neo-ash leading-relaxed">
              Your account current role (<strong className="font-heading font-semibold text-neo-ink">{user.role}</strong>) does not have authorization to view and manage user rosters.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/profile"
              className="w-full py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20"
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

  return (
    <div className="h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink flex flex-col md:flex-row">
      <Sidebar user={user} />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-neo-bg">
        {notification && (
          <div
            className={`px-6 py-3 text-xs font-body flex items-center justify-between border-b shrink-0 ${
              notification.type === "success"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-neo-sun/15 text-neo-sun border-neo-sun/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-neo-sun shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-heading font-semibold uppercase hover:opacity-75 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header Banner */}
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide">
                    <UserCheck className="w-3.5 h-3.5" />
                    User Directory Management
                  </div>
                  <span className="px-3 py-1 text-xs font-heading font-semibold rounded-full bg-neo-gold/15 text-neo-gold border border-neo-gold/30">
                    System Roster
                  </span>
                </div>

                <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
                  User Accounts Directory Management
                </h1>
                <p className="text-xs font-body text-neo-ash max-w-2xl leading-relaxed">
                  Manage registered users across all roles (Donors, Shelter Admins, Super Admins), perform profile edits, and flag reported accounts.
                </p>
              </div>

              <button
                onClick={() => fetchUserData(true)}
                disabled={isRefreshing}
                className="px-4 py-2 rounded-xl bg-neo-rice border border-neo-line/60 text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all font-heading font-semibold text-xs flex items-center gap-2 disabled:opacity-50 shrink-0 shadow-sm cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-neo-sun ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh Directory</span>
              </button>
            </div>

            {/* User Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-neo-rice border border-neo-sun flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
                    Total Registered Users
                  </span>
                  <div className="font-heading font-bold text-2xl text-neo-ink">
                    {users.length}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neo-sun/10 text-neo-sun border border-neo-sun/30 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
                    Donors
                  </span>
                  <div className="font-heading font-bold text-2xl text-neo-ink">
                    {donorCount}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neo-ash/10 text-neo-ash border border-neo-line/60 shadow-sm">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-between shadow-sm">
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

              <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-between shadow-sm">
                <div className="space-y-1">
                  <span className="text-xs font-heading font-semibold text-neo-ash uppercase block">
                    Super Admins
                  </span>
                  <div className="font-heading font-bold text-2xl text-neo-ink">
                    {superAdminCount}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-neo-sun/15 text-neo-sun border border-neo-sun/30 shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* User Pool Table */}
          {isLoading ? (
            <div className="p-12 text-center rounded-2xl bg-neo-rice border border-neo-line/60 space-y-3 shadow-sm">
              <Loader2 className="w-8 h-8 text-neo-sun animate-spin mx-auto" />
              <p className="font-heading font-semibold text-sm text-neo-ink">
                Loading User Directory...
              </p>
            </div>
          ) : fetchError ? (
            <div className="p-6 rounded-2xl bg-neo-sun/15 border border-neo-sun/30 text-neo-sun space-y-3 shadow-sm">
              <div className="flex items-center gap-2 font-heading font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Failed to Sync User Directory</span>
              </div>
              <p className="text-xs font-body text-neo-ink">{fetchError}</p>
              <button
                onClick={() => fetchUserData(true)}
                className="px-4 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-md shadow-neo-sun/20 cursor-pointer"
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
