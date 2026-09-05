"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserData } from "@/store/useUserStore";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles,
  Mail,
  Phone,
  AlertCircle,
} from "lucide-react";

interface ShelterAdminInfoCardProps {
  user: UserData;
}

interface ShelterData {
  id: string;
  name: string;
  city: string;
  state: string;
  street?: string;
  zip?: string;
  verificationStatus: string;
  profileImageUrl?: string | null;
  contactEmail?: string;
  phone?: string | null;
  dropOffHours?: string;
  description?: string | null;
  requestsCount?: number;
}

export function ShelterAdminInfoCard({ user }: ShelterAdminInfoCardProps) {
  const [shelter, setShelter] = useState<ShelterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchManagedShelter() {
      try {
        if (user.shelterId) {
          const res = await fetch(`/api/shelters/${user.shelterId}`);
          if (res.ok) {
            const data = await res.json();
            const shelterInfo = data.success ? data.data : data;
            setShelter(shelterInfo);
          }
        } else {
          // If shelterId is not on user object directly, try fetching all shelters to find user's shelter
          const res = await fetch("/api/shelters");
          if (res.ok) {
            const data = await res.json();
            const list = data.success ? data.data : data;
            if (Array.isArray(list) && list.length > 0) {
              setShelter(list[0]);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching managed shelter info:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchManagedShelter();
  }, [user.shelterId]);

  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-neo-sun/10 border border-neo-sun/30 flex items-center justify-center gap-2 text-xs font-body text-neo-sun">
        <Loader2 className="w-4 h-4 animate-spin text-neo-sun" />
        <span>Loading managed shelter console metadata...</span>
      </div>
    );
  }

  return (
    <div className="border border-neo-sun/30 rounded-2xl bg-gradient-to-br from-neo-sun/10 via-neo-rice to-neo-rice p-5 md:p-6 space-y-5 shadow-sm">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl border border-neo-sun/40 bg-neo-sun/20 text-neo-sun shrink-0 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 text-[11px] font-heading font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-neo-sun" />
              Shelter Console Quick-Access
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              {shelter ? shelter.name : "Managed Non-Profit Shelter"}
            </h2>
          </div>
        </div>

        <Link
          href="/shelter/manage"
          className="px-4 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-neo-sun/20 cursor-pointer shrink-0"
        >
          <span>Go to Shelter Console</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {shelter ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status & Location Card */}
          <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-body text-neo-ash font-medium">
                Verification Status
              </span>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-heading font-semibold rounded-full border uppercase flex items-center gap-1 ${
                  shelter.verificationStatus === "VERIFIED"
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    : "bg-neo-sun/15 border-neo-sun/30 text-neo-sun"
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                {shelter.verificationStatus || "VERIFIED"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-body text-neo-ink pt-1">
              <MapPin className="w-4 h-4 text-neo-sun shrink-0" />
              <span>
                {shelter.street ? `${shelter.street}, ` : ""}
                {shelter.city}, {shelter.state} {shelter.zip || ""}
              </span>
            </div>
          </div>

          {/* Operating Hours & Info */}
          <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2 shadow-sm">
            <span className="text-xs font-body text-neo-ash font-medium block">
              Drop-Off Operating Hours
            </span>
            <div className="flex items-center gap-1.5 text-xs font-body text-neo-ink pt-1">
              <Clock className="w-4 h-4 text-neo-sun shrink-0" />
              <span className="font-heading font-semibold">
                {shelter.dropOffHours || "Mon - Sat: 9:00 AM - 5:00 PM"}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2 shadow-sm">
            <span className="text-xs font-body text-neo-ash font-medium block">
              Facility Contact Information
            </span>
            <div className="space-y-1 pt-1 text-xs font-body text-neo-ink">
              {shelter.contactEmail && (
                <div className="flex items-center gap-1.5 text-neo-ash">
                  <Mail className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                  <span className="truncate">{shelter.contactEmail}</span>
                </div>
              )}
              {shelter.phone && (
                <div className="flex items-center gap-1.5 text-neo-ash">
                  <Phone className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                  <span>{shelter.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center gap-3 text-xs font-body text-neo-ash">
          <AlertCircle className="w-5 h-5 text-neo-sun shrink-0" />
          <span>
            You are registered as a Shelter Administrator. Access your console to manage wishlist items, scan drop-off QR codes, and update facility info.
          </span>
        </div>
      )}
    </div>
  );
}
