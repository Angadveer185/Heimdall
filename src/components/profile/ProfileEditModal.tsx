"use client";

import React, { useState, useRef } from "react";
import { UserData, useUserStore } from "@/store/useUserStore";
import {
  X,
  User,
  Mail,
  Phone,
  Upload,
  Lock,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Camera,
  Trash2,
} from "lucide-react";

interface ProfileEditModalProps {
  user: UserData;
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ user, isOpen, onClose }: ProfileEditModalProps) {
  const setUser = useUserStore((state) => state.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle direct device file upload to Cloudinary via backend signature
  const handleDeviceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsUploadingImage(true);

    try {
      // 1. Fetch upload signature from backend API
      const sigRes = await fetch("/api/upload/signature?type=profile");
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
    setSuccessMsg(null);

    if (password && password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = {};
      if (name !== user.name) payload.name = name;
      if (email !== user.email) payload.email = email;
      if (phone !== (user.phone || "")) payload.phone = phone || null;
      if (profileImageUrl !== (user.profileImageUrl || ""))
        payload.profileImageUrl = profileImageUrl || null;
      if (password) payload.password = password;

      if (Object.keys(payload).length === 0) {
        setErrorMsg("No changes detected");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.data);
        setSuccessMsg("Profile updated successfully!");
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setErrorMsg(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl border border-neo-line bg-neo-rice shadow-2xl p-6 md:p-8 my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-neo-line pb-4 mb-6">
          <div>
            <span className="text-[10px] font-label tracking-widest text-neo-ash uppercase block">
              USER MODIFICATION // PROFILE DOSSIER
            </span>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Update Profile Information
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="p-1.5 border border-neo-line bg-neo-bg text-neo-ink hover:text-neo-sun hover:border-neo-sun transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Card */}
        <div className="p-3 bg-neo-ash/10 border border-neo-line flex items-start gap-3 mb-5">
          <ShieldAlert className="w-5 h-5 text-neo-sun shrink-0 mt-0.5" />
          <p className="text-xs font-body text-neo-ink">
            Update your personal contact details on the left, and your profile photo or password on the right.
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-900/10 border border-red-500/40 text-red-600 dark:text-red-400 text-xs font-label mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-900/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-label mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Container: 1x2 Grid on Desktop, Vertical Stack on Mobile */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* LEFT COLUMN: Name, Email, Phone */}
            <div className="space-y-4 md:border-r md:border-neo-line md:pr-6 lg:pr-8">
              <span className="text-xs font-label uppercase text-neo-sun tracking-wider font-semibold block border-b border-neo-line/40 pb-2">
                Personal Contact Details
              </span>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-label uppercase text-neo-ink mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-2.5 bg-neo-bg border border-neo-line text-neo-ink font-body text-sm focus:outline-none focus:border-neo-sun transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-label uppercase text-neo-ink mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-2.5 bg-neo-bg border border-neo-line text-neo-ink font-body text-sm focus:outline-none focus:border-neo-sun transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-label uppercase text-neo-ink mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-neo-bg border border-neo-line text-neo-ink font-body text-sm focus:outline-none focus:border-neo-sun transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Profile Photo & Password */}
            <div className="space-y-4">
              <span className="text-xs font-label uppercase text-neo-sun tracking-wider font-semibold block border-b border-neo-line/40 pb-2">
                Profile Photo & Security
              </span>

              {/* Profile Photo Upload Area */}
              <div>
                <label className="block text-xs font-label uppercase text-neo-ink mb-2">
                  Profile Photo (Device Upload)
                </label>

                <div className="flex items-center gap-4 p-3 bg-neo-bg border border-neo-line">
                  {/* Preview Box */}
                  <div className="w-16 h-16 border border-neo-line bg-neo-rice flex items-center justify-center overflow-hidden shrink-0 relative">
                    {profileImageUrl ? (
                      /* eslint-disable-next-next/no-img-element */
                      <img
                        src={profileImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-neo-ash" />
                    )}

                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-neo-rice">
                        <Loader2 className="w-5 h-5 animate-spin text-neo-sun" />
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-1.5 flex-1">
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
                            <span>Upload</span>
                          </>
                        )}
                      </button>

                      {profileImageUrl && (
                        <button
                          type="button"
                          onClick={() => setProfileImageUrl("")}
                          className="px-2.5 py-1.5 border border-neo-line bg-neo-rice text-neo-ink font-label text-xs uppercase hover:border-red-500 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] font-label text-neo-ash">
                      Direct device upload to Cloudinary storage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="pt-2 border-t border-neo-line/60 space-y-3">
                <span className="text-[11px] font-label tracking-widest text-neo-ash uppercase block">
                  Change Password (Optional)
                </span>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-label uppercase text-neo-ink mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      className="w-full pl-11 pr-4 py-2.5 bg-neo-bg border border-neo-line text-neo-ink font-body text-sm focus:outline-none focus:border-neo-sun transition-colors"
                      placeholder="At least 8 characters"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-label uppercase text-neo-ink mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neo-ash">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
                      className="w-full pl-11 pr-4 py-2.5 bg-neo-bg border border-neo-line text-neo-ink font-body text-sm focus:outline-none focus:border-neo-sun transition-colors"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neo-line">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-neo-line bg-neo-bg text-neo-ink font-label text-xs uppercase hover:border-neo-sun transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="px-6 py-2.5 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 active:translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
