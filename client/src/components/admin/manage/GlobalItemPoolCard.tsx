"use client";

import React, { useState } from "react";
import { GlobalItemData } from "./GlobalItemFormModal";
import { CategoryData } from "./CategoryFormModal";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  FolderTree,
  Scale,
} from "lucide-react";

interface GlobalItemPoolCardProps {
  items: GlobalItemData[];
  categories: CategoryData[];
  onAddItem: () => void;
  onEditItem: (item: GlobalItemData) => void;
  onDeleteItem: (item: GlobalItemData) => void;
}

export function GlobalItemPoolCard({
  items,
  categories,
  onAddItem,
  onEditItem,
  onDeleteItem,
}: GlobalItemPoolCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");

  const filteredItems = items.filter((item) => {
    // 1. Filter by category dropdown
    if (selectedCategoryFilter === "UNCATEGORIZED") {
      if (item.categoryId || item.category?.id) return false;
    } else if (selectedCategoryFilter !== "ALL") {
      const catId = item.categoryId || item.category?.id;
      if (catId !== selectedCategoryFilter) return false;
    }

    // 2. Filter by search query text
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const titleMatch = item.title.toLowerCase().includes(q);
    const descMatch = item.description?.toLowerCase().includes(q);
    const unitMatch = item.defaultUnit.toLowerCase().includes(q);
    const catNameMatch = item.category?.name.toLowerCase().includes(q);

    return titleMatch || descMatch || unitMatch || catNameMatch;
  });

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Pool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide mb-1">
              Standardized Items Catalog
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Global Items Catalog Pool ({items.length})
            </h2>
          </div>
        </div>

        {/* Top Actions */}
        <button
          onClick={onAddItem}
          className="px-4.5 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20 shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Global Item</span>
        </button>
      </div>

      {/* Controls Bar: Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-xl bg-neo-bg border border-neo-line/60 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by title, unit, or description..."
            className="w-full bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink pl-10 pr-3 py-2 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="relative sm:w-60">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
            <Filter className="w-4 h-4" />
          </div>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-full bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink pl-10 pr-3 py-2 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm cursor-pointer"
          >
            <option value="ALL">All Categories ({items.length})</option>
            <option value="UNCATEGORIZED">Uncategorized</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Items Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-xl text-center bg-neo-bg border border-dashed border-neo-line/60 space-y-3">
          <Package className="w-10 h-10 text-neo-ash mx-auto opacity-50" />
          <p className="font-heading font-semibold text-sm text-neo-ink">
            {searchQuery || selectedCategoryFilter !== "ALL"
              ? "No matching global items found"
              : "No Global Items Created Yet"}
          </p>
          <p className="text-xs font-body text-neo-ash max-w-sm mx-auto">
            {searchQuery || selectedCategoryFilter !== "ALL"
              ? "Try resetting your search query or category filter."
              : "Global items define standard donation items available for shelters to request across Heimdall."}
          </p>
          {!searchQuery && selectedCategoryFilter === "ALL" && (
            <button
              onClick={onAddItem}
              className="mt-2 px-4.5 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all inline-flex items-center gap-2 shadow-md shadow-neo-sun/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Global Item</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const categoryName = item.category?.name || "Uncategorized";

            return (
              <div
                key={item.id}
                className="group p-4 rounded-xl bg-neo-bg border border-neo-line/60 hover:border-neo-sun/60 transition-all space-y-3 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div className="space-y-2">
                  {/* Category & Unit Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-heading font-semibold rounded-full bg-neo-sun/10 text-neo-sun truncate max-w-[170px]">
                      <FolderTree className="w-3 h-3 shrink-0" />
                      <span className="truncate">{categoryName}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-heading font-semibold rounded-full bg-neo-gold/15 text-neo-gold border border-neo-gold/30 shrink-0">
                      <Scale className="w-3 h-3" />
                      <span>{item.defaultUnit}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-heading font-bold text-base text-neo-ink group-hover:text-neo-sun transition-colors pt-1">
                    {item.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs font-body text-neo-ash min-h-[2.5rem] line-clamp-3 leading-relaxed">
                    {item.description || "No specific description or unit details recorded."}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-neo-line/40">
                  <span className="text-[11px] font-body text-neo-ash">
                    ID: {item.id.substring(item.id.length - 6)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditItem(item)}
                      className="px-3 py-1.5 rounded-xl text-xs font-heading font-semibold bg-neo-rice border border-neo-line/60 text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onDeleteItem(item)}
                      className="px-3 py-1.5 rounded-xl text-xs font-heading font-semibold bg-neo-rice border border-neo-line/60 text-neo-sun hover:bg-neo-sun hover:text-neo-rice hover:border-neo-sun transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
