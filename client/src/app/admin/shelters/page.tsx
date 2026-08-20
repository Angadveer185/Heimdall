"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { Sidebar } from "@/components/ui/Sidebar";
import { ShelterMetricsBar, ShelterMetrics } from "@/components/admin/shelters/ShelterMetricsBar";
import { ShelterPoolCard } from "@/components/admin/shelters/ShelterPoolCard";
import { ShelterFormModal } from "@/components/admin/shelters/ShelterFormModal";
import { ShelterDetailModal, FullShelterData } from "@/components/admin/shelters/ShelterDetailModal";
import { DeleteConfirmModal } from "@/components/admin/manage/DeleteConfirmModal";
import {
  ShieldAlert,
  ShieldCheck,
  LogIn,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  RefreshCw,
  UserCheck,
  Shield,
} from "lucide-react";

export default function AdminSheltersPage() {
  const user = useUserStore((state) => state.user);

  // Shelters State
  const [shelters, setShelters] = useState<FullShelterData[]>([]);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingShelter, setEditingShelter] = useState<FullShelterData | null>(null);

  const [detailShelter, setDetailShelter] = useState<FullShelterData | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    organizationId: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Shelters
  const fetchShelterData = useCallback(async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    setFetchError(null);

    try {
      const res = await fetch("/api/shelters", { credentials: "include" });
      const data = await res.json();

      if (res.ok && data.success) {
        setShelters(data.data || []);
      } else {
        throw new Error(data.message || "Failed to load shelter registry.");
      }
    } catch (err: unknown) {
      console.error("Error fetching shelters:", err);
      const msg = err instanceof Error ? err.message : "Failed to load shelter registry.";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (user && user.role === "SUPER_ADMIN") {
      fetchShelterData();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchShelterData]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // CRUD Handlers
  const handleOpenAddShelter = () => {
    setEditingShelter(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditShelter = (s: FullShelterData) => {
    setEditingShelter(s);
    setIsFormModalOpen(true);
  };

  const handleOpenViewShelter = (s: FullShelterData) => {
    setDetailShelter(s);
  };

  const handleOpenDeleteShelter = (s: FullShelterData) => {
    setDeleteTarget({
      id: s.id,
      name: s.name,
      organizationId: `${s.organizationIdType}: ${s.organizationId}`,
    });
  };

  const handleConfirmDeleteShelter = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/shelters/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete shelter record.");
      }

      showNotification(
        "success",
        `Shelter "${deleteTarget.name}" was successfully removed from the registry.`
      );
      setDeleteTarget(null);
      fetchShelterData();
    } catch (err: unknown) {
      console.error("Delete shelter error:", err);
      const msg = err instanceof Error ? err.message : "Failed to delete shelter.";
      showNotification("error", msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate Metrics
  const metrics: ShelterMetrics = {
    total: shelters.length,
    verified: shelters.filter((s) => s.verificationStatus === "VERIFIED").length,
    pending: shelters.filter((s) => s.verificationStatus === "PENDING").length,
    rejected: shelters.filter((s) => s.verificationStatus === "REJECTED").length,
  };

  // Auth Guards
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
              Please sign in with a Super Admin account to access shelter pool management.
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
              Your account role (<strong className="font-heading font-semibold text-neo-ink">{user.role}</strong>) does not have authorization to view and manage shelter registries.
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

  return (
    <div className="h-screen w-screen overflow-hidden bg-neo-bg text-neo-ink flex flex-col md:flex-row">
      <Sidebar user={user} />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-neo-bg">
        {/* Notification Banner */}
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
                    <Building2 className="w-3.5 h-3.5" />
                    Shelter Registry Management
                  </div>
                  <span className="px-3 py-1 text-xs font-heading font-semibold rounded-full bg-neo-gold/15 text-neo-gold border border-neo-gold/30">
                    Non-Profit Roster
                  </span>
                </div>

                <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink tracking-tight">
                  Shelter Registry Directory Management
                </h1>
                <p className="text-xs font-body text-neo-ash max-w-2xl leading-relaxed">
                  Display all non-profit shelters in a central pool, perform full CRUD operations (Create, Read Dossiers, Edit, Delete), and override non-profit verification statuses.
                </p>
              </div>

              <button
                onClick={() => fetchShelterData(true)}
                disabled={isRefreshing}
                className="px-4 py-2 rounded-xl bg-neo-rice border border-neo-line/60 text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all font-heading font-semibold text-xs flex items-center gap-2 disabled:opacity-50 shrink-0 shadow-sm cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-neo-sun ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh Registry</span>
              </button>
            </div>

            {/* Metrics Bar */}
            <ShelterMetricsBar metrics={metrics} />
          </div>

          {/* Shelter Pool Card Component */}
          {isLoading ? (
            <div className="p-12 text-center rounded-2xl bg-neo-rice border border-neo-line/60 space-y-3 shadow-sm">
              <Loader2 className="w-8 h-8 text-neo-sun animate-spin mx-auto" />
              <p className="font-heading font-semibold text-sm text-neo-ink">
                Loading Shelter Registry...
              </p>
            </div>
          ) : fetchError ? (
            <div className="p-6 rounded-2xl bg-neo-sun/15 border border-neo-sun/30 text-neo-sun space-y-3 shadow-sm">
              <div className="flex items-center gap-2 font-heading font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Failed to Sync Shelter Registry</span>
              </div>
              <p className="text-xs font-body text-neo-ink">{fetchError}</p>
              <button
                onClick={() => fetchShelterData(true)}
                className="px-4 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-md shadow-neo-sun/20 cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <ShelterPoolCard
              shelters={shelters}
              onAddShelter={handleOpenAddShelter}
              onViewShelter={handleOpenViewShelter}
              onEditShelter={handleOpenEditShelter}
              onDeleteShelter={handleOpenDeleteShelter}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <ShelterFormModal
        isOpen={isFormModalOpen}
        shelter={editingShelter}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => {
          showNotification(
            "success",
            `Shelter record ${editingShelter ? "updated" : "created"} successfully.`
          );
          fetchShelterData();
        }}
      />

      <ShelterDetailModal
        isOpen={Boolean(detailShelter)}
        shelter={detailShelter}
        onClose={() => setDetailShelter(null)}
        onEdit={(s) => {
          setDetailShelter(null);
          handleOpenEditShelter(s);
        }}
      />

      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={Boolean(deleteTarget)}
          title="Delete Shelter Record"
          itemTitle={`${deleteTarget.name} (${deleteTarget.organizationId})`}
          itemType="Shelter"
          warningMessage="Deleting this shelter will remove its registry entry and associated supply request dependencies!"
          isDeleting={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDeleteShelter}
        />
      )}
    </div>
  );
}
