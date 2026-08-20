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
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Pool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide mb-1">
              Global Categories Pool
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Global Categories Pool ({categories.length})
            </h2>
          </div>
        </div>

        {/* Top Actions: Search & Add Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full sm:w-56 bg-neo-bg border border-neo-line/70 rounded-xl text-neo-ink pl-10 pr-3 py-2 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
            />
          </div>

          <button
            onClick={onAddCategory}
            className="px-4.5 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Category Pool Cards Grid */}
      {filteredCategories.length === 0 ? (
        <div className="p-8 rounded-xl text-center bg-neo-bg border border-dashed border-neo-line/60 space-y-3">
          <FolderTree className="w-10 h-10 text-neo-ash mx-auto opacity-50" />
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
              className="mt-2 px-4.5 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all inline-flex items-center gap-2 shadow-md shadow-neo-sun/20"
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
                className="group p-4 rounded-xl bg-neo-bg border border-neo-line/60 hover:border-neo-sun/60 transition-all space-y-3 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-neo-rice border border-neo-line/60 text-neo-sun group-hover:border-neo-sun/50 transition-colors shadow-sm">
                        {getCategoryIconComponent(cat.icon)}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-neo-ink group-hover:text-neo-sun transition-colors">
                          {cat.name}
                        </h4>
                        <span className="text-[11px] font-body text-neo-ash">
                          Tag: {cat.icon}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 text-xs font-heading font-semibold rounded-full bg-neo-sun/10 text-neo-sun border border-neo-sun/30 shrink-0">
                      {itemCount} {itemCount === 1 ? "Item" : "Items"}
                    </span>
                  </div>

                  <p className="text-xs font-body text-neo-ash min-h-[2rem] line-clamp-2 leading-relaxed">
                    {cat.description || "No description provided for this category."}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-neo-line/40">
                  <span className="text-[11px] font-body text-neo-ash">
                    ID: {cat.id.substring(cat.id.length - 6)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditCategory(cat)}
                      className="px-3 py-1.5 rounded-xl text-xs font-heading font-semibold bg-neo-rice border border-neo-line/60 text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onDeleteCategory(cat)}
                      className="px-3 py-1.5 rounded-xl text-xs font-heading font-semibold bg-neo-rice border border-neo-line/60 text-neo-sun hover:bg-neo-sun hover:text-neo-rice hover:border-neo-sun transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                      title="Delete Category"
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
