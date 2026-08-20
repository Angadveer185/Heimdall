"use client";

import React, { useState, useEffect } from "react";
import {
  FolderTree,
  Tag,
  FileText,
  X,
  Loader2,
  AlertCircle,
  Package,
  HeartPulse,
  Shirt,
  Utensils,
  Home,
  BookOpen,
  Sparkles,
  Shield,
  Truck,
  Wrench,
  Droplet,
  Zap,
  Stethoscope,
  Gift,
  Apple,
  Edit3,
} from "lucide-react";

export interface CategoryData {
  id: string;
  name: string;
  icon: string;
  description?: string | null;
  items?: Array<{ id: string }>;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  category?: CategoryData | null; // Null for Create mode, object for Edit mode
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_ICONS = [
  { name: "Package", icon: Package },
  { name: "Utensils", icon: Utensils },
  { name: "HeartPulse", icon: HeartPulse },
  { name: "Shirt", icon: Shirt },
  { name: "Home", icon: Home },
  { name: "BookOpen", icon: BookOpen },
  { name: "Sparkles", icon: Sparkles },
  { name: "Shield", icon: Shield },
  { name: "Truck", icon: Truck },
  { name: "Wrench", icon: Wrench },
  { name: "Droplet", icon: Droplet },
  { name: "Zap", icon: Zap },
  { name: "Stethoscope", icon: Stethoscope },
  { name: "Gift", icon: Gift },
  { name: "Apple", icon: Apple },
];

export function CategoryFormModal({
  isOpen,
  category,
  onClose,
  onSuccess,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("Package");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setIcon(category.icon || "Package");
      setDescription(category.description || "");
    } else {
      setName("");
      setIcon("Package");
      setDescription("");
    }
    setErrorMsg(null);
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Category name is required.");
      return;
    }

    if (!icon.trim()) {
      setErrorMsg("Category icon tag is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const isEdit = Boolean(category?.id);
      const url = isEdit
        ? `/api/categories/${category?.id}`
        : "/api/categories";
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        name: name.trim(),
        icon: icon.trim(),
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
        throw new Error(data.message || "Failed to save category");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Category submit error:", err);
      const msg = err instanceof Error ? err.message : "Failed to save category";
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
              {category ? "Update Category" : "Create Category"}
            </div>
            <h3 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              {category ? "Edit Global Category" : "Add New Global Category"}
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
          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-body font-semibold text-neo-ink">
              Category Name <span className="text-neo-sun">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Medical Supplies, Non-Perishable Foods..."
                maxLength={100}
                required
                className="w-full bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Preset Icon Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-body font-semibold text-neo-ink">
              Select Icon Symbol <span className="text-neo-sun">*</span>
            </label>

            <div className="grid grid-cols-5 gap-2 p-3 rounded-xl bg-neo-bg border border-neo-line/60 max-h-36 overflow-y-auto shadow-sm">
              {PRESET_ICONS.map((p) => {
                const IconComponent = p.icon;
                const isSelected = icon === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setIcon(p.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-neo-sun text-neo-rice border-neo-sun shadow-sm"
                        : "bg-neo-rice text-neo-ink border-neo-line/60 hover:border-neo-sun"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] font-heading font-semibold truncate max-w-full">
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Icon Tag Override */}
            <div className="pt-1">
              <span className="text-xs font-body text-neo-ash">
                Or type custom icon identifier tag:
              </span>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Icon Identifier Tag"
                maxLength={200}
                className="w-full mt-1 bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink px-3 py-2 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
              />
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
                placeholder="Brief summary of items classified under this category..."
                rows={3}
                maxLength={200}
                className="w-full bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
              />
            </div>
            <span className="text-[11px] font-body text-neo-ash text-right block">
              {description.length}/200 chars
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
                <span>{category ? "Update Category" : "Create Category"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
