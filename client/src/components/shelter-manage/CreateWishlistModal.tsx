"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  PackagePlus,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Tag,
  Boxes,
  Sparkles,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface GlobalItem {
  id: string;
  title: string;
  defaultUnit: string;
  categoryId?: string | null;
}

interface ItemRow {
  globalItemId: string;
  quantityNeeded: number;
  unit: string;
  notes: string;
}

interface CreateWishlistModalProps {
  shelterId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateWishlistModal({
  shelterId,
  isOpen,
  onClose,
  onSuccess,
}: CreateWishlistModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [globalItems, setGlobalItems] = useState<GlobalItem[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const [items, setItems] = useState<ItemRow[]>([
    { globalItemId: "", quantityNeeded: 10, unit: "units", notes: "" },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadOptions() {
      setLoadingOptions(true);
      try {
        const [catRes, itemRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/global-items"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.success ? catData.data : catData);
        }

        if (itemRes.ok) {
          const itemData = await itemRes.json();
          setGlobalItems(itemData.success ? itemData.data : itemData);
        }
      } catch (err) {
        console.error("Error loading categories or items:", err);
      } finally {
        setLoadingOptions(false);
      }
    }

    loadOptions();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setUrgency("MEDIUM");
    setSelectedCategoryIds([]);
    setItems([{ globalItemId: "", quantityNeeded: 10, unit: "units", notes: "" }]);
    setError(null);
  };

  const handleModalClose = () => {
    handleReset();
    onClose();
  };

  const handleAddItemRow = () => {
    setItems((prev) => [
      ...prev,
      { globalItemId: "", quantityNeeded: 10, unit: "units", notes: "" },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof ItemRow, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      // If user selected a global item, auto-fill its default unit
      if (field === "globalItemId") {
        const picked = globalItems.find((gi) => gi.id === value);
        if (picked) {
          updated[index].unit = picked.defaultUnit || "units";
          if (picked.categoryId && !selectedCategoryIds.includes(picked.categoryId)) {
            setSelectedCategoryIds((c) => [...c, picked.categoryId!]);
          }
        }
      }

      return updated;
    });
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please provide a title for this wishlist request.");
      return;
    }

    // Validate that at least one item has a valid globalItemId
    const validItems = items.filter((item) => item.globalItemId);
    if (validItems.length === 0) {
      setError("Please add at least one catalog item to this wishlist request.");
      return;
    }

    // Check for duplicate items
    const ids = validItems.map((i) => i.globalItemId);
    if (new Set(ids).size !== ids.length) {
      setError("Please ensure each item in the request is unique.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        shelterId,
        title: title.trim(),
        description: description.trim() || undefined,
        urgency,
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
        items: validItems.map((item) => ({
          globalItemId: item.globalItemId,
          quantityNeeded: Number(item.quantityNeeded),
          unit: item.unit.trim() || "units",
          notes: item.notes.trim() || undefined,
        })),
      };

      const res = await fetch("/api/shelter-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to publish wishlist request.");
      } else {
        handleReset();
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Error creating shelter request:", err);
      setError("An unexpected network error occurred while submitting.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neo-night/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleModalClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-neo-rice border border-neo-line/80 shadow-2xl p-6 md:p-8 space-y-6 text-neo-ink animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-2 rounded-xl border border-neo-line/60 bg-neo-bg hover:bg-neo-line/20 text-neo-ash hover:text-neo-ink transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-neo-sun/15 border border-neo-sun/30 flex items-center justify-center text-neo-sun shrink-0 shadow-sm">
            <PackagePlus className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neo-sun/10 text-neo-sun text-[10px] font-heading font-semibold uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3 h-3" />
              Live Shelter Needs
            </div>
            <h3 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Publish New Wishlist Request
            </h3>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-body flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="requestTitle"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
            >
              Request Campaign Title *
            </label>
            <input
              id="requestTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Winter Emergency Coats & Warm Bedding Drive"
              className="w-full px-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="requestDesc"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
            >
              Campaign Description / Donor Instructions
            </label>
            <textarea
              id="requestDesc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide background context on why these items are urgently needed by your shelter..."
              className="w-full p-3.5 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-xs font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all resize-none"
            />
          </div>

          {/* Urgency Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash">
              Urgency Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((lvl) => {
                const isSelected = urgency === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setUrgency(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-heading font-semibold border transition-all cursor-pointer text-center ${
                      isSelected
                        ? lvl === "CRITICAL"
                          ? "bg-red-500 text-white border-red-600 shadow-sm"
                          : "bg-neo-sun text-neo-rice border-neo-sun shadow-sm"
                        : "bg-neo-bg border-neo-line/60 text-neo-ash hover:text-neo-ink"
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories Selector */}
          {categories.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-neo-sun" />
                <span>Categories</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isChecked = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-body border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-neo-sun text-neo-rice border-neo-sun font-medium shadow-sm"
                          : "bg-neo-bg border-neo-line/60 text-neo-ash hover:text-neo-ink"
                      }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Requested Items Section */}
          <div className="space-y-3 pt-2 border-t border-neo-line/40">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-neo-sun" />
                <span>Requested Items & Quantities</span>
              </label>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs font-heading font-semibold text-neo-sun hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Item</span>
              </button>
            </div>

            {loadingOptions ? (
              <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-center gap-2 text-xs font-body text-neo-ash">
                <Loader2 className="w-4 h-4 animate-spin text-neo-sun" />
                <span>Loading global items catalog...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((row, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-3 relative group"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      {/* Pick Global Item */}
                      <div className="sm:col-span-6 space-y-1">
                        <label className="text-[10px] font-heading font-semibold uppercase text-neo-ash block">
                          Catalog Item *
                        </label>
                        <select
                          value={row.globalItemId}
                          onChange={(e) => handleItemChange(idx, "globalItemId", e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-lg bg-neo-rice border border-neo-line/70 focus:border-neo-sun text-xs font-body text-neo-ink outline-none"
                        >
                          <option value="">-- Choose Item from Catalog --</option>
                          {globalItems.map((gi) => (
                            <option key={gi.id} value={gi.id}>
                              {gi.title} ({gi.defaultUnit})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity Needed */}
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[10px] font-heading font-semibold uppercase text-neo-ash block">
                          Quantity Needed *
                        </label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={row.quantityNeeded}
                          onChange={(e) =>
                            handleItemChange(idx, "quantityNeeded", parseInt(e.target.value) || 1)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-neo-rice border border-neo-line/70 focus:border-neo-sun text-xs font-body text-neo-ink outline-none"
                        />
                      </div>

                      {/* Unit */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-heading font-semibold uppercase text-neo-ash block">
                          Unit
                        </label>
                        <input
                          type="text"
                          value={row.unit}
                          onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                          placeholder="units"
                          className="w-full px-3 py-2 rounded-lg bg-neo-rice border border-neo-line/70 focus:border-neo-sun text-xs font-body text-neo-ink outline-none"
                        />
                      </div>

                      {/* Delete Row Button */}
                      <div className="sm:col-span-1 flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          disabled={items.length <= 1}
                          className="p-1.5 rounded-lg border border-neo-line/60 bg-neo-rice text-neo-ash hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Notes for Item */}
                    <div>
                      <input
                        type="text"
                        value={row.notes}
                        onChange={(e) => handleItemChange(idx, "notes", e.target.value)}
                        placeholder="Specific size, brand, or packaging requirements (optional)..."
                        className="w-full px-3 py-1.5 rounded-lg bg-neo-rice border border-neo-line/50 focus:border-neo-sun text-[11px] font-body text-neo-ink placeholder:text-neo-ash/60 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-neo-line/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleModalClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl bg-neo-bg text-neo-ink font-heading font-semibold text-xs border border-neo-line/60 hover:bg-neo-line/20 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-neo-sun text-neo-rice font-heading font-bold text-xs rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-2 shadow-md shadow-neo-sun/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <PackagePlus className="w-4 h-4" />
                  <span>Publish Wishlist Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
