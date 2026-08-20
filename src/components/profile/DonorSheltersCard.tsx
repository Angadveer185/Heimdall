"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserData } from "@/store/useUserStore";
import {
  Building2,
  MapPin,
  Heart,
  QrCode,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Loader2,
  PackageCheck,
  Building,
} from "lucide-react";

interface DonorSheltersCardProps {
  user: UserData;
}

interface ShelterSummary {
  id: string;
  name: string;
  city: string;
  state: string;
  country?: string;
  profileImageUrl?: string | null;
  verificationStatus?: string;
  pledgeCount: number;
}

interface PledgeItemData {
  id: string;
  pledgeCode: string;
  status: string;
  shelter?: {
    id: string;
    name: string;
    city: string;
    state: string;
    country?: string;
    profileImageUrl?: string | null;
    verificationStatus?: string;
  } | null;
}

export function DonorSheltersCard({ user }: DonorSheltersCardProps) {
  const [shelters, setShelters] = useState<ShelterSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPledgesCount, setTotalPledgesCount] = useState(0);

  useEffect(() => {
    async function fetchDonorPledges() {
      try {
        const res = await fetch("/api/pledges/my");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const pledges: PledgeItemData[] = data.data;
            setTotalPledgesCount(pledges.length);

            // Group pledges by shelter
            const shelterMap = new Map<string, ShelterSummary>();

            pledges.forEach((pledge) => {
              if (pledge.shelter) {
                const s = pledge.shelter;
                const existing = shelterMap.get(s.id);
                if (existing) {
                  existing.pledgeCount += 1;
                } else {
                  shelterMap.set(s.id, {
                    id: s.id,
                    name: s.name,
                    city: s.city,
                    state: s.state,
                    country: s.country,
                    profileImageUrl: s.profileImageUrl,
                    verificationStatus: s.verificationStatus,
                    pledgeCount: 1,
                  });
                }
              }
            });

            setShelters(Array.from(shelterMap.values()));
          }
        }
      } catch (err) {
        console.error("Error fetching donor pledges for shelter history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDonorPledges();
  }, []);

  const completed = user.pledgesCompleted || 0;
  const expired = user.pledgesExpired || 0;
  const total = completed + expired;
  const fulfillmentRate = total > 0 ? Math.round((completed / total) * 100) : 100;

  return (
    <div className="border border-neo-line/60 rounded-2xl bg-neo-rice p-5 md:p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neo-line/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shrink-0 shadow-sm">
            <Heart className="w-6 h-6 fill-neo-sun/20 text-neo-sun" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide mb-1">
              Donor Contribution Log
            </div>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
              Shelters Previously Donated To
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-heading font-semibold rounded-full bg-neo-gold/15 text-neo-gold border border-neo-gold/30">
            {shelters.length} Facilities Supported
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-body text-neo-ash font-medium">
            <span>Completed Deliveries</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-heading font-bold text-2xl text-neo-ink">
            {completed}
          </div>
          <p className="text-xs font-body text-neo-ash">QR Drop-off verified</p>
        </div>

        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-body text-neo-ash font-medium">
            <span>Total Pledges</span>
            <PackageCheck className="w-4 h-4 text-neo-sun" />
          </div>
          <div className="font-heading font-bold text-2xl text-neo-ink">
            {totalPledgesCount || total}
          </div>
          <p className="text-xs font-body text-neo-ash">Pledge records</p>
        </div>

        <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-xs font-body text-neo-ash font-medium">
            <span>Fulfillment Score</span>
            <TrendingUp className="w-4 h-4 text-neo-sun" />
          </div>
          <div className="font-heading font-bold text-2xl text-neo-sun">
            {fulfillmentRate}%
          </div>
          <p className="text-xs font-body text-neo-ash">Reliability rating</p>
        </div>
      </div>

      {/* Previously Donated Shelters List */}
      <div className="space-y-3">
        <h3 className="text-xs font-heading text-neo-ink font-semibold tracking-wide">
          Supported Non-Profit Shelters
        </h3>

        {loading ? (
          <div className="p-6 rounded-xl bg-neo-bg border border-neo-line/60 flex items-center justify-center gap-2 text-xs font-body text-neo-ash">
            <Loader2 className="w-4 h-4 animate-spin text-neo-sun" />
            <span>Loading donor shelter history...</span>
          </div>
        ) : shelters.length === 0 ? (
          <div className="p-6 rounded-xl bg-neo-bg border border-dashed border-neo-line/60 text-center space-y-2">
            <Building className="w-8 h-8 text-neo-ash mx-auto opacity-50" />
            <p className="text-xs font-body text-neo-ash max-w-sm mx-auto">
              You haven&apos;t pledged to any shelters yet. Explore live shelter wishlists and make your first pledge!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shelters.map((shelter) => (
              <div
                key={shelter.id}
                className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 hover:border-neo-sun/60 transition-all space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-neo-line/60 bg-neo-rice flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      {shelter.profileImageUrl ? (
                        /* eslint-disable-next-next/no-img-element */
                        <img
                          src={shelter.profileImageUrl}
                          alt={shelter.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-5 h-5 text-neo-sun" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-heading font-semibold text-sm text-neo-ink leading-snug">
                        {shelter.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs font-body text-neo-ash mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                        <span>
                          {shelter.city}, {shelter.state}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 text-[11px] font-heading font-semibold rounded-full bg-neo-sun/15 text-neo-sun border border-neo-sun/30 shrink-0">
                    {shelter.pledgeCount} {shelter.pledgeCount === 1 ? "Pledge" : "Pledges"}
                  </span>
                </div>

                <div className="pt-2 border-t border-neo-line/40 flex items-center justify-between text-xs font-body">
                  <span className="text-neo-ash">
                    Status: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{shelter.verificationStatus || "VERIFIED"}</span>
                  </span>

                  <Link
                    href={`/shelter/${shelter.id}`}
                    className="text-neo-sun hover:underline flex items-center gap-1 font-semibold font-heading"
                  >
                    <span>View Wishlist</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Banner */}
      <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-neo-line/40">
        <div className="flex items-center gap-2 text-xs font-body text-neo-ash">
          <QrCode className="w-4 h-4 text-neo-sun" />
          <span>Active Drop-Off Tickets available in portal</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/donor/pledges"
            className="px-4 py-2 rounded-xl border border-neo-line/60 bg-neo-rice text-neo-ink font-heading font-semibold text-xs hover:border-neo-sun hover:text-neo-sun transition-all shadow-sm"
          >
            My QR Tickets
          </Link>
          <Link
            href="/#hero-wishlists"
            className="px-4 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-1.5 shadow-md shadow-neo-sun/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse Wishlists</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
