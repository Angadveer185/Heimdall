"use client";

import React, { useState } from "react";
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
} from "lucide-react";

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
  dropOffHours: string;
  contactEmail: string;
  phone?: string | null;
  website?: string | null;
  profileImageUrl?: string | null;
}

interface ShelterEditFormProps {
  shelter: ShelterDetails;
  onUpdateSuccess: () => void;
}

export function ShelterEditForm({ shelter, onUpdateSuccess }: ShelterEditFormProps) {
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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
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
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-6 md:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-line/40 pb-5">
        <div>
          <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink flex items-center gap-2">
            <Building2 className="w-5 h-5 text-neo-sun" />
            <span>Facility Profile & Operational Information</span>
          </h2>
          <p className="text-xs font-body text-neo-ash mt-0.5">
            Keep your facility address, operating hours, and donor contact channels accurate and up-to-date.
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

      {/* Form */}
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

          {/* Address Header */}
          <div className="md:col-span-2 pt-2 border-t border-neo-line/40">
            <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-neo-ash flex items-center gap-1.5 mb-3">
              <MapPin className="w-4 h-4 text-neo-sun" />
              <span>Physical Drop-Off Location</span>
            </h4>
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
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-neo-line/40 flex justify-end">
          <button
            type="submit"
            disabled={saving}
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
