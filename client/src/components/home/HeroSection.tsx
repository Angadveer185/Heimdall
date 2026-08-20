"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Heart,
  Building2,
  Users,
  CheckCircle2,
} from "lucide-react";
import DotGrid from "@/components/ui/DotGrid";

export function HeroSection() {
  const sampleWishlistItems = [
    {
      id: "item-1",
      title: "Heavy Thermal Sleeping Bags",
      shelter: "Hope Harbor Crisis Center",
      city: "San Francisco, CA",
      urgency: "CRITICAL",
      needed: 50,
      reserved: 34,
      delivered: 12,
      category: "Emergency Shelter",
      unit: "bags",
    },
    {
      id: "item-2",
      title: "Infant Care & Formula Packages",
      shelter: "St. Jude Family Sanctuary",
      city: "Oakland, CA",
      urgency: "HIGH",
      needed: 100,
      reserved: 75,
      delivered: 50,
      category: "Infant Rations",
      unit: "kits",
    },
    {
      id: "item-3",
      title: "First-Aid Emergency Trauma Kits",
      shelter: "Bayview Community Rescue",
      city: "San Jose, CA",
      urgency: "CRITICAL",
      needed: 30,
      reserved: 20,
      delivered: 8,
      category: "Medical Supplies",
      unit: "kits",
    },
  ];

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col justify-center overflow-hidden py-12 lg:py-20 border-b border-neo-line/40">
      {/* Background Subtle Dot Grid Layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <DotGrid
          dotSize={12}
          gap={28}
          baseColor="#8c8273"
          activeColor="#cc4b2e"
          proximity={120}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Soft Warm Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neo-line/60 bg-neo-rice/90 backdrop-blur-sm text-neo-ink font-heading text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-neo-sun animate-pulse" />
              <span className="text-neo-sun font-bold">
                COMMUNITY DONATION PLATFORM
              </span>
              <span className="text-neo-ash/40">|</span>
              <span className="text-neo-ash hidden sm:inline">
                DIRECT IMPACT FOR LOCAL SHELTERS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-neo-ink leading-[1.1] tracking-tight">
              Direct, Transparent Help for{" "}
              <span className="relative inline-block text-neo-sun">
                Local Shelters
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-neo-sun/30 pointer-events-none"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,10 Q50,0 100,10 T200,10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-body text-lg sm:text-xl text-neo-ash leading-relaxed max-w-2xl">
              Connecting local non-profit shelters directly with donors. See exact items needed, reserve your contribution, and receive photo updates showing your real impact.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/register"
                className="px-8 py-4 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-sm border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-md shadow-neo-sun/20 hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Heart className="w-4 h-4 text-neo-rice group-hover:scale-110 transition-transform fill-neo-rice" />
                <span>Pledge Items Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/register?type=shelter"
                className="px-6 py-4 rounded-xl bg-neo-rice border border-neo-line/60 text-neo-ink font-heading font-semibold text-sm hover:border-neo-sun hover:text-neo-sun transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-neo-sun" />
                <span>Register Shelter Facility</span>
              </Link>
            </div>

            {/* Micro Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neo-line/40">
              <div className="p-3.5 rounded-xl border border-neo-line/60 bg-neo-rice/80 shadow-sm space-y-0.5">
                <div className="font-heading text-2xl font-bold text-neo-ink">100%</div>
                <div className="font-body text-xs text-neo-ash">Verified Shelters</div>
              </div>
              <div className="p-3.5 rounded-xl border border-neo-line/60 bg-neo-rice/80 shadow-sm space-y-0.5">
                <div className="font-heading text-2xl font-bold text-neo-sun">0</div>
                <div className="font-body text-xs text-neo-ash">Waste & Duplication</div>
              </div>
              <div className="p-3.5 rounded-xl border border-neo-line/60 bg-neo-rice/80 shadow-sm space-y-0.5">
                <div className="font-heading text-2xl font-bold text-neo-ink">48+</div>
                <div className="font-body text-xs text-neo-ash">Active Shelters</div>
              </div>
              <div className="p-3.5 rounded-xl border border-neo-line/60 bg-neo-rice/80 shadow-sm space-y-0.5">
                <div className="font-heading text-2xl font-bold text-neo-gold">12.4K</div>
                <div className="font-body text-xs text-neo-ash">Items Delivered</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Wishlist Preview Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
            id="hero-wishlists"
          >
            {/* Wishlist Card Surface */}
            <div className="border border-neo-line/60 rounded-2xl bg-neo-rice text-neo-ink p-5 space-y-4 shadow-xl relative overflow-hidden">
              {/* Top Header */}
              <div className="flex items-center justify-between border-b border-neo-line/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-neo-sun" />
                  <span className="font-heading text-base font-bold text-neo-ink">
                    Live Shelter Wishlists
                  </span>
                </div>
                <span className="font-heading text-xs font-semibold text-neo-sun bg-neo-sun/10 px-3 py-1 rounded-full">
                  Real-Time Demand
                </span>
              </div>

              {/* Status Header */}
              <p className="font-body text-xs text-neo-ash leading-relaxed">
                Shelters list exact quantities needed so donors know precisely how to help.
              </p>

              {/* Sample Wishlist Item Cards */}
              <div className="space-y-3 pt-1">
                {sampleWishlistItems.map((item, index) => {
                  const available = item.needed - item.reserved;
                  const progressPct = Math.min(100, Math.round(((item.reserved + item.delivered) / item.needed) * 100));

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.15 }}
                      className="p-4 rounded-xl border border-neo-line/60 bg-neo-bg hover:border-neo-sun/60 transition-all group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="space-y-0.5">
                          <span className="font-heading text-sm font-bold text-neo-ink group-hover:text-neo-sun transition-colors block">
                            {item.title}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-neo-ash font-body">
                            <Building2 className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                            <span>{item.shelter}</span>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-heading font-semibold px-2.5 py-0.5 rounded-full border ${
                            item.urgency === "CRITICAL"
                              ? "bg-neo-sun/15 border-neo-sun/30 text-neo-sun"
                              : "bg-neo-gold/15 border-neo-gold/30 text-neo-gold"
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </div>

                      {/* Progress Bar & Quantity */}
                      <div className="space-y-1.5 mt-2.5">
                        <div className="flex justify-between text-xs font-body text-neo-ash">
                          <span className="font-medium text-neo-ink">{progressPct}% reserved & fulfilled</span>
                          <span className="text-neo-sun font-semibold">
                            {available} {item.unit} needed
                          </span>
                        </div>
                        <div className="w-full bg-neo-rice h-2.5 rounded-full border border-neo-line/50 overflow-hidden">
                          <div
                            className="bg-neo-sun h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Location & Action Link */}
                      <div className="mt-3 pt-2.5 border-t border-neo-line/40 flex items-center justify-between text-xs font-body">
                        <span className="text-neo-ash flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-neo-sun shrink-0" /> {item.city}
                        </span>
                        <Link
                          href="/register"
                          className="text-neo-sun hover:underline font-semibold font-heading flex items-center gap-1"
                        >
                          <span>Pledge Item</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Card Footer Note */}
              <div className="pt-2 flex items-center justify-between text-xs font-body text-neo-ash border-t border-neo-line/40">
                <span className="flex items-center gap-1.5 text-neo-ink font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tax-Verified 501(c)(3) Shelters Only
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
