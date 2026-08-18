"use client";

import React, { useState } from "react";
import { CategoryData } from "./CategoryFormModal";
import {
  FolderTree,
  Plus,
  Search,
  Edit3,
  Trash2,
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
  LucideIcon,
} from "lucide-react";

interface CategoryPoolCardProps {
  categories: CategoryData[];
  onAddCategory: () => void;
  onEditCategory: (category: CategoryData) => void;
  onDeleteCategory: (category: CategoryData) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Package,
  Utensils,
  HeartPulse,
  Shirt,
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
};

export function CategoryPoolCard({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryPoolCardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description?.toLowerCase().includes(q) ||
      cat.icon.toLowerCase().includes(q)
    );
  });

  const getCategoryIconComponent = (iconTag: string) => {
    const Component = ICON_MAP[iconTag];
    if (Component) return <Component className="w-5 h-5" />;
    return <FolderTree className="w-5 h-5" />;
  };

  return (
    <div className="border border-neo-line bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Pool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun shrink-0">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold">
                GLOBAL SYSTEM CATALOG
              </span>
              <span className="px-2 py-0.5 text-[10px] font-label bg-neo-bg border border-neo-line text-neo-ink font-semibold">
                {categories.length} POOL ENTRIES
              </span>
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Global Categories Pool
            </h2>
          </div>
        </div>

        {/* Top Actions: Search & Add Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neo-ash">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full sm:w-56 bg-neo-bg border border-neo-line text-neo-ink pl-9 pr-3 py-2 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors placeholder:text-neo-ash/60"
            />
          </div>

          <button
            onClick={onAddCategory}
            className="px-4 py-2 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Category Pool Cards Grid */}
      {filteredCategories.length === 0 ? (
        <div className="p-8 text-center bg-neo-bg border border-dashed border-neo-line space-y-3">
          <FolderTree className="w-10 h-10 text-neo-ash/50 mx-auto" />
          <p className="font-heading font-semibold text-sm text-neo-ink">
            {searchQuery ? "No matching categories found" : "No Global Categories Created Yet"}
          </p>
          <p className="text-xs font-body text-neo-ash max-w-sm mx-auto">
            {searchQuery
              ? `No categories match "${searchQuery}". Try refining your search query.`
              : "Global categories organize donation items into standardized classifications across shelters."}
          </p>
          {!searchQuery && (
            <button
              onClick={onAddCategory}
              className="mt-2 px-4 py-2 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Category</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => {
            const itemCount = cat.items?.length || 0;
            return (
              <div
                key={cat.id}
                className="group p-4 bg-neo-bg border border-neo-line hover:border-neo-sun/60 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neo-rice border border-neo-line text-neo-sun group-hover:border-neo-sun/50 transition-colors">
                        {getCategoryIconComponent(cat.icon)}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-neo-ink group-hover:text-neo-sun transition-colors">
                          {cat.name}
                        </h4>
                        <span className="text-[10px] font-label text-neo-ash">
                          ICON: {cat.icon}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 text-[10px] font-label bg-neo-rice border border-neo-line text-neo-ash font-semibold shrink-0">
                      {itemCount} {itemCount === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  <p className="text-xs font-body text-neo-ash min-h-[2rem] line-clamp-2">
                    {cat.description || "No description provided for this category."}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-neo-line/60">
                  <span className="text-[9px] font-label text-neo-ash uppercase">
                    ID: {cat.id.substring(cat.id.length - 6)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditCategory(cat)}
                      className="px-2.5 py-1 text-xs font-label bg-neo-rice border border-neo-line text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all flex items-center gap-1"
                      title="Edit Category"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onDeleteCategory(cat)}
                      className="px-2.5 py-1 text-xs font-label bg-neo-rice border border-neo-line text-neo-sun/80 hover:bg-neo-sun hover:text-neo-rice hover:border-neo-sun transition-all flex items-center gap-1"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3 h-3" />
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
