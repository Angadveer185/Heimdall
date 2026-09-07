"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  FileText,
  ArrowRight,
  Loader2,
  Info,
  Image as ImageIcon,
  Camera,
  Upload,
  Trash2,
  Plus,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { uploadImageToCloudinary, getOptimizedImageUrl } from "@/lib/cloudinary";

// Dynamically import CoordinatePickerMap with ssr: false for Leaflet
const CoordinatePickerMap = dynamic(
  () => import("@/components/maps/CoordinatePickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 md:h-80 rounded-2xl bg-neo-rice border border-neo-line/60 flex flex-col items-center justify-center text-xs font-body text-neo-ash gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-neo-sun" />
        <span>Loading Interactive Map...</span>
      </div>
    ),
  }
);

interface VerificationCheckState {
  status: "idle" | "checking" | "verified" | "rejected";
  reason?: string;
}

export function ShelterRegisterForm() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  // Hidden file input refs
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  // Form states - Legal / Org Identification
  const [country, setCountry] = useState("USA");
  const [organizationIdType, setOrganizationIdType] = useState("EIN");
  const [organizationId, setOrganizationId] = useState("");

  // Form states - Identity & Contact
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  // Form states - Facility Location & Logistics
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [latitude, setLatitude] = useState<number>(37.7749);
  const [longitude, setLongitude] = useState<number>(-122.4194);
  const [dropOffHours, setDropOffHours] = useState("Mon - Fri: 9:00 AM - 5:00 PM");

  // Form states - Cloudinary Images
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [shelterImages, setShelterImages] = useState<string[]>([]);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // UI / Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [verifyState, setVerifyState] = useState<VerificationCheckState>({ status: "idle" });

  // On mount: attempt to locate user's initial position
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(parseFloat(pos.coords.latitude.toFixed(6)));
          setLongitude(parseFloat(pos.coords.longitude.toFixed(6)));
        },
        (err) => {
          console.warn("Initial geolocation query failed or permission denied:", err.message);
        },
        { timeout: 8000 }
      );
    }
  }, []);

  // Update org type options according to selected country
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setCountry(selected);
    setVerifyState({ status: "idle" });
    if (selected === "USA") {
      setOrganizationIdType("EIN");
    } else if (selected === "India") {
      setOrganizationIdType("NGO_DARPAN");
    } else {
      setOrganizationIdType("CHARITY_NUMBER");
    }
  };

  // Pre-flight check verification
  const handleCheckVerification = async () => {
    if (!organizationId.trim()) {
      setValidationErrors((prev) => ({
        ...prev,
        organizationId: "Please enter an Organization ID to check",
      }));
      return;
    }

    setVerifyState({ status: "checking" });
    try {
      const res = await fetch("/api/shelters/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country.trim(),
          organizationIdType,
          organizationId: organizationId.trim(),
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (json.data.verified) {
          setVerifyState({ status: "verified" });
        } else {
          setVerifyState({
            status: "rejected",
            reason: json.data.rejectionReason || "Verification not found in registry",
          });
        }
      } else {
        setVerifyState({
          status: "rejected",
          reason: json.message || "Unable to reach verification service",
        });
      }
    } catch (err: any) {
      setVerifyState({
        status: "rejected",
        reason: err?.message || "Verification service error",
      });
    }
  };

  // Handle map coordinates change
  const handleCoordinatesChange = (coords: { lat: number; lng: number }) => {
    setLatitude(coords.lat);
    setLongitude(coords.lng);
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy.coordinates;
      return copy;
    });
  };

  // Cloudinary Profile Image Upload
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProfile(true);
    setErrorMsg(null);

    try {
      const result = await uploadImageToCloudinary(file, "shelter-profile");
      setProfileImageUrl(result.secureUrl);
    } catch (err: any) {
      console.error("Profile image upload failed:", err);
      setErrorMsg(`Profile image upload error: ${err.message || "Failed to upload image"}`);
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
  const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    setErrorMsg(null);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadImageToCloudinary(file, "shelter-gallery");
        newUrls.push(result.secureUrl);
      }
      setShelterImages((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      console.error("Gallery images upload failed:", err);
      setErrorMsg(`Gallery upload error: ${err.message || "Failed to upload gallery image"}`);
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

  // Client-side validations
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!name.trim()) errors.name = "Shelter name is required";
    else if (name.trim().length > 100) errors.name = "Name must be at most 100 characters";

    if (!organizationId.trim()) errors.organizationId = "Organization ID is required";

    if (!contactEmail.trim()) {
      errors.contactEmail = "Contact email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail.trim())) {
        errors.contactEmail = "Please enter a valid email address";
      }
    }

    if (!street.trim()) errors.street = "Street address is required";
    if (!city.trim()) errors.city = "City is required";
    if (!state.trim()) errors.state = "State is required";
    if (!zip.trim()) errors.zip = "ZIP code is required";
    if (!dropOffHours.trim()) errors.dropOffHours = "Drop-off hours are required";

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      errors.coordinates = "Valid latitude is required (-90 to 90)";
    }
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      errors.coordinates = "Valid longitude is required (-180 to 180)";
    }

    if (description && description.length > 200) {
      errors.description = "Description must be 200 characters or less";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setValidationErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        country: country.trim(),
        organizationIdType,
        organizationId: organizationId.trim(),
        description: description.trim() || undefined,
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        latitude,
        longitude,
        dropOffHours: dropOffHours.trim(),
        contactEmail: contactEmail.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
        profileImageUrl: profileImageUrl || undefined,
        shelterImages: shelterImages.length > 0 ? shelterImages : undefined,
      };

      const res = await fetch("/api/shelters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        if (resData.errors && Array.isArray(resData.errors)) {
          const errorsMap: { [key: string]: string } = {};
          resData.errors.forEach((err: any) => {
            const field = err.path?.[0];
            if (field) errorsMap[field] = err.message;
          });
          setValidationErrors(errorsMap);
          throw new Error("Validation check failed. Please check the marked fields.");
        }
        throw new Error(resData.message || "Failed to register shelter.");
      }

      // Re-fetch current user profile to synchronize Zustand with new SHELTER_ADMIN role
      try {
        const userRes = await fetch("/api/users/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.success && userData.data) {
            setUser(userData.data);
          }
        }
      } catch (userErr) {
        console.warn("Could not immediately refresh user store:", userErr);
      }

      // Route directly to /shelter/manage
      router.push("/shelter/manage");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred while registering the shelter.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Error Alert Box */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-neo-sun/15 text-neo-sun border border-neo-sun/30 rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-neo-sun" />
              <div className="text-xs font-medium leading-relaxed font-body">{errorMsg}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ======================================================== */}
        {/* SECTION 1: Legal Entity & Organization Verification       */}
        {/* ======================================================== */}
        <div className="p-5 rounded-2xl bg-neo-rice border border-neo-line/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neo-line/40 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-neo-sun/10 text-neo-sun flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-neo-ink">
                  1. Organization Legal Verification
                </h3>
                <p className="text-[11px] font-body text-neo-ash">
                  Verified against official non-profit government registries.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-heading font-semibold uppercase px-2 py-0.5 rounded-md bg-neo-gold/15 text-neo-gold border border-neo-gold/30">
              Required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Country */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neo-ink font-body">
                Country <span className="text-neo-sun">*</span>
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={handleCountryChange}
                  className="w-full font-body text-sm bg-neo-bg border border-neo-line/70 rounded-xl py-2.5 px-3 text-neo-ink focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all"
                >
                  <option value="USA">United States (USA)</option>
                  <option value="India">India</option>
                  <option value="Other">Other / International</option>
                </select>
              </div>
            </div>

            {/* Organization ID Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neo-ink font-body">
                ID Type <span className="text-neo-sun">*</span>
              </label>
              <div className="relative">
                <select
                  value={organizationIdType}
                  onChange={(e) => {
                    setOrganizationIdType(e.target.value);
                    setVerifyState({ status: "idle" });
                  }}
                  className="w-full font-body text-sm bg-neo-bg border border-neo-line/70 rounded-xl py-2.5 px-3 text-neo-ink focus:outline-none focus:ring-2 focus:ring-neo-sun/20 focus:border-neo-sun transition-all"
                >
                  {country === "USA" && (
                    <option value="EIN">EIN (501(c)(3) Employer Identification Number)</option>
                  )}
                  {country === "India" && (
                    <>
                      <option value="NGO_DARPAN">NGO Darpan (NITI Aayog)</option>
                      <option value="SECTION8_CIN">Section 8 Company CIN</option>
                      <option value="TRUST_REGISTRATION">Trust Registration</option>
                      <option value="SOCIETY_REGISTRATION">Society Registration</option>
                    </>
                  )}
                  <option value="CHARITY_NUMBER">Registered Charity Number</option>
                  <option value="OTHER">Other Official Registration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Organization ID with Pre-flight Check Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-neo-ink font-body">
                Organization Registration ID <span className="text-neo-sun">*</span>
              </label>
              <span className="text-[11px] font-mono text-neo-ash">
                {country === "USA"
                  ? "e.g. 13-5562725"
                  : country === "India" && organizationIdType === "NGO_DARPAN"
                    ? "e.g. AA/2021/1234567"
                    : "Official Registration Number"}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                  <FileText className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={organizationId}
                  onChange={(e) => {
                    setOrganizationId(e.target.value);
                    setVerifyState({ status: "idle" });
                  }}
                  placeholder={
                    country === "USA"
                      ? "XX-XXXXXXX"
                      : country === "India"
                        ? "DL/2021/1234567"
                        : "Registration ID"
                  }
                  style={{
                    paddingLeft: "2.75rem",
                    paddingRight: "1rem",
                    paddingTop: "0.65rem",
                    paddingBottom: "0.65rem",
                  }}
                  className={`w-full font-mono text-sm bg-neo-bg border ${validationErrors.organizationId
                      ? "border-neo-sun focus:ring-neo-sun/30"
                      : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
                    } text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-xs focus:outline-none focus:ring-2 transition-all`}
                />
              </div>

              {/* Instant Verification Pre-flight Check */}
              <button
                type="button"
                onClick={handleCheckVerification}
                disabled={verifyState.status === "checking" || !organizationId.trim()}
                className="px-3.5 py-2 rounded-xl border border-neo-line/70 bg-neo-bg text-neo-ink hover:border-neo-sun hover:text-neo-sun font-heading font-semibold text-xs transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {verifyState.status === "checking" ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-neo-sun" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-neo-sun" />
                    <span>Test Registry</span>
                  </>
                )}
              </button>
            </div>

            {/* Validation Error */}
            {validationErrors.organizationId && (
              <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1 font-body">
                <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.organizationId}
              </p>
            )}

            {/* Live Verification Feedback Banner */}
            {verifyState.status === "verified" && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-body flex items-center gap-2 mt-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Organization verified!</strong> Official registry records match successfully.
                </span>
              </div>
            )}
            {verifyState.status === "rejected" && (
              <div className="p-2.5 rounded-xl bg-neo-sun/10 border border-neo-sun/30 text-neo-sun text-xs font-body flex items-start gap-2 mt-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-neo-sun" />
                <span>
                  <strong>Notice:</strong> {verifyState.reason || "Registry lookup did not match."}{" "}
                  Your shelter will be created with status <em>REJECTED</em> pending manual verification.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: Shelter Identity & Contact Info                */}
        {/* ======================================================== */}
        <div className="p-5 rounded-2xl bg-neo-rice border border-neo-line/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-neo-line/40 pb-3">
            <div className="w-7 h-7 rounded-lg bg-neo-sun/10 text-neo-sun flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-neo-ink">
                2. Shelter Identity & Contacts
              </h3>
              <p className="text-[11px] font-body text-neo-ash">
                Primary facility brand and communication channels.
              </p>
            </div>
          </div>

          {/* Shelter Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neo-ink font-body">
              Shelter Facility Name <span className="text-neo-sun">*</span>
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                <Building2 className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hope Haven Community Shelter"
                style={{
                  paddingLeft: "2.75rem",
                  paddingRight: "1rem",
                  paddingTop: "0.65rem",
                  paddingBottom: "0.65rem",
                }}
                className={`w-full font-body text-sm bg-neo-bg border ${validationErrors.name
                    ? "border-neo-sun focus:ring-neo-sun/30"
                    : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
                  } text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-xs focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {validationErrors.name && (
              <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1 font-body">
                <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.name}
              </p>
            )}
          </div>

          {/* Contact Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neo-ink font-body">
                Official Contact Email <span className="text-neo-sun">*</span>
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@shelter.org"
                  style={{
                    paddingLeft: "2.75rem",
                    paddingRight: "1rem",
                    paddingTop: "0.65rem",
                    paddingBottom: "0.65rem",
                  }}
                  className={`w-full font-body text-sm bg-neo-bg border ${validationErrors.contactEmail
                      ? "border-neo-sun focus:ring-neo-sun/30"
                      : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
                    } text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-xs focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {validationErrors.contactEmail && (
                <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1 font-body">
                  <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.contactEmail}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neo-ink font-body">
                Phone Number <span className="text-neo-ash font-normal">(Optional)</span>
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  style={{
                    paddingLeft: "2.75rem",
                    paddingRight: "1rem",
                    paddingTop: "0.65rem",
                    paddingBottom: "0.65rem",
                  }}
                  className="w-full font-body text-sm bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20 text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-xs focus:outline-none focus:ring-2 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Website & Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neo-ink font-body">
              Official Website <span className="text-neo-ash font-normal">(Optional)</span>
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                <Globe className="w-4 h-4" />
              </span>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.shelterexample.org"
                style={{
                  paddingLeft: "2.75rem",
                  paddingRight: "1rem",
                  paddingTop: "0.65rem",
                  paddingBottom: "0.65rem",
                }}
                className="w-full font-body text-sm bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20 text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-xs focus:outline-none focus:ring-2 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-neo-ink font-body">
                Mission / Short Description <span className="text-neo-ash font-normal">(Optional)</span>
              </label>
              <span className="text-[11px] font-mono text-neo-ash">{description.length}/200</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={200}
              placeholder="Providing emergency shelter, daily warm meals, and transitional supplies..."
              className="w-full font-body text-sm bg-neo-bg border border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20 text-neo-ink placeholder-neo-ink/40 rounded-xl p-3 shadow-xs focus:outline-none focus:ring-2 transition-all resize-none"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: Physical Location & Interactive Leaflet Map     */}
        {/* ======================================================== */}
        <div className="p-5 rounded-2xl bg-neo-rice border border-neo-line/70 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-neo-line/40 pb-3">
            <div className="w-7 h-7 rounded-lg bg-neo-sun/10 text-neo-sun flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-neo-ink">
                3. Facility Location & Geographic Coordinates
              </h3>
              <p className="text-[11px] font-body text-neo-ash">
                Pin your shelter location on the interactive map for donor navigation and drop-offs.
              </p>
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neo-ink font-body">
              Street Address <span className="text-neo-sun">*</span>
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Community Way, Suite 400"
                style={{
                  paddingLeft: "2.75rem",
                  paddingRight: "1rem",
                  paddingTop: "0.65rem",
                  paddingBottom: "0.65rem",
                }}
                className={`w-full font-body text-sm bg-neo-bg border ${validationErrors.street
                    ? "border-neo-sun focus:ring-neo-sun/30"
                    : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
                  } text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-xs focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {validationErrors.street && (
              <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1 font-body">
                <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.street}
              </p>
            )}
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neo-ink font-body">
                City <span className="text-neo-sun">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco"
                className={`w-full font-body text-sm bg-neo-bg border ${validationErrors.city
                    ? "border-neo-sun focus:ring-neo-sun/30"
                    : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
                  } text-neo-ink placeholder-neo-ink/40 rounded-xl px-3 py-2.5 shadow-xs focus:outline-none focus:ring-2 transition-all`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neo-ink font-body">
                State / Province <span className="text-neo-sun">*</span>
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="CA"
                className={`w-full font-body text-sm bg-neo-bg border ${validationErrors.state
                    ? "border-neo-sun focus:ring-neo-sun/30"
                    : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
                  } text-neo-ink placeholder-neo-ink/40 rounded-xl px-3 py-2.5 shadow-xs focus:outline-none focus:ring-2 transition-all`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neo-ink font-body">
                ZIP / Postal <span className="text-neo-sun">*</span>
              </label>
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="94103"
                className={`w-full font-body text-sm bg-neo-bg border ${validationErrors.zip
                    ? "border-neo-sun focus:ring-neo-sun/30"
                    : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
                  } text-neo-ink placeholder-neo-ink/40 rounded-xl px-3 py-2.5 shadow-xs focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
          </div>

          {/* Interactive Leaflet Map Component */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-neo-ink font-body">
              Pin Facility Location on Map <span className="text-neo-sun">*</span>
            </label>
            <CoordinatePickerMap
              latitude={latitude}
              longitude={longitude}
              onChange={handleCoordinatesChange}
            />
            {validationErrors.coordinates && (
              <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1 font-body">
                <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.coordinates}
              </p>
            )}
          </div>

          {/* Drop-off Hours */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-neo-ink font-body">
              Drop-Off Hours <span className="text-neo-sun">*</span>
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
                <Clock className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={dropOffHours}
                onChange={(e) => setDropOffHours(e.target.value)}
                placeholder="e.g. Mon - Fri: 9:00 AM - 5:00 PM, Sat: 10:00 AM - 2:00 PM"
                style={{
                  paddingLeft: "2.75rem",
                  paddingRight: "1rem",
                  paddingTop: "0.65rem",
                  paddingBottom: "0.65rem",
                }}
                className={`w-full font-body text-sm bg-neo-bg border ${validationErrors.dropOffHours
                    ? "border-neo-sun focus:ring-neo-sun/30"
                    : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
                  } text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-xs focus:outline-none focus:ring-2 transition-all`}
              />
            </div>
            {validationErrors.dropOffHours && (
              <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1 font-body">
                <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.dropOffHours}
              </p>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: Cloudinary Image Uploads                       */}
        {/* ======================================================== */}
        <div className="p-5 rounded-2xl bg-neo-rice border border-neo-line/70 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-neo-line/40 pb-3">
            <div className="w-7 h-7 rounded-lg bg-neo-sun/10 text-neo-sun flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-neo-ink">
                4. Facility Media & Images
              </h3>
              <p className="text-[11px] font-body text-neo-ash">
                Upload authentic facility photos via Cloudinary to boost community trust.
              </p>
            </div>
          </div>

          {/* 4.1 Profile / Logo Image */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl border-2 border-neo-line/70 bg-neo-bg overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                  {profileImageUrl ? (
                    /* eslint-disable-next-next/no-img-element */
                    <img
                      src={getOptimizedImageUrl(profileImageUrl, {
                        width: 120,
                        height: 120,
                        crop: "fill",
                      })}
                      alt="Shelter logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-7 h-7 text-neo-ash/60" />
                  )}
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-sm text-neo-ink">
                    Shelter Profile / Logo Image
                  </h4>
                  <p className="text-xs font-body text-neo-ash">
                    Square PNG or JPEG recommended (up to 5MB).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={profileImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isUploadingProfile}
                  onClick={() => profileImageInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neo-bg border border-neo-line/70 hover:border-neo-sun text-neo-ink hover:text-neo-sun font-heading font-semibold text-xs transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isUploadingProfile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-neo-sun" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-neo-sun" />
                  )}
                  <span>{profileImageUrl ? "Change Photo" : "Upload Logo"}</span>
                </button>

                {profileImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveProfileImage}
                    className="p-2 rounded-xl border border-red-500/40 text-red-600 hover:bg-red-500/10 transition-all cursor-pointer shadow-xs"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4.2 Facility Gallery Showcase Photos */}
          <div className="space-y-3 pt-4 border-t border-neo-line/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-heading font-semibold text-sm text-neo-ink flex items-center gap-2">
                  <span>Facility Gallery Photos</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neo-sun/15 text-neo-sun font-semibold">
                    {shelterImages.length}
                  </span>
                </h4>
                <p className="text-xs font-body text-neo-ash">
                  Showcase the entrance, donation drop-off depot, and facilities.
                </p>
              </div>

              <input
                ref={galleryImageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={isUploadingGallery}
                onClick={() => galleryImageInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neo-bg border border-neo-line/70 hover:border-neo-sun text-neo-ink hover:text-neo-sun font-heading font-semibold text-xs transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isUploadingGallery ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-neo-sun" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-neo-sun" />
                )}
                <span>Add Gallery Photos</span>
              </button>
            </div>

            {/* Gallery Thumbnails Grid */}
            {shelterImages.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-neo-line/70 text-center space-y-1.5 bg-neo-bg/40">
                <Camera className="w-7 h-7 text-neo-ash/60 mx-auto" />
                <p className="text-xs font-body text-neo-ash">
                  No facility photos uploaded yet. High-quality photos increase donor pledges and assist navigation.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {shelterImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="group relative aspect-4/3 rounded-xl overflow-hidden border border-neo-line/70 bg-neo-bg shadow-xs"
                  >
                    {/* eslint-disable-next-next/no-img-element */}
                    <img
                      src={getOptimizedImageUrl(imgUrl, {
                        width: 300,
                        height: 225,
                        crop: "fill",
                      })}
                      alt={`Shelter gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Delete overlay on hover */}
                    <div className="absolute inset-0 bg-neo-night/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="p-2 rounded-lg bg-red-600 text-neo-rice hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                        title="Remove photo"
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

        {/* ======================================================== */}
        {/* SUBMIT BUTTON & DISCLAIMER                               */}
        {/* ======================================================== */}
        <div className="pt-2 space-y-4">
          <button
            type="submit"
            disabled={isSubmitting || isUploadingProfile || isUploadingGallery}
            className="w-full flex items-center justify-center gap-2 font-heading font-semibold py-4 px-6 text-sm text-neo-rice bg-neo-sun hover:bg-neo-sun/90 rounded-xl shadow-md shadow-neo-sun/20 hover:shadow-lg hover:shadow-neo-sun/25 transition-all duration-200 cursor-pointer disabled:opacity-65"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-neo-rice" />
                Verifying Registry & Registering Shelter...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Register Shelter & Enter Console
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
