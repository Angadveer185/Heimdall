"use client";

import React, { useState, useEffect } from "react";
import { FullShelterData } from "./ShelterDetailModal";
import {
  X,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Clock,
  AlertCircle,
  Loader2,
  FileText,
  Compass,
  CheckCircle2,
  AlertOctagon,
} from "lucide-react";

interface ShelterFormModalProps {
  isOpen: boolean;
  shelter: FullShelterData | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ORGANIZATION_TYPES = [
  { value: "EIN", label: "EIN (USA 501(c)(3))" },
  { value: "NGO_DARPAN", label: "NGO Darpan (India)" },
  { value: "SECTION8_CIN", label: "Section 8 CIN (India)" },
  { value: "SOCIETY_REGISTRATION", label: "Society Registration" },
  { value: "TRUST_REGISTRATION", label: "Trust Registration" },
  { value: "CHARITY_NUMBER", label: "Charity Registration Number" },
  { value: "OTHER", label: "Other Registration ID" },
];

const VERIFICATION_STATUSES = [
  { value: "PENDING", label: "Pending Verification", icon: Clock },
  { value: "VERIFIED", label: "Verified Non-Profit", icon: CheckCircle2 },
  { value: "REJECTED", label: "Rejected Application", icon: AlertOctagon },
];

export function ShelterFormModal({
  isOpen,
  shelter,
  onClose,
  onSuccess,
}: ShelterFormModalProps) {
  const isEditing = Boolean(shelter);

  // Form Field States
  const [name, setName] = useState("");
  const [country, setCountry] = useState("USA");
  const [organizationIdType, setOrganizationIdType] = useState("EIN");
  const [organizationId, setOrganizationId] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"PENDING" | "VERIFIED" | "REJECTED">("PENDING");
  const [rejectionReason, setRejectionReason] = useState("");
  const [description, setDescription] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [latitude, setLatitude] = useState<number | "">(37.7749);
  const [longitude, setLongitude] = useState<number | "">(-122.4194);
  const [dropOffHours, setDropOffHours] = useState("Mon-Fri 9:00 AM - 5:00 PM");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (shelter) {
      setName(shelter.name || "");
      setCountry(shelter.country || "USA");
      setOrganizationIdType(shelter.organizationIdType || "EIN");
      setOrganizationId(shelter.organizationId || "");
      setVerificationStatus(shelter.verificationStatus || "PENDING");
      setRejectionReason(shelter.rejectionReason || "");
      setDescription(shelter.description || "");
      setStreet(shelter.street || "");
      setCity(shelter.city || "");
      setState(shelter.state || "");
      setZip(shelter.zip || "");
      setLatitude(shelter.latitude ?? 37.7749);
      setLongitude(shelter.longitude ?? -122.4194);
      setDropOffHours(shelter.dropOffHours || "Mon-Fri 9:00 AM - 5:00 PM");
      setContactEmail(shelter.contactEmail || "");
      setPhone(shelter.phone || "");
      setWebsite(shelter.website || "");
    } else {
      setName("");
      setCountry("USA");
      setOrganizationIdType("EIN");
      setOrganizationId("");
      setVerificationStatus("PENDING");
      setRejectionReason("");
      setDescription("");
      setStreet("");
      setCity("");
      setState("");
      setZip("");
      setLatitude(37.7749);
      setLongitude(-122.4194);
      setDropOffHours("Mon-Fri 9:00 AM - 5:00 PM");
      setContactEmail("");
      setPhone("");
      setWebsite("");
    }
    setErrorMsg(null);
  }, [shelter, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validation
    if (!name.trim()) return setErrorMsg("Shelter name is required.");
    if (!organizationId.trim()) return setErrorMsg("Organization ID is required.");
    if (!street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      return setErrorMsg("Complete physical address is required.");
    }
    if (!contactEmail.trim()) return setErrorMsg("Contact email is required.");
    if (!dropOffHours.trim()) return setErrorMsg("Drop-off hours are required.");

    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        country: country.trim(),
        organizationIdType,
        organizationId: organizationId.trim(),
        description: description.trim() || undefined,
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        latitude: typeof latitude === "number" ? latitude : parseFloat(String(latitude)) || 0,
        longitude: typeof longitude === "number" ? longitude : parseFloat(String(longitude)) || 0,
        dropOffHours: dropOffHours.trim(),
        contactEmail: contactEmail.trim(),
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
      };

      if (isEditing) {
        payload.verificationStatus = verificationStatus;
        if (verificationStatus === "REJECTED") {
          payload.rejectionReason = rejectionReason.trim() || "Registration rejected by Super Admin.";
        }
      }

