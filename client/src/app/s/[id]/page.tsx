"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  PublicShelterData,
  ShelterHeaderCard,
} from "@/components/public-shelter/ShelterHeaderCard";
import { ShelterImagesGallery } from "@/components/public-shelter/ShelterImagesGallery";
import {
  ShelterWishlistGrid,
  WishlistItemDetail,
  SelectedPledgeItem,
} from "@/components/public-shelter/ShelterWishlistGrid";
import { ShelterPledgeModal } from "@/components/public-shelter/ShelterPledgeModal";
import {
  ArrowLeft,
  ShieldCheck,
  Loader2,
  Building2,
  Home,
  LayoutDashboard,
} from "lucide-react";

// Dynamically import map with SSR disabled
const ShelterLocationMap = dynamic(
  () => import("@/components/maps/ShelterLocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 sm:h-72 w-full rounded-2xl bg-neo-rice border border-neo-line/60 flex items-center justify-center gap-2 text-neo-ash text-xs">
        <Loader2 className="w-5 h-5 animate-spin text-neo-sun" />
        <span>Loading facility map & directions...</span>
      </div>
    ),
  }
);

interface RawShelterRequest {
  id: string;
  shelterId: string;
  title: string;
  urgency: string;
  categories?: { id: string; name: string; icon: string }[];
  items?: {
    id: string;
    quantityNeeded: number;
    quantityReserved: number;
    quantityDelivered: number;
    unit: string;
    notes?: string | null;
    globalItem?: {
      id: string;
      title: string;
      defaultUnit?: string;
    };
  }[];
}

