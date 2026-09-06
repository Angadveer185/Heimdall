"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { uploadImageToCloudinary, getOptimizedImageUrl } from "@/lib/cloudinary";
import {
  Building2,
  Mail,
  Phone,
  Clock,
  Globe,
  MapPin,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Camera,
  Trash2,
  Upload,
  Plus,
  Compass,
} from "lucide-react";

// Dynamically import map component with SSR disabled
const CoordinatePickerMap = dynamic(
  () => import("@/components/maps/CoordinatePickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full rounded-2xl bg-neo-bg border border-neo-line/60 flex items-center justify-center gap-2 text-neo-ash text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-neo-sun" />
        <span>Loading interactive map...</span>
      </div>
    ),
  }
);

export interface ShelterDetails {
  id: string;
  name: string;
  country: string;
  organizationIdType: string;
  organizationId: string;
  verificationStatus: string;
  rejectionReason?: string | null;
  description?: string | null;
  street: string;
  city: string;
  state: string;
  zip: string;
  latitude?: number;
  longitude?: number;
  dropOffHours: string;
  contactEmail: string;
  phone?: string | null;
  website?: string | null;
  profileImageUrl?: string | null;
  shelterImages?: string[];
}

interface ShelterEditFormProps {
  shelter: ShelterDetails;
  onUpdateSuccess: () => void;
}

