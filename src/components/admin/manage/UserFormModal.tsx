"use client";

import React, { useState, useEffect, useRef } from "react";
import { FullUserData } from "./UserPoolCard";
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  ShieldAlert,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Upload,
  Camera,
  Trash2,
} from "lucide-react";

interface ShelterOption {
  id: string;
  name: string;
  city?: string;
  state?: string;
}

interface UserFormModalProps {
  isOpen: boolean;
  user: FullUserData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserFormModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: UserFormModalProps) {
  const isEditing = Boolean(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"DONOR" | "SHELTER_ADMIN" | "SUPER_ADMIN">("DONOR");
  const [phone, setPhone] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [shelterId, setShelterId] = useState<string>("");
  const [isReported, setIsReported] = useState(false);

  // Uploading & Submitting State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available shelters dropdown state
  const [shelters, setShelters] = useState<ShelterOption[]>([]);
  const [loadingShelters, setLoadingShelters] = useState(false);

  // Fetch available shelters for assignment
  useEffect(() => {
    if (!isOpen) return;

    const fetchShelters = async () => {
      setLoadingShelters(true);
      try {
        const res = await fetch("/api/shelters", { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.success) {
          setShelters(data.data || []);
        }
      } catch (err) {
        console.error("Failed to load shelters for assignment:", err);
      } finally {
        setLoadingShelters(false);
      }
    };

    fetchShelters();
  }, [isOpen]);

  // Sync form state when modal opens or user prop changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPassword("");
      setRole(user.role || "DONOR");
      setPhone(user.phone || "");
      setProfileImageUrl(user.profileImageUrl || "");
      setShelterId(user.shelterId || user.shelter?.id || "");
      setIsReported(user.isReported || false);
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("DONOR");
      setPhone("");
      setProfileImageUrl("");
      setShelterId("");
      setIsReported(false);
    }
    setErrorMsg(null);
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Cloudinary direct file upload handler
  const handleDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsUploadingImage(true);

    try {
      // 1. Fetch Cloudinary upload signature from backend
      const sigRes = await fetch("/api/upload/signature?type=profile", { credentials: "include" });
      const sigData = await sigRes.json();

      if (!sigRes.ok || !sigData.success || !sigData.data) {
        throw new Error(sigData.message || "Failed to fetch Cloudinary signature");
      }

      const { signature, timestamp, apiKey, cloudName, folder } = sigData.data;

      // 2. Build FormData for direct Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      // 3. Post to Cloudinary REST endpoint
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      if (uploadRes.ok && uploadData.secure_url) {
        setProfileImageUrl(uploadData.secure_url);
      } else {
        throw new Error(uploadData.error?.message || "Cloudinary upload failed");
      }
    } catch (err: unknown) {
      console.error("Cloudinary image upload error:", err);
      const msg = err instanceof Error ? err.message : "Image upload failed";
      setErrorMsg(`Image upload failed: ${msg}`);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!name.trim()) {
      setErrorMsg("Please enter the user's full name.");
      return;
    }
    if (!isEditing && !email.trim()) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!isEditing && !password.trim()) {
      setErrorMsg("Password is required when creating a new user.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isEditing ? `/api/users/${user?.id}` : "/api/users";
      const method = isEditing ? "PATCH" : "POST";

      const payload: Record<string, unknown> = {
        name: name.trim(),
        role,
        phone: phone.trim() ? phone.trim() : null,
        profileImageUrl: profileImageUrl.trim() ? profileImageUrl.trim() : null,
        shelterId: shelterId.trim() ? shelterId.trim() : null,
        ...(isEditing && { isReported }),
      };

      if (!isEditing) {
        payload.email = email.trim();
        payload.password = password.trim();
      }

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to ${isEditing ? "update" : "create"} user.`);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("User form submit error:", err);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(msg);
    } fontFinally: {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neo-night/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg border border-neo-line bg-neo-rice p-6 md:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neo-line pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-label tracking-widest text-neo-sun uppercase font-bold">
                {isEditing ? "UPDATE USER DOSSIER" : "CREATE NEW USER"}
              </span>
              <h3 className="font-heading font-bold text-xl text-neo-ink">
                {isEditing ? `Edit User: ${user?.name}` : "Add New User Entry"}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 border border-neo-line text-neo-ash hover:text-neo-sun hover:border-neo-sun transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3 bg-neo-sun/10 border border-neo-sun/40 text-neo-sun text-xs font-body flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-label text-neo-ink uppercase tracking-wider block font-bold">
              Full Name <span className="text-neo-sun">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kenji Takahashi"
                required
                className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors"
              />
            </div>
          </div>

          {/* Email & Password Fields (Shown ONLY when creating new user) */}
          {!isEditing && (
            <>
              <div className="space-y-1">
                <label className="text-[11px] font-label text-neo-ink uppercase tracking-wider block font-bold">
                  Email Address <span className="text-neo-sun">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@heimdall.org"
                    required
                    className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-label text-neo-ink uppercase tracking-wider block font-bold">
                  Password <span className="text-neo-sun">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    minLength={8}
                    className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Role Selection Radio Group */}
          <div className="space-y-1">
            <label className="text-[11px] font-label text-neo-ink uppercase tracking-wider block font-bold">
              User System Role <span className="text-neo-sun">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole("DONOR")}
                className={`py-2 px-3 border text-xs font-label uppercase text-center transition-all ${
                  role === "DONOR"
                    ? "bg-neo-sun/15 border-neo-sun text-neo-sun font-bold"
                    : "bg-neo-bg border-neo-line text-neo-ink hover:border-neo-sun"
                }`}
              >
                Donor
              </button>

              <button
                type="button"
                onClick={() => setRole("SHELTER_ADMIN")}
                className={`py-2 px-3 border text-xs font-label uppercase text-center transition-all ${
                  role === "SHELTER_ADMIN"
                    ? "bg-amber-900/20 border-amber-500 text-amber-500 font-bold"
                    : "bg-neo-bg border-neo-line text-neo-ink hover:border-neo-sun"
                }`}
              >
                Shelter Admin
              </button>

              <button
                type="button"
                onClick={() => setRole("SUPER_ADMIN")}
                className={`py-2 px-3 border text-xs font-label uppercase text-center transition-all ${
                  role === "SUPER_ADMIN"
                    ? "bg-neo-sun text-neo-rice border-neo-sun font-bold"
                    : "bg-neo-bg border-neo-line text-neo-ink hover:border-neo-sun"
                }`}
              >
                Super Admin
              </button>
            </div>
          </div>

          {/* Phone Number Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-label text-neo-ink uppercase tracking-wider block font-bold">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 019-2834"
                className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors"
              />
            </div>
          </div>

          {/* Shelter Assignment Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-label text-neo-ink uppercase tracking-wider block font-bold">
              Associated Shelter (Recommended for Shelter Admins)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                <Building2 className="w-4 h-4" />
              </div>
              <select
                value={shelterId}
                onChange={(e) => setShelterId(e.target.value)}
                disabled={loadingShelters}
                className="w-full bg-neo-bg border border-neo-line text-neo-ink pl-11 pr-3 py-2.5 text-xs font-body focus:outline-none focus:border-neo-sun transition-colors disabled:opacity-50"
              >
                <option value="">-- No Shelter Attached --</option>
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.city ? `(${s.city}, ${s.state})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cloudinary Profile Photo Upload Section */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-label text-neo-ink uppercase tracking-wider block font-bold">
              Profile Photo (Cloudinary Upload)
            </label>

            <div className="flex items-center gap-4 p-3 bg-neo-bg border border-neo-line">
              {/* Preview Thumbnail */}
              <div className="w-14 h-14 border border-neo-line bg-neo-rice flex items-center justify-center overflow-hidden shrink-0 relative shadow-inner">
                {profileImageUrl ? (
                  /* eslint-disable-next-next/no-img-element */
                  <img
                    src={profileImageUrl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-5 h-5 text-neo-ash" />
                )}

                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-neo-rice">
                    <Loader2 className="w-4 h-4 animate-spin text-neo-sun" />
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="space-y-1 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleDeviceImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-neo-sun text-neo-rice font-label text-xs uppercase border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </>
                    )}
                  </button>

                  {profileImageUrl && (
                    <button
                      type="button"
                      onClick={() => setProfileImageUrl("")}
                      className="px-2.5 py-1.5 border border-neo-line bg-neo-rice text-neo-ink font-label text-xs uppercase hover:border-neo-sun hover:text-neo-sun transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-neo-sun" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <p className="text-[10px] font-label text-neo-ash">
                  Upload directly to Cloudinary storage.
                </p>
              </div>
            </div>
          </div>

          {/* Is Reported Checkbox (Only for edit) */}
          {isEditing && (
            <div className="pt-2">
              <label className="p-3 bg-neo-bg border border-neo-line flex items-center gap-3 cursor-pointer hover:border-neo-sun transition-colors">
                <input
                  type="checkbox"
                  checked={isReported}
                  onChange={(e) => setIsReported(e.target.checked)}
                  className="w-4 h-4 accent-neo-sun rounded-none"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-label uppercase font-bold text-neo-ink flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-neo-sun" />
                    <span>Flag Account as Reported / Suspended</span>
                  </span>
                  <p className="text-[11px] font-body text-neo-ash">
                    Check this box if the user has been reported for policy violations.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neo-line">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-neo-bg text-neo-ink font-label text-xs uppercase border border-neo-line hover:border-neo-sun transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="px-6 py-2.5 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditing ? "Save Changes" : "Create User"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