export default function ShelterPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const shelterId = params?.id as string;

  const [shelter, setShelter] = useState<PublicShelterData | null>(null);
  const [wishlistItems, setWishlistItems] = useState<WishlistItemDetail[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedPledgeItem[]>([]);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShelterData = useCallback(async () => {
    if (!shelterId) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Shelter Metadata
      const shelterRes = await fetch(`/api/shelters/${shelterId}`);
      if (!shelterRes.ok) {
        setError("Shelter facility not found or unavailable.");
        setLoading(false);
        return;
      }
      const shelterData = await shelterRes.json();
      const s = shelterData.success ? shelterData.data : shelterData;
      setShelter(s);

      // 2. Fetch Shelter Requests / Wishlist
      const requestsRes = await fetch("/api/shelter-requests");
      if (requestsRes.ok) {
        const reqData = await requestsRes.json();
        const rawRequests: RawShelterRequest[] = reqData.success
          ? reqData.data
          : reqData;

        if (Array.isArray(rawRequests)) {
          // Filter requests belonging to this shelter
          const shelterReqs = rawRequests.filter(
            (r) => r.shelterId === shelterId
          );

          // Flatten items
          const itemsList: WishlistItemDetail[] = [];
          shelterReqs.forEach((r) => {
            if (Array.isArray(r.items)) {
              r.items.forEach((item) => {
                itemsList.push({
                  id: item.id,
                  requestId: r.id,
                  globalItemId: item.globalItem?.id,
                  title: item.globalItem?.title || r.title || "Supply Item",
                  categoryName:
                    r.categories && r.categories.length > 0
                      ? r.categories[0].name
                      : undefined,
                  categoryIcon:
                    r.categories && r.categories.length > 0
                      ? r.categories[0].icon
                      : undefined,
                  urgency: r.urgency || "MEDIUM",
                  quantityNeeded: item.quantityNeeded,
                  quantityReserved: item.quantityReserved,
                  quantityDelivered: item.quantityDelivered,
                  unit: item.unit || item.globalItem?.defaultUnit || "units",
                  notes: item.notes,
                });
              });
            }
          });

          setWishlistItems(itemsList);
        }
      }
    } catch (err) {
      console.error("Error fetching shelter profile data:", err);
      setError("Failed to load shelter data.");
    } finally {
      setLoading(false);
    }
  }, [shelterId]);

  useEffect(() => {
    fetchShelterData();
  }, [fetchShelterData]);

  // Wishlist Selection handlers
  const handleToggleItem = (item: WishlistItemDetail, initialQty: number) => {
    const existing = selectedItems.find((s) => s.requestedItemId === item.id);
    if (existing) {
      // Remove
      setSelectedItems(selectedItems.filter((s) => s.requestedItemId !== item.id));
    } else {
      // Add
      const availableCapacity = Math.max(
        0,
        item.quantityNeeded - item.quantityReserved
      );
      setSelectedItems([
        ...selectedItems,
        {
          requestedItemId: item.id,
          title: item.title,
          unit: item.unit,
          quantityPledged: Math.max(1, initialQty),
          availableCapacity,
          isWishlistItem: true,
        },
      ]);
    }
  };

  const handleUpdateQty = (requestedItemId: string, qty: number) => {
    setSelectedItems(
      selectedItems.map((s) =>
        s.requestedItemId === requestedItemId
          ? { ...s, quantityPledged: Math.max(1, qty) }
          : s
      )
    );
  };

  const handleRemoveItem = (requestedItemId: string) => {
    setSelectedItems(
      selectedItems.filter((s) => s.requestedItemId !== requestedItemId)
    );
  };

  const handlePledgeSuccess = () => {
    setSelectedItems([]);
    fetchShelterData(); // Refresh wishlist data & progress bars!
  };

  return (
    <div className="min-h-screen bg-neo-bg text-neo-ink selection:bg-neo-sun selection:text-neo-rice flex flex-col font-body transition-colors duration-200">
      {/* Top Header Navigation */}
      <header className="bg-neo-rice border-b border-neo-line/60 py-3.5 px-4 sm:px-6 lg:px-8 shrink-0 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neo-line/60 bg-neo-bg hover:border-neo-sun hover:text-neo-sun transition-all text-xs font-heading font-semibold text-neo-ink cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-neo-sun" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-2.5 rounded-full border border-neo-line/60 text-neo-sun bg-neo-bg hover:border-neo-sun hover:shadow transition-all flex items-center justify-center"
              aria-label="Home"
            >
              <ShieldCheck className="w-4 h-4 text-neo-sun" />
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-md shadow-neo-sun/20"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body Area */}
      <main className="flex-grow max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {loading ? (
          <div className="p-16 rounded-2xl bg-neo-rice border border-neo-line/60 flex flex-col items-center justify-center gap-3 text-center shadow-sm my-8">
            <Loader2 className="w-8 h-8 animate-spin text-neo-sun" />
            <span className="text-xs font-body text-neo-ash font-medium">
              Loading non-profit shelter profile and wishlist...
            </span>
          </div>
        ) : error || !shelter ? (
          <div className="p-12 rounded-2xl bg-neo-rice border border-dashed border-neo-line/60 text-center space-y-4 shadow-sm my-8">
            <Building2 className="w-12 h-12 text-neo-ash mx-auto opacity-60" />
            <div className="space-y-1.5">
              <h2 className="font-heading font-bold text-xl text-neo-ink">
                Shelter Facility Not Found
              </h2>
              <p className="text-xs font-body text-neo-ash max-w-md mx-auto leading-relaxed">
                {error || "The shelter facility you are looking for does not exist or may have been updated."}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-2 shadow-md shadow-neo-sun/20"
              >
                <Home className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Public Shelter Metadata Header */}
            <ShelterHeaderCard shelter={shelter} />

            {/* Facility Showcase Images Gallery */}
            {shelter.shelterImages && shelter.shelterImages.length > 0 && (
              <ShelterImagesGallery
                images={shelter.shelterImages}
                shelterName={shelter.name}
              />
            )}

            {/* Physical Facility Map & Google Maps Directions */}
            <ShelterLocationMap
              shelterName={shelter.name}
              latitude={shelter.latitude}
              longitude={shelter.longitude}
              street={shelter.street}
              city={shelter.city}
              state={shelter.state}
              zip={shelter.zip}
              dropOffHours={shelter.dropOffHours}
            />

            {/* Wishlist Grid & Needs */}
            <ShelterWishlistGrid
              items={wishlistItems}
              selectedItems={selectedItems}
              onToggleItem={handleToggleItem}
              onUpdateQty={handleUpdateQty}
              onOpenPledgeModal={() => setIsPledgeModalOpen(true)}
            />

            {/* Interactive Pledge Drawer/Modal */}
            <ShelterPledgeModal
              isOpen={isPledgeModalOpen}
              onClose={() => setIsPledgeModalOpen(false)}
              shelter={shelter}
              selectedWishlistItems={selectedItems}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
              onPledgeSuccess={handlePledgeSuccess}
            />
          </>
        )}
      </main>
    </div>
  );
}
