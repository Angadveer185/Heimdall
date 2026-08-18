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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-neo-rice border border-neo-line p-6 space-y-5 shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neo-line pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun shrink-0">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold block">
                CATALOG ARCHITECTURE // {category ? "UPDATE" : "CREATE"}
              </span>
              <h3 className="font-heading font-bold text-xl text-neo-ink">
                {category ? "Edit Global Category" : "Add New Global Category"}
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
          {/* Category Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-label tracking-wider text-neo-ash uppercase">
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
                className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors placeholder:text-neo-ash/60"
              />
            </div>
          </div>

          {/* Preset Icon Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-label tracking-wider text-neo-ash uppercase">
              Select Icon Symbol <span className="text-neo-sun">*</span>
            </label>

            <div className="grid grid-cols-5 gap-2 p-2.5 bg-neo-bg border border-neo-line max-h-36 overflow-y-auto">
              {PRESET_ICONS.map((p) => {
                const IconComponent = p.icon;
                const isSelected = icon === p.name;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setIcon(p.name)}
                    className={`flex flex-col items-center justify-center p-2 border transition-all text-center gap-1 ${
                      isSelected
                        ? "bg-neo-sun text-neo-rice border-neo-sun font-semibold"
                        : "bg-neo-rice text-neo-ink border-neo-line hover:border-neo-sun/60"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    <span className="text-[9px] font-label truncate max-w-full">
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Icon Tag Override */}
            <div className="pt-1">
              <span className="text-[10px] font-label text-neo-ash">
                Or type custom icon identifier tag:
              </span>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Icon Identifier Tag"
                maxLength={200}
                className="w-full mt-1 bg-neo-bg border border-neo-line text-neo-ink px-3 py-1.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors"
              />
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
                placeholder="Brief summary of items classified under this category..."
                rows={3}
                maxLength={200}
                className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors placeholder:text-neo-ash/60"
              />
            </div>
            <span className="text-[10px] font-label text-neo-ash text-right block">
              {description.length}/200 chars
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
                <span>{category ? "Update Category" : "Create Category"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
