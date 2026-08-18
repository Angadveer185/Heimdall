"use client";

import React from "react";
import { UserData } from "@/store/useUserStore";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface ProfileHeaderCardProps {
  user: UserData;
  onEditClick: () => void;
}

export function ProfileHeaderCard({ user, onEditClick }: ProfileHeaderCardProps) {
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Member";

  const getRoleBadge = (role: UserData["role"]) => {
    switch (role) {
      case "SUPER_ADMIN":
        return {
          label: "SUPER ADMIN",
          bg: " text-neo-sun bg-neo-sun/20 border-neo-sun",
        };
      case "SHELTER_ADMIN":
        return {
          label: "SHELTER ADMIN",
          bg: " text-neo-sun bg-neo-sun/20 border-neo-sun",
        };
      case "DONOR":
      default:
        return {
          label: "COMMUNITY DONOR",
          bg: " text-neo-sun bg-neo-sun/20 border-neo-sun",
        };
    }
  };

  const roleInfo = getRoleBadge(user.role);

  return (
    <div className="relative border border-neo-line bg-neo-rice p-5 md:p-6 shadow-sm overflow-hidden">
      {/* Decorative Corner Stamp */}
      <div className="absolute top-0 right-0 border-b border-l border-neo-line bg-neo-bg px-3 py-1 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-neo-sun animate-pulse" />
        <span className="text-[10px] font-label uppercase tracking-widest text-neo-ash">
          USER DOSSIER // {user.id ? user.id.slice(-6).toUpperCase() : "HEIMDALL"}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-2">
        {/* Left Column: Large Avatar & User Info Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar Image Box */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-neo-line bg-neo-bg flex items-center justify-center overflow-hidden shadow-inner">
              {user.profileImageUrl ? (
                /* eslint-disable-next-next/no-img-element */
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neo-rice to-neo-bg text-neo-sun">
                  <span className="font-heading font-bold text-3xl uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-neo-ink tracking-tight">
                {user.name}
              </h1>

              {user.isReported && (
                <span className="px-2 py-0.5 text-[10px] font-label bg-red-900/20 text-red-500 border border-red-500/40 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  FLAGGED ACCOUNT
                </span>
              )}
            </div>

            {/* Role Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 text-xs font-label font-semibold border ${roleInfo.bg}`}
              >
                {roleInfo.label}
              </span>
            </div>

            {/* Contact Meta Details */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-label text-neo-ash pt-1">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neo-sun" />
                <span>{user.email}</span>
              </div>

              {user.phone ? (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neo-sun" />
                  <span>{user.phone}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-neo-ash/70 italic">
                  <Phone className="w-3.5 h-3.5" />
                  <span>No phone added</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neo-sun" />
                <span>Joined {formattedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action: Edit Profile Button */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col items-stretch gap-3 shrink-0 pt-2 md:pt-0">
          <button
            onClick={onEditClick}
            className="px-5 py-2.5 bg-neo-sun text-neo-rice font-label text-xs uppercase tracking-wider border border-neo-sun hover:bg-neo-sun/90 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
