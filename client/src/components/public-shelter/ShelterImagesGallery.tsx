"use client";

import React, { useState } from "react";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import {
  Images,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
} from "lucide-react";

interface ShelterImagesGalleryProps {
  images: string[];
  shelterName: string;
}

export function ShelterImagesGallery({
  images,
  shelterName,
}: ShelterImagesGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  if (!images || images.length === 0) {
    return null;
  }

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : 0
    );
  };

  const handlePrev = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : 0
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setSelectedImageIndex(null);
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
  };

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-6 md:p-8 space-y-5 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-neo-line/40 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-neo-sun font-heading font-semibold text-[11px] uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Facility Gallery</span>
          </div>
          <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
            Shelter & Community Photos
          </h2>
          <p className="text-xs font-body text-neo-ash">
            Take a look inside {shelterName}&apos;s facility, drop-off depot, and community operations.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-neo-bg border border-neo-line/60 text-xs font-heading font-semibold text-neo-ink">
          {images.length} {images.length === 1 ? "Photo" : "Photos"}
        </span>
      </div>

      {/* Responsive Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {images.map((imgUrl, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => setSelectedImageIndex(idx)}
            className="group relative aspect-4/3 rounded-xl overflow-hidden border border-neo-line/60 bg-neo-bg hover:border-neo-sun focus:outline-none focus:ring-2 focus:ring-neo-sun transition-all cursor-pointer shadow-sm"
          >
            {/* eslint-disable-next-next/no-img-element */}
            <img
              src={getOptimizedImageUrl(imgUrl, {
                width: 600,
                height: 450,
                crop: "fill",
                quality: "auto",
              })}
              alt={`${shelterName} gallery preview ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            {/* Hover Overlay with Zoom Icon */}
            <div className="absolute inset-0 bg-neo-night/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-2 rounded-full bg-neo-rice/90 text-neo-sun shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="fixed inset-0 z-50 bg-neo-night/90 backdrop-blur-md flex items-center justify-center p-4 outline-none"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-neo-rice/20 hover:bg-neo-rice/40 text-neo-rice transition-colors cursor-pointer"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Photo Counter */}
          <div className="absolute top-5 left-5 z-10 px-3 py-1 rounded-full bg-neo-rice/20 text-neo-rice font-mono text-xs">
            {selectedImageIndex + 1} / {images.length}
          </div>

          {/* Previous Arrow */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 z-10 p-3 rounded-full bg-neo-rice/20 hover:bg-neo-rice/40 text-neo-rice transition-all cursor-pointer shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main Large Image */}
          <div className="max-w-4xl max-h-[85vh] p-2 flex flex-col items-center">
            {/* eslint-disable-next-next/no-img-element */}
            <img
              src={getOptimizedImageUrl(images[selectedImageIndex], {
                width: 1400,
                quality: "auto",
              })}
              alt={`${shelterName} full image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl border border-neo-line/30"
            />
            <p className="text-neo-rice/80 text-xs font-body mt-3 font-medium text-center">
              {shelterName} • Image {selectedImageIndex + 1} of {images.length}
            </p>
          </div>

          {/* Next Arrow */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 z-10 p-3 rounded-full bg-neo-rice/20 hover:bg-neo-rice/40 text-neo-rice transition-all cursor-pointer shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
