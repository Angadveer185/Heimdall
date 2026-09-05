"use client";

import React from "react";
import {
  User as UserIcon,
  ShieldCheck,
  Calendar,
  Mail,
  Phone,
  Heart,
  Award,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface PublicUserData {
  id: string;
  name: string;
  email?: string | null;
  role: string;
  phone?: string | null;
  profileImageUrl?: string | null;
  createdAt: string;
  pledgesCompleted: number;
  pledgesExpired: number;
  isReported?: boolean;
  shelterId?: string | null;
  shelter?: {
    id: string;
    name: string;
    city: string;
    state: string;
    country?: string;
    description?: string | null;
    profileImageUrl?: string | null;
    verificationStatus?: string;
    dropOffHours?: string;
    contactEmail?: string;
    phone?: string | null;
    website?: string | null;
  } | null;
}

interface PublicProfileHeaderCardProps {
  user: PublicUserData;
}

export function PublicProfileHeaderCard({ user }: PublicProfileHeaderCardProps) {
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const isShelterAdmin = user.role === "SHELTER_ADMIN" || isSuperAdmin;
  const joinedDate = formatDate(user.createdAt, "Member", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-6 space-y-6 shadow-sm">
      {/* Top Banner & Profile Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* User Avatar */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-neo-line/60 bg-neo-bg text-neo-sun flex items-center justify-center overflow-hidden shrink-0 shadow-md">
            {user.profileImageUrl ? (
              /* eslint-disable-next-next/no-img-element */
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-heading font-bold text-2xl uppercase text-neo-sun">
                {user.name ? user.name.charAt(0) : "U"}
              </span>
            )}
          </div>

          {/* User Name & Details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading font-bold text-2xl md:text-3xl text-neo-ink leading-tight">
                {user.name}
              </h1>

              <span
                className={`px-3 py-0.5 text-xs font-heading font-semibold rounded-full border uppercase tracking-wider ${
                  isSuperAdmin
                    ? "bg-neo-sun/15 border-neo-sun/30 text-neo-sun"
                    : isShelterAdmin
                      ? "bg-neo-sun/15 border-neo-sun/30 text-neo-sun"
                      : "bg-neo-sun/10 border-neo-sun/20 text-neo-sun"
                }`}
              >
                {user.role}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-body text-neo-ash">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neo-sun" />
                <span>Member since {joinedDate}</span>
              </span>

              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified Community Account</span>
              </span>
            </div>
          </div>
        </div>

        {/* Impact Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neo-bg border border-neo-line/60 shadow-sm shrink-0">
          <Award className="w-5 h-5 text-neo-sun" />
          <div className="text-left">
            <span className="text-[10px] font-heading text-neo-ash uppercase block font-semibold">
              Platform Status
            </span>
            <span className="text-xs font-heading font-bold text-neo-ink">
              {isShelterAdmin ? "Verified Shelter Partner" : "Active Impact Donor"}
            </span>
          </div>
        </div>
      </div>

      {/* Public Contact Details Bar */}
      {(user.email || user.phone) && (
        <div className="pt-4 border-t border-neo-line/40 flex flex-wrap items-center gap-6 text-xs font-body">
          {user.email && (
            <div className="flex items-center gap-2 text-neo-ink font-medium">
              <Mail className="w-4 h-4 text-neo-sun shrink-0" />
              <span>{user.email}</span>
            </div>
          )}

          {user.phone && (
            <div className="flex items-center gap-2 text-neo-ink font-medium">
              <Phone className="w-4 h-4 text-neo-sun shrink-0" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
