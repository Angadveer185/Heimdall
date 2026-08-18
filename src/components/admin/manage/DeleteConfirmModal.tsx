"use client";

import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemTitle: string;
  itemType: "User" | "Category" | "Global Item";
  warningMessage?: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title,
  itemTitle,
  itemType,
  warningMessage,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-neo-rice border-2 border-neo-sun/60 p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neo-line pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold">
                SYSTEM DESTRUCTION // ACTION REQUIRED
              </span>
              <h3 className="font-heading font-bold text-lg text-neo-ink">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 text-neo-ash hover:text-neo-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 font-body text-xs text-neo-ink">
          <p>
            Are you sure you want to permanently delete this {itemType.toLowerCase()}?
          </p>
          
          <div className="p-3 bg-neo-bg border border-neo-line font-heading font-semibold text-sm text-neo-sun flex items-center gap-2">
            <span>&bull;</span>
            <span className="truncate">{itemTitle}</span>
          </div>

          {warningMessage && (
            <div className="p-3 bg-neo-sun/10 border border-neo-sun/30 text-neo-sun text-[11px] space-y-1">
              <p className="font-label font-bold uppercase tracking-wider text-[10px]">
                WARNING NOTICE
              </p>
              <p>{warningMessage}</p>
            </div>
          )}

          <p className="text-[11px] text-neo-ash">
            This operation is immediate and cannot be undone. System dependencies may be affected.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neo-line">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-neo-bg text-neo-ink font-label text-xs uppercase border border-neo-line hover:border-neo-ink transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Confirm Deletion</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
