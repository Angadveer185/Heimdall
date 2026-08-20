"use client";

import React from "react";
import { AlertTriangle, Loader2, X, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemTitle: string;
  itemType: "User" | "Category" | "Global Item" | "Shelter";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-md border border-neo-sun/30 rounded-2xl bg-neo-rice p-6 md:p-8 space-y-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neo-line/40 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 text-xs font-semibold tracking-wide mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Permanent Deletion Notice
            </div>
            <h3 className="font-heading font-bold text-xl text-neo-ink pt-0.5">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close Modal"
            className="p-2 rounded-full border border-neo-line/60 bg-neo-bg text-neo-ink hover:text-neo-sun hover:border-neo-sun transition-all cursor-pointer shadow-sm disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 font-body text-xs text-neo-ink leading-relaxed">
          <p>
            Are you sure you want to permanently delete this {itemType.toLowerCase()}?
          </p>

          <div className="p-3.5 rounded-xl bg-neo-bg border border-neo-line/60 font-heading font-semibold text-sm text-neo-sun flex items-center gap-2 shadow-sm">
            <Trash2 className="w-4 h-4 shrink-0 text-neo-sun" />
            <span className="truncate">{itemTitle}</span>
          </div>

          {warningMessage && (
            <div className="p-4 rounded-xl bg-neo-sun/15 border border-neo-sun/30 text-neo-sun text-xs space-y-1 shadow-sm font-medium">
              <p className="font-heading font-bold uppercase text-xs tracking-wide">
                Warning Notice
              </p>
              <p>{warningMessage}</p>
            </div>
          )}

          <p className="text-xs font-body text-neo-ash">
            This operation is immediate and cannot be undone. System dependencies may be affected.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neo-line/40">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-ink font-heading font-semibold text-xs hover:border-neo-sun transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
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
