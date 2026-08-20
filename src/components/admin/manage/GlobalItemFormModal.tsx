"use client";

import React, { useState, useEffect } from "react";
import { CategoryData } from "./CategoryFormModal";
import {
  Package,
  FolderTree,
  Scale,
  FileText,
  X,
  Loader2,
  AlertCircle,
  Tag,
  Edit3,
} from "lucide-react";

export interface GlobalItemData {
  id: string;
  title: string;
  description?: string | null;
  defaultUnit: string;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    icon: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

interface GlobalItemFormModalProps {
  isOpen: boolean;
  item?: GlobalItemData | null; // Null for Create mode, object for Edit mode
  categories: CategoryData[];
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_UNITS = [
  "units",
  "kg",
  "lbs",
  "boxes",
  "pairs",
  "liters",
  "packs",
  "cans",
  "bottles",
  "kits",
  "rolls",
  "gallons",
];

export function GlobalItemFormModal({
  isOpen,
  item,
  categories,
  onClose,
  onSuccess,
}: GlobalItemFormModalProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [defaultUnit, setDefaultUnit] = useState("units");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setTitle(item.title || "");
      setCategoryId(item.categoryId || item.category?.id || "");
      setDefaultUnit(item.defaultUnit || "units");
      setDescription(item.description || "");
    } else {
      setTitle("");
      setCategoryId("");
      setDefaultUnit("units");
      setDescription("");
    }
    setErrorMsg(null);
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg("Global item title is required.");
      return;
    }

    if (!defaultUnit.trim()) {
      setErrorMsg("Default unit is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const isEdit = Boolean(item?.id);
      const url = isEdit ? `/api/global-items/${item?.id}` : "/api/global-items";
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        title: title.trim(),
        defaultUnit: defaultUnit.trim(),
        categoryId: categoryId.trim() || undefined,
        description: description.trim() || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save global item");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Global item submit error:", err);
      const msg = err instanceof Error ? err.message : "Failed to save global item";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-lg border border-neo-line/60 rounded-2xl bg-neo-rice shadow-2xl p-6 md:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neo-line/40 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide mb-1">
              <Edit3 className="w-3.5 h-3.5" />
              {item ? "Update Item" : "Create Item"}
            </div>
            <h3 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              {item ? "Edit Global Item Entry" : "Add New Global Item"}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close Modal"
            className="p-2 rounded-full border border-neo-line/60 bg-neo-bg text-neo-ink hover:text-neo-sun hover:border-neo-sun transition-all cursor-pointer shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-neo-sun/15 text-neo-sun border border-neo-sun/30 text-xs font-body flex items-start gap-2 shadow-sm font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-body font-semibold text-neo-ink">
              Item Title <span className="text-neo-sun">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Canned Beans (400g), Thermal Blanket..."
                maxLength={100}
                required
                className="w-full bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-body font-semibold text-neo-ink">
              Classification Category <span className="text-neo-ash text-xs font-normal">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                <FolderTree className="w-4 h-4" />
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm cursor-pointer"
              >
                <option value="">-- No Category (Uncategorized) --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.icon})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Default Unit */}
          <div className="space-y-1.5">
            <label className="block text-xs font-body font-semibold text-neo-ink">
              Default Measurement Unit <span className="text-neo-sun">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                <Scale className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={defaultUnit}
                onChange={(e) => setDefaultUnit(e.target.value)}
                placeholder="e.g. units, kg, boxes, pairs"
                maxLength={50}
                required
                className="w-full bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
              />
            </div>

            {/* Preset Unit Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              <span className="text-[11px] font-body text-neo-ash py-0.5">
                Common units:
              </span>
              {COMMON_UNITS.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setDefaultUnit(u)}
                  className={`px-2.5 py-0.5 text-xs font-heading font-semibold rounded-full border transition-all cursor-pointer ${
                    defaultUnit.toLowerCase() === u
                      ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm"
                      : "bg-neo-bg text-neo-ash border-neo-line/60 hover:border-neo-sun hover:text-neo-ink"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-body font-semibold text-neo-ink">
              Description <span className="text-neo-ash text-xs font-normal">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3.5 pointer-events-none text-neo-ash">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Standardized details, size requirements, or donor instructions..."
                rows={3}
                maxLength={500}
                className="w-full bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
              />
            </div>
            <span className="text-[11px] font-body text-neo-ash text-right block">
              {description.length}/500 chars
            </span>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neo-line/40">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-ink font-heading font-semibold text-xs hover:border-neo-sun transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{item ? "Update Item" : "Create Item"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
