"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import { AdminManageHeader, AdminViewTab } from "@/components/admin/manage/AdminManageHeader";
import { UserPoolCard, FullUserData } from "@/components/admin/manage/UserPoolCard";
import { UserFormModal } from "@/components/admin/manage/UserFormModal";
import { CategoryPoolCard } from "@/components/admin/manage/CategoryPoolCard";
import { CategoryFormModal, CategoryData } from "@/components/admin/manage/CategoryFormModal";
import { GlobalItemPoolCard } from "@/components/admin/manage/GlobalItemPoolCard";
import { GlobalItemFormModal, GlobalItemData } from "@/components/admin/manage/GlobalItemFormModal";
import { DeleteConfirmModal } from "@/components/admin/manage/DeleteConfirmModal";
import {
  ShieldAlert,
  ShieldCheck,
  LogIn,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function AdminManagePage() {
  const user = useUserStore((state) => state.user);

  // System Data State
  const [users, setUsers] = useState<FullUserData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [globalItems, setGlobalItems] = useState<GlobalItemData[]>([]);
  const [activeTab, setActiveTab] = useState<AdminViewTab>("USERS");

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

  // Category Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  // Global Item Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GlobalItemData | null>(null);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "User" | "Category" | "Global Item";
    id: string;
    title: string;
    warningMessage?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all admin data (Users, Categories, Global Items)
  const fetchAdminData = useCallback(async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    setFetchError(null);

    try {
      const [userRes, catRes, itemRes] = await Promise.all([
        fetch("/api/users", { credentials: "include" }),
        fetch("/api/categories", { credentials: "include" }),
        fetch("/api/global-items", { credentials: "include" }),
      ]);

      const userData = await userRes.json();
      const catData = await catRes.json();
      const itemData = await itemRes.json();

      if (userRes.ok && userData.success) {
        setUsers(userData.data || []);
      } else {
        throw new Error(userData.message || "Failed to load user roster");
      }

      if (catRes.ok && catData.success) {
        setCategories(catData.data || []);
      } else {
        throw new Error(catData.message || "Failed to load categories");
      }

      if (itemRes.ok && itemData.success) {
        setGlobalItems(itemData.data || []);
      } else {
        throw new Error(itemData.message || "Failed to load global items");
      }
    } catch (err: unknown) {
      console.error("Error fetching admin data:", err);
      const msg = err instanceof Error ? err.message : "Failed to load system data";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "SUPER_ADMIN") {
      fetchAdminData();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchAdminData]);

  // Show transient notification toast/banner
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
      fetchAdminData();
    } catch (err: unknown) {
      console.error("Reported toggle error:", err);
      const msg = err instanceof Error ? err.message : "Failed to toggle reported status";
      showNotification("error", msg);
    }
  };

  // Category CRUD Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: CategoryData) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleOpenDeleteCategory = (cat: CategoryData) => {
    const itemCount = cat.items?.length || 0;
    let warning: string | undefined;
    if (itemCount > 0) {
      warning = `This category currently has ${itemCount} global item(s) associated with it. Deleting this category will leave those items uncategorized.`;
    }

    setDeleteTarget({
      type: "Category",
      id: cat.id,
      title: cat.name,
      warningMessage: warning,
    });
  };

  // Global Item CRUD Handlers
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: GlobalItemData) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleOpenDeleteItem = (item: GlobalItemData) => {
    setDeleteTarget({
      type: "Global Item",
      id: item.id,
      title: item.title,
    });
  };

  // Execute Deletion
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      let endpoint = "";
      if (deleteTarget.type === "User") {
        endpoint = `/api/users/${deleteTarget.id}`;
      } else if (deleteTarget.type === "Category") {
        endpoint = `/api/categories/${deleteTarget.id}`;
      } else {
        endpoint = `/api/global-items/${deleteTarget.id}`;
      }

      const res = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to delete ${deleteTarget.type}`);
      }

      showNotification(
        "success",
        `${deleteTarget.type} "${deleteTarget.title}" was successfully deleted.`
      );

      setDeleteTarget(null);
      fetchAdminData();
    } catch (err: unknown) {
      console.error("Delete error:", err);
      const msg =
        err instanceof Error ? err.message : `Failed to delete ${deleteTarget.type}`;
      showNotification("error", msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Unauthenticated Guard Screen
  if (!user) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink">
        <div className="w-full max-w-md border border-neo-line bg-neo-rice p-8 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 border-2 border-neo-line bg-neo-bg text-neo-sun flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-label tracking-widest text-neo-ash uppercase">
              AUTHENTICATION REQUIRED // ADMIN POOL
            </span>
            <h1 className="font-heading font-bold text-2xl text-neo-ink">
              Access Restricted
            </h1>
            <p className="text-xs font-body text-neo-ash">
              Please sign in with a Super Admin account to access system administration tools.
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

  // Non-SuperAdmin Guard Screen
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
              Your account current role (<strong>{user.role}</strong>) does not have authorization to perform CRUD operations on user rosters and global catalogs.
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

  const uncategorizedItemsCount = globalItems.filter(
    (item) => !item.categoryId && !item.category?.id
  ).length;

  return (
    <div className="h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink flex flex-col md:flex-row">
      {/* Universal Sidebar */}
      <Sidebar user={user} />

      {/* Main Workspace Pane */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-neo-bg">
        {/* Notification Toast Banner */}
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

        {/* Scrollable Inner Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header & Stats Banner */}
          <AdminManageHeader
            userCount={users.length}
            donorCount={donorCount}
            shelterAdminCount={shelterAdminCount}
            superAdminCount={superAdminCount}
            reportedUserCount={reportedUserCount}
            categoryCount={categories.length}
            itemCount={globalItems.length}
            uncategorizedCount={uncategorizedItemsCount}
            activeTab={activeTab}
            isRefreshing={isRefreshing}
            onTabChange={setActiveTab}
            onRefresh={() => fetchAdminData(true)}
          />

          {/* Initial Loading Indicator */}
          {isLoading ? (
            <div className="p-12 text-center bg-neo-rice border border-neo-line space-y-3">
              <Loader2 className="w-8 h-8 text-neo-sun animate-spin mx-auto" />
              <p className="font-heading font-semibold text-sm text-neo-ink">
                Loading System Records...
              </p>
              <p className="text-xs font-body text-neo-ash">
                Fetching user rosters, global categories, and catalog items from database.
              </p>
            </div>
          ) : fetchError ? (
            <div className="p-6 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun space-y-3">
              <div className="flex items-center gap-2 font-heading font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Failed to Sync System Records</span>
              </div>
              <p className="text-xs font-body text-neo-ink">{fetchError}</p>
              <button
                onClick={() => fetchAdminData(true)}
                className="px-4 py-2 bg-neo-sun text-neo-rice font-label text-xs uppercase border border-neo-sun hover:bg-neo-sun/90 transition-all"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Roster Pool Section */}
              {activeTab === "USERS" && (
                <UserPoolCard
                  users={users}
                  onAddUser={handleOpenAddUser}
                  onEditUser={handleOpenEditUser}
                  onDeleteUser={handleOpenDeleteUser}
                  onToggleReported={handleToggleReportedUser}
                />
              )}

              {/* Category Pool Section */}
              {(activeTab === "ALL" || activeTab === "CATEGORIES") && (
                <CategoryPoolCard
                  categories={categories}
                  onAddCategory={handleOpenAddCategory}
                  onEditCategory={handleOpenEditCategory}
                  onDeleteCategory={handleOpenDeleteCategory}
                />
              )}

              {/* Global Items Pool Section */}
              {(activeTab === "ALL" || activeTab === "ITEMS") && (
                <GlobalItemPoolCard
                  items={globalItems}
                  categories={categories}
                  onAddItem={handleOpenAddItem}
                  onEditItem={handleOpenEditItem}
                  onDeleteItem={handleOpenDeleteItem}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* User Create/Edit Modal */}
      <UserFormModal
        isOpen={isUserModalOpen}
        user={editingUser}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={() => {
          showNotification(
            "success",
            `User ${editingUser ? "updated" : "created"} successfully.`
          );
          fetchAdminData();
        }}
      />

      {/* Category Create/Edit Modal */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => {
          showNotification(
            "success",
            `Category ${editingCategory ? "updated" : "created"} successfully.`
          );
          fetchAdminData();
        }}
      />

      {/* Global Item Create/Edit Modal */}
      <GlobalItemFormModal
        isOpen={isItemModalOpen}
        item={editingItem}
        categories={categories}
        onClose={() => setIsItemModalOpen(false)}
        onSuccess={() => {
          showNotification(
            "success",
            `Global item ${editingItem ? "updated" : "created"} successfully.`
          );
          fetchAdminData();
        }}
      />

      {/* Delete Confirmation Modal */}
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