export function ShelterEditForm({ shelter, onUpdateSuccess }: ShelterEditFormProps) {
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: shelter.name || "",
    description: shelter.description || "",
    street: shelter.street || "",
    city: shelter.city || "",
    state: shelter.state || "",
    zip: shelter.zip || "",
    dropOffHours: shelter.dropOffHours || "",
    contactEmail: shelter.contactEmail || "",
    phone: shelter.phone || "",
    website: shelter.website || "",
  });

  // Coordinates state
  const [latitude, setLatitude] = useState<number>(
    typeof shelter.latitude === "number" && Number.isFinite(shelter.latitude)
      ? shelter.latitude
      : 37.7749
  );
  const [longitude, setLongitude] = useState<number>(
    typeof shelter.longitude === "number" && Number.isFinite(shelter.longitude)
      ? shelter.longitude
      : -122.4194
  );

  // Images state
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(
    shelter.profileImageUrl || null
  );
  const [shelterImages, setShelterImages] = useState<string[]>(
    Array.isArray(shelter.shelterImages) ? shelter.shelterImages : []
  );

  // Upload loading states
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  // Map Coordinate Change handler
  const handleCoordinatesChange = (coords: { lat: number; lng: number }) => {
    setLatitude(coords.lat);
    setLongitude(coords.lng);
    if (error) setError(null);
  };

  // Cloudinary Profile Image Upload
  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProfile(true);
    setError(null);

    try {
      const result = await uploadImageToCloudinary(file, "shelter-profile");
      setProfileImageUrl(result.secureUrl);
    } catch (err: unknown) {
      console.error("Profile image upload failed:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to upload profile picture";
      setError(`Profile image upload error: ${msg}`);
    } finally {
      setIsUploadingProfile(false);
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = "";
      }
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileImageUrl(null);
  };

  // Cloudinary Gallery Images Upload (supports multiple files)
  const handleGalleryImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    setError(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadImageToCloudinary(file, "shelter-gallery");
        newUrls.push(result.secureUrl);
      }
      setShelterImages((prev) => [...prev, ...newUrls]);
    } catch (err: unknown) {
      console.error("Gallery images upload failed:", err);
      const msg =
        err instanceof Error ? err.message : "Failed to upload gallery images";
      setError(`Gallery upload error: ${msg}`);
    } finally {
      setIsUploadingGallery(false);
      if (galleryImageInputRef.current) {
        galleryImageInputRef.current.value = "";
      }
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setShelterImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/shelters/${shelter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim(),
          dropOffHours: formData.dropOffHours.trim(),
          contactEmail: formData.contactEmail.trim(),
          phone: formData.phone.trim() || undefined,
          website: formData.website.trim() || undefined,
          latitude: Number(latitude),
          longitude: Number(longitude),
          profileImageUrl: profileImageUrl || null,
          shelterImages: shelterImages,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update shelter facility information.");
      } else {
        setSuccess(true);
        onUpdateSuccess();
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Error updating shelter:", err);
      setError("An unexpected network error occurred while saving shelter details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-6 md:p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-line/40 pb-5">
        <div>
          <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink flex items-center gap-2">
            <Building2 className="w-5 h-5 text-neo-sun" />
            <span>Facility Profile & Operational Information</span>
          </h2>
          <p className="text-xs font-body text-neo-ash mt-0.5">
            Keep your facility images, coordinates, operating hours, and donor contact channels accurate and up-to-date.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-3 py-1 text-xs font-heading font-semibold rounded-full border uppercase flex items-center gap-1.5 ${
              shelter.verificationStatus === "VERIFIED"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-neo-sun/15 border-neo-sun/30 text-neo-sun"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{shelter.verificationStatus}</span>
          </span>
          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-neo-bg border border-neo-line/60 text-neo-ink">
            {shelter.organizationIdType}: {shelter.organizationId}
          </span>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-body flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-body flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Shelter information saved and published successfully!</span>
        </div>
      )}

      {/* Visual Identity / Images Management Section */}
      <div className="space-y-6 bg-neo-bg/50 p-5 sm:p-6 rounded-2xl border border-neo-line/60">
        <div className="border-b border-neo-line/40 pb-3">
          <h3 className="font-heading font-bold text-base text-neo-ink flex items-center gap-2">
            <Camera className="w-4 h-4 text-neo-sun" />
            <span>Visual Media & Facility Photos</span>
          </h3>
          <p className="text-xs font-body text-neo-ash">
            Upload shelter branding and showcase photos powered by Cloudinary.
          </p>
        </div>

        {/* 1. Profile Picture / Logo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative w-24 h-24 rounded-2xl border-2 border-neo-line/80 bg-neo-bg overflow-hidden flex items-center justify-center shrink-0 shadow-md">
            {profileImageUrl ? (
              /* eslint-disable-next-next/no-img-element */
              <img
                src={getOptimizedImageUrl(profileImageUrl, {
                  width: 200,
                  height: 200,
                  crop: "fill",
                })}
                alt={shelter.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-10 h-10 text-neo-ash/60" />
            )}

            {isUploadingProfile && (
              <div className="absolute inset-0 bg-neo-night/60 flex items-center justify-center text-neo-rice">
                <Loader2 className="w-6 h-6 animate-spin text-neo-sun" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-heading font-semibold text-sm text-neo-ink">
              Shelter Profile / Logo Image
            </h4>
            <p className="text-xs font-body text-neo-ash max-w-md">
              This image represents your organization across the public directory and public profile banner.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
                id="shelter-profile-upload"
              />

              <button
                type="button"
                disabled={isUploadingProfile}
                onClick={() => profileImageInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isUploadingProfile ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{profileImageUrl ? "Change Photo" : "Upload Profile Image"}</span>
              </button>

              {profileImageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveProfileImage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/40 text-red-600 hover:bg-red-500/10 font-heading font-semibold text-xs transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Facility Showcase Photos (shelterImages) */}
        <div className="space-y-3 pt-4 border-t border-neo-line/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="font-heading font-semibold text-sm text-neo-ink flex items-center gap-1.5">
                <span>Facility Gallery Showcase Photos</span>
                <span className="text-[11px] font-mono px-2 py-0.2 rounded-full bg-neo-sun/15 text-neo-sun">
                  {shelterImages.length}
                </span>
              </h4>
              <p className="text-xs font-body text-neo-ash">
                Upload photos of your donation drop-off desk, storage, facility entrance, or team in action.
              </p>
            </div>

            <div>
              <input
                ref={galleryImageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
                className="hidden"
                id="shelter-gallery-upload"
              />

              <button
                type="button"
                disabled={isUploadingGallery}
                onClick={() => galleryImageInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neo-bg border border-neo-line/70 hover:border-neo-sun text-neo-ink hover:text-neo-sun font-heading font-semibold text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isUploadingGallery ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-neo-sun" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-neo-sun" />
                )}
                <span>{isUploadingGallery ? "Uploading..." : "Add Gallery Photos"}</span>
              </button>
            </div>
          </div>

          {/* Gallery Thumbnails Grid */}
          {shelterImages.length === 0 ? (
            <div className="p-6 rounded-xl border border-dashed border-neo-line/70 text-center space-y-1.5 bg-neo-rice/50">
              <Camera className="w-8 h-8 text-neo-ash mx-auto opacity-50" />
              <p className="text-xs font-body text-neo-ash">
                No facility photos uploaded yet. Adding photos increases donor trust and helps them find your drop-off depot.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
              {shelterImages.map((imgUrl, index) => (
                <div
                  key={index}
                  className="group relative aspect-4/3 rounded-xl overflow-hidden border border-neo-line/70 bg-neo-rice shadow-sm"
                >
                  {/* eslint-disable-next-next/no-img-element */}
                  <img
                    src={getOptimizedImageUrl(imgUrl, {
                      width: 300,
                      height: 225,
                      crop: "fill",
                    })}
                    alt={`Shelter gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Delete Overlay */}
                  <div className="absolute inset-0 bg-neo-night/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(index)}
                      className="p-2 rounded-lg bg-red-600 text-neo-rice hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Details Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Facility Name */}
          <div className="space-y-1.5 md:col-span-2">
            <label
              htmlFor="name"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
            >
              Shelter Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Hope Haven Community Shelter"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <label
              htmlFor="description"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
            >
              Mission / About Facility
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a brief summary of the shelter's mission, populations served, and specific donation handling instructions..."
              className="w-full p-3.5 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all resize-none"
            />
          </div>

          {/* Contact Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="contactEmail"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
            >
              Contact Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                required
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="contact@shelter.org"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 000-0000"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
              />
            </div>
          </div>

          {/* Drop-Off Operating Hours */}
          <div className="space-y-1.5">
            <label
              htmlFor="dropOffHours"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
            >
              Drop-Off Operating Hours *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                <Clock className="w-4 h-4" />
              </div>
              <input
                id="dropOffHours"
                name="dropOffHours"
                type="text"
                required
                value={formData.dropOffHours}
                onChange={handleChange}
                placeholder="Mon - Fri: 9:00 AM - 5:00 PM"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <label
              htmlFor="website"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
            >
              Website URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                <Globe className="w-4 h-4" />
              </div>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://www.shelter.org"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
              />
            </div>
          </div>

          {/* Physical Address Section Header */}
          <div className="md:col-span-2 pt-4 border-t border-neo-line/40">
            <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-neo-ash flex items-center gap-1.5 mb-1">
              <MapPin className="w-4 h-4 text-neo-sun" />
              <span>Physical Drop-Off Location & Address</span>
            </h4>
            <p className="text-xs font-body text-neo-ash">
              Enter your street address and fine-tune your precise drop-off coordinates on the interactive map below.
            </p>
          </div>

          {/* Street Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label
              htmlFor="street"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
            >
              Street Address *
            </label>
            <input
              id="street"
              name="street"
              type="text"
              required
              value={formData.street}
              onChange={handleChange}
              placeholder="123 Community Way, Suite 100"
              className="w-full px-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
            />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label
              htmlFor="city"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
            >
              City *
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Seattle"
              className="w-full px-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
            />
          </div>

          {/* State & ZIP */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="state"
                className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
              >
                State *
              </label>
              <input
                id="state"
                name="state"
                type="text"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder="WA"
                className="w-full px-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="zip"
                className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
              >
                ZIP Code *
              </label>
              <input
                id="zip"
                name="zip"
                type="text"
                required
                value={formData.zip}
                onChange={handleChange}
                placeholder="98101"
                className="w-full px-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-body text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
              />
            </div>
          </div>

          {/* Coordinates Direct Inputs */}
          <div className="space-y-1.5">
            <label
              htmlFor="latitude"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash flex items-center justify-between"
            >
              <span>Latitude (Decimal) *</span>
              <span className="font-mono text-[10px] text-neo-sun">Direct Input</span>
            </label>
            <input
              id="latitude"
              name="latitude"
              type="number"
              step="any"
              required
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
              placeholder="37.7749"
              className="w-full px-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-mono text-neo-ink outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="longitude"
              className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash flex items-center justify-between"
            >
              <span>Longitude (Decimal) *</span>
              <span className="font-mono text-[10px] text-neo-sun">Direct Input</span>
            </label>
            <input
              id="longitude"
              name="longitude"
              type="number"
              step="any"
              required
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
              placeholder="-122.4194"
              className="w-full px-4 py-3 rounded-xl bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-2 focus:ring-neo-sun/20 text-sm font-mono text-neo-ink outline-none transition-all"
            />
          </div>

          {/* Interactive Map Picker */}
          <div className="md:col-span-2 space-y-2 pt-2">
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-neo-sun" />
              <span>Interactive Map Point Picker</span>
            </label>
            <CoordinatePickerMap
              latitude={latitude}
              longitude={longitude}
              onChange={handleCoordinatesChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-neo-line/40 flex justify-end">
          <button
            type="submit"
            disabled={saving || isUploadingProfile || isUploadingGallery}
            className="px-6 py-3.5 bg-neo-sun text-neo-rice font-heading font-semibold text-sm rounded-xl border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Facility Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
