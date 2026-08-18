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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-neo-rice border border-neo-line p-6 space-y-5 shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neo-line pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold block">
                GLOBAL CATALOG // {item ? "UPDATE" : "CREATE"}
              </span>
              <h3 className="font-heading font-bold text-xl text-neo-ink">
                {item ? "Edit Global Item Entry" : "Add New Global Item"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 text-neo-ash hover:text-neo-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun text-xs font-label flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-label tracking-wider text-neo-ash uppercase">
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
                className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors placeholder:text-neo-ash/60"
              />
            </div>
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-label tracking-wider text-neo-ash uppercase">
              Classification Category <span className="text-neo-ash text-[10px] lowercase">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                <FolderTree className="w-4 h-4" />
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors appearance-none cursor-pointer"
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
            <label className="block text-xs font-label tracking-wider text-neo-ash uppercase">
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
                className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors"
              />
            </div>

            {/* Preset Unit Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-label text-neo-ash py-0.5">
                Common units:
              </span>
              {COMMON_UNITS.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setDefaultUnit(u)}
                  className={`px-2 py-0.5 text-[10px] font-label border transition-all ${
                    defaultUnit.toLowerCase() === u
                      ? "bg-neo-sun text-neo-rice border-neo-sun font-bold"
                      : "bg-neo-bg text-neo-ash border-neo-line hover:border-neo-sun hover:text-neo-ink"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-label tracking-wider text-neo-ash uppercase">
              Description <span className="text-neo-ash text-[10px] lowercase">(optional)</span>
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
                className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors placeholder:text-neo-ash/60"
              />
            </div>
            <span className="text-[10px] font-label text-neo-ash text-right block">
              {description.length}/500 chars
            </span>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neo-line">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-neo-bg text-neo-ink font-label text-xs uppercase border border-neo-line hover:border-neo-ink transition-all disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
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