      const url = shelter ? `/api/shelters/${shelter.id}` : "/api/shelters";
      const method = shelter ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to ${shelter ? "update" : "create"} shelter.`);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Shelter form submit error:", err);
      const msg = err instanceof Error ? err.message : "Failed to process request.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-neo-rice border border-neo-line/60 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl my-8 text-neo-ink overflow-y-scroll scrollbar-thumb-neo-line">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neo-line/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center shrink-0 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neo-sun/10 text-neo-sun text-[10px] font-heading font-semibold tracking-wide">
                {shelter ? "Edit Shelter Dossier" : "Register New Shelter Entry"}
              </div>
              <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
                {shelter ? `Edit: ${shelter.name}` : "Create New Shelter Entry"}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-ash hover:text-neo-sun hover:border-neo-sun transition-all cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-neo-sun/15 border border-neo-sun/30 text-neo-sun flex items-start gap-3 text-xs font-body">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-heading font-bold block">Validation Error</span>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-body">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-neo-sun uppercase tracking-wider flex items-center gap-2 border-b border-neo-line/40 pb-1">
              <FileText className="w-4 h-4" />
              <span>1. Basic Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Shelter Name */}
              <div className="space-y-1.5">
                <label className="font-heading font-semibold text-neo-ink block">
                  Shelter Name <span className="text-neo-sun">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ink/50">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. St. Jude Hope Haven Shelter"
                    className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="font-heading font-semibold text-neo-ink block">
                  Country <span className="text-neo-sun">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ink/50">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. USA or India"
                    className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Organization ID Type */}
              <div className="space-y-1.5">
                <label className="font-heading font-semibold text-neo-ink block">
                  Organization ID Type <span className="text-neo-sun">*</span>
                </label>
                <select
                  value={organizationIdType}
                  onChange={(e) => setOrganizationIdType(e.target.value)}
                  className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink px-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm cursor-pointer"
                >
                  {ORGANIZATION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organization ID */}
              <div className="space-y-1.5">
                <label className="font-heading font-semibold text-neo-ink block">
                  Organization ID Number <span className="text-neo-sun">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ink/50">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={organizationId}
                    onChange={(e) => setOrganizationId(e.target.value)}
                    placeholder="e.g. 12-3456789"
                    className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm font-label"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-heading font-semibold text-neo-ink block">
                Mission Description / Overview
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief description of the shelter's mission, community focus, and services..."
                className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink p-3 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm resize-none"
              />
            </div>

            {/* Super Admin Status Controls (Editing Mode) */}
            {isEditing && (
              <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-3">
                <span className="font-heading font-bold text-xs text-neo-gold uppercase tracking-wider block">
                  Super Admin Verification Override
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-heading font-semibold text-neo-ink block">
                      Verification Status
                    </label>
                    <select
                      value={verificationStatus}
                      onChange={(e) => setVerificationStatus(e.target.value as "PENDING" | "VERIFIED" | "REJECTED")}
                      className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink px-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm cursor-pointer"
                    >
                      {VERIFICATION_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {verificationStatus === "REJECTED" && (
                    <div className="space-y-1.5">
                      <label className="font-heading font-semibold text-neo-ink block">
                        Rejection Reason
                      </label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason for rejecting verification..."
                        className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink px-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Location & Address */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-neo-sun uppercase tracking-wider flex items-center gap-2 border-b border-neo-line/40 pb-1">
              <MapPin className="w-4 h-4" />
              <span>2. Location & Address</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Street */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-heading font-semibold text-neo-ink block">
                  Street Address <span className="text-neo-sun">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ink/50">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 123 Community Way, Suite 400"
                    className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="font-heading font-semibold text-neo-ink block">
                  City <span className="text-neo-sun">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. San Francisco"
                  className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink px-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                  required
                />
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className="font-heading font-semibold text-neo-ink block">
                  State / Province <span className="text-neo-sun">*</span>
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. CA"
                  className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink px-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                  required
                />
              </div>

              {/* ZIP */}
              <div className="space-y-1.5">
                <label className="font-heading font-semibold text-neo-ink block">
                  ZIP / Postal Code <span className="text-neo-sun">*</span>
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="e.g. 94103"
                  className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink px-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm font-label"
                  required
                />
              </div>

              {/* Coordinates: Latitude & Longitude */}
              <div className="space-y-1.5">
                <label className="font-heading font-semibold text-neo-ink block">
                  Coordinates (Lat / Long)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neo-ink/50 text-[10px]">
                      LAT
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value === "" ? "" : parseFloat(e.target.value))}
                      placeholder="37.7749"
                      className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink pl-9 pr-2 py-2.5 text-xs font-label focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neo-ink/50 text-[10px]">
                      LNG
                    </div>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value === "" ? "" : parseFloat(e.target.value))}
                      placeholder="-122.4194"
                      className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink pl-9 pr-2 py-2.5 text-xs font-label focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Operations & Contact */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-neo-sun uppercase tracking-wider flex items-center gap-2 border-b border-neo-line/40 pb-1">
              <Clock className="w-4 h-4" />
              <span>3. Operations & Contact</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Drop-off Hours */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-heading font-semibold text-neo-ink block">
                  Drop-off Hours <span className="text-neo-sun">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ink/50">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={dropOffHours}
                    onChange={(e) => setDropOffHours(e.target.value)}
                    placeholder="e.g. Mon-Fri 9:00 AM - 5:00 PM, Sat 10:00 AM - 2:00 PM"
                    className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Contact Email */}
              <div className="space-y-1.5">
                <label className="font-heading font-semibold text-neo-ink block">
                  Contact Email <span className="text-neo-sun">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ink/50">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. contact@shelter.org"
                    className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="font-heading font-semibold text-neo-ink block">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ink/50">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (415) 555-0199"
                    className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-heading font-semibold text-neo-ink block">
                  Official Website URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ink/50">
                    <Globe className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://www.shelter.org"
                    className="w-full bg-neo-rice border border-neo-line/70 rounded-xl text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-neo-line/40 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2.5 rounded-xl bg-neo-bg border border-neo-line/60 text-neo-ink hover:border-neo-sun font-body text-xs transition-all shadow-sm cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-2 shadow-md shadow-neo-sun/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Shelter...</span>
                </>
              ) : (
                <span>{isEditing ? "Save Changes" : "Create Shelter Record"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
