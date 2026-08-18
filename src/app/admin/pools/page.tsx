"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
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
  FolderTree,
  Package,
  RefreshCw,
  Layers,
} from "lucide-react";

type CatalogTab = "ALL" | "CATEGORIES" | "ITEMS";

export default function AdminPoolsPage() {
  const user = useUserStore((state) => state.user);

  // Pool State
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [globalItems, setGlobalItems] = useState<GlobalItemData[]>([]);
  const [activeTab, setActiveTab] = useState<CatalogTab>("ALL");

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Category Modal States
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  // Global Item Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GlobalItemData | null>(null);

  // Delete Target Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "Category" | "Global Item";
    id: string;
    title: string;
    warningMessage?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch catalog pools (Categories & Global Items ONLY)
  const fetchCatalogData = useCallback(async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    setFetchError(null);

    try {
      const [catRes, itemRes] = await Promise.all([
        fetch("/api/categories", { credentials: "include" }),
        fetch("/api/global-items", { credentials: "include" }),
      ]);

      const catData = await catRes.json();
      const itemData = await itemRes.json();

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
      console.error("Error fetching catalog pools:", err);
      const msg = err instanceof Error ? err.message : "Failed to load catalog pools";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "SUPER_ADMIN") {
      fetchCatalogData();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchCatalogData]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
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
      const endpoint =
        deleteTarget.type === "Category"
          ? `/api/categories/${deleteTarget.id}`
          : `/api/global-items/${deleteTarget.id}`;

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
      fetchCatalogData();
    } catch (err: unknown) {
      console.error("Delete error:", err);
      const msg =
        err instanceof Error ? err.message : `Failed to delete ${deleteTarget.type}`;
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
              AUTHENTICATION REQUIRED // CATALOG POOLS
            </span>
            <h1 className="font-heading font-bold text-2xl text-neo-ink">
              Access Restricted
            </h1>
            <p className="text-xs font-body text-neo-ash">
              Please sign in with a Super Admin account to access catalog pool management.
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
              Your account current role (<strong>{user.role}</strong>) does not have authorization to manage global catalog categories and standardized items.
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

  const uncategorizedItemsCount = globalItems.filter(
    (item) => !item.categoryId && !item.category?.id
  ).length;

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
                    SUPER ADMIN // CATALOG ARCHITECTURE
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-label bg-neo-sun/10 text-neo-sun border border-neo-sun/30 font-semibold">
                    CRUD ACTIVE
                  </span>
                </div>

                <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
                  Global Catalog Pools Management
                </h1>
                <p className="text-xs font-body text-neo-ash max-w-2xl">
                  Manage global categories and standardized donation catalog items used across shelter wishlists.
                </p>
              </div>

              <button
                onClick={() => fetchCatalogData(true)}
                disabled={isRefreshing}
                className="px-3.5 py-2 bg-neo-rice border border-neo-line text-neo-ink hover:border-neo-sun transition-all font-label text-xs uppercase flex items-center gap-2 disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-neo-sun ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh Pools</span>
              </button>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => setActiveTab("CATEGORIES")}
                className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === "CATEGORIES"
                    ? "bg-neo-rice border-neo-sun shadow-sm"
                    : "bg-neo-bg border-neo-line hover:border-neo-sun/60"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-label tracking-wider text-neo-ash uppercase block font-bold">
                    GLOBAL CATEGORIES
                  </span>
                  <div className="font-heading font-bold text-2xl text-neo-ink">
                    {categories.length}
                  </div>
                </div>
                <div className="p-2.5 bg-neo-sun/10 text-neo-sun border border-neo-sun/30">
                  <FolderTree className="w-5 h-5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("ITEMS")}
                className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === "ITEMS"
                    ? "bg-neo-rice border-neo-sun shadow-sm"
                    : "bg-neo-bg border-neo-line hover:border-neo-sun/60"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-label tracking-wider text-neo-ash uppercase block font-bold">
                    STANDARDIZED ITEMS
                  </span>
                  <div className="font-heading font-bold text-2xl text-neo-ink">
                    {globalItems.length}
                  </div>
                </div>
                <div className="p-2.5 bg-neo-sun/10 text-neo-sun border border-neo-sun/30">
                  <Package className="w-5 h-5" />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("ALL")}
                className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === "ALL"
                    ? "bg-neo-rice border-neo-sun shadow-sm"
                    : "bg-neo-bg border-neo-line hover:border-neo-sun/60"
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-label tracking-wider text-neo-ash uppercase block font-bold">
                    UNCATEGORIZED ITEMS
                  </span>
                  <div className="font-heading font-bold text-2xl text-neo-ink">
                    {uncategorizedItemsCount}
                  </div>
                </div>
                <div className="p-2.5 bg-neo-sun/10 text-neo-sun border border-neo-sun/30">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Tab Filter */}
            <div className="flex items-center gap-2 border-b border-neo-line pb-3">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-4 py-2 font-label text-xs uppercase tracking-wider transition-all border ${
                  activeTab === "ALL"
                    ? "bg-neo-sun text-neo-rice border-neo-sun font-bold shadow-xs"
                    : "bg-neo-rice text-neo-ink border-neo-line hover:border-neo-sun"
                }`}
              >
                All Catalog Pools
              </button>

              <button
                onClick={() => setActiveTab("CATEGORIES")}
                className={`px-4 py-2 font-label text-xs uppercase tracking-wider transition-all border ${
                  activeTab === "CATEGORIES"
                    ? "bg-neo-sun text-neo-rice border-neo-sun font-bold shadow-xs"
                    : "bg-neo-rice text-neo-ink border-neo-line hover:border-neo-sun"
                }`}
              >
                Categories Pool ({categories.length})
              </button>

              <button
                onClick={() => setActiveTab("ITEMS")}
                className={`px-4 py-2 font-label text-xs uppercase tracking-wider transition-all border ${
                  activeTab === "ITEMS"
                    ? "bg-neo-sun text-neo-rice border-neo-sun font-bold shadow-xs"
                    : "bg-neo-rice text-neo-ink border-neo-line hover:border-neo-sun"
                }`}
              >
                Global Items Pool ({globalItems.length})
              </button>
            </div>
          </div>

          {/* Catalog Pools Body */}
          {isLoading ? (
            <div className="p-12 text-center bg-neo-rice border border-neo-line space-y-3">
              <Loader2 className="w-8 h-8 text-neo-sun animate-spin mx-auto" />
              <p className="font-heading font-semibold text-sm text-neo-ink">
                Loading Global Catalog Pools...
              </p>
            </div>
          ) : fetchError ? (
            <div className="p-6 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun space-y-3">
              <div className="flex items-center gap-2 font-heading font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Failed to Sync Catalog Pools</span>
              </div>
              <p className="text-xs font-body text-neo-ink">{fetchError}</p>
              <button
                onClick={() => fetchCatalogData(true)}
                className="px-4 py-2 bg-neo-sun text-neo-rice font-label text-xs uppercase border border-neo-sun hover:bg-neo-sun/90 transition-all"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {(activeTab === "ALL" || activeTab === "CATEGORIES") && (
                <CategoryPoolCard
                  categories={categories}
                  onAddCategory={handleOpenAddCategory}
                  onEditCategory={handleOpenEditCategory}
                  onDeleteCategory={handleOpenDeleteCategory}
                />
              )}

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

      {/* Modals */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => {
          showNotification(
            "success",
            `Category ${editingCategory ? "updated" : "created"} successfully.`
          );
          fetchCatalogData();
        }}
      />

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
          fetchCatalogData();
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
