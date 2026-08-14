"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  QrCode,
  MapPin,
  Heart,
  Package,
  Activity,
  CheckCircle2,
  Lock,
  Clock,
  TrendingUp,
  Building2,
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
      category: "Medical",
      unit: "kits",
    },
  ];

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden py-12 lg:py-20 neo-grid-bg border-b border-neo-line/40">
      {/* Background Interactive Dot Grid Sub-Layer */}
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
          
          {/* Left Column: Headlines & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Telemetry Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-neo-line bg-neo-rice/90 backdrop-blur-sm text-neo-ink font-label text-xs">
              <span className="w-2 h-2 rounded-full bg-neo-sun animate-pulse" />
              <span className="text-neo-sun font-bold uppercase tracking-wider">
                HEIMDALL PROTOCOL
              </span>
              <span className="text-neo-ash">|</span>
              <span className="text-neo-ash hidden sm:inline">
                ATOMIC INVENTORY PIPELINE
              </span>
              <span className="bg-neo-sun text-neo-rice px-1 py-0.2 text-[10px] font-bold">
                【 済 】
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-neo-ink leading-[1.1] tracking-tight">
              Radical Transparency in{" "}
              <span className="relative inline-block text-neo-sun">
                Community Donations
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
              Eliminate donation black holes. Heimdall directly connects local non-profit shelters with donors via an atomic 3-stage inventory protocol and instant QR drop-off audit tickets.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/register"
                className="px-8 py-4 bg-neo-sun text-neo-rice font-label text-sm uppercase tracking-wider font-bold border border-neo-sun hover:bg-neo-sun/90 active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <Heart className="w-4 h-4 text-neo-rice group-hover:scale-110 transition-transform" />
                <span>Pledge Items Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/register?role=shelter"
                className="px-6 py-4 bg-neo-rice border border-neo-line text-neo-ink font-label text-sm uppercase tracking-wider font-semibold hover:border-neo-sun hover:text-neo-sun transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Building2 className="w-4 h-4 text-neo-sun" />
                <span>501(c)(3) Shelter Register</span>
              </Link>
            </div>

            {/* Micro Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neo-line/40">
              <div className="p-2.5 border border-neo-line/40 bg-neo-rice/60 shadow-sm">
                <div className="font-heading text-2xl font-bold text-neo-ink">100%</div>
                <div className="font-label text-[10px] uppercase text-neo-ash font-semibold">QR Audit Rate</div>
              </div>
              <div className="p-2.5 border border-neo-line/40 bg-neo-rice/60 shadow-sm">
                <div className="font-heading text-2xl font-bold text-neo-sun">0%</div>
                <div className="font-label text-[10px] uppercase text-neo-ash font-semibold">Double Pledges</div>
              </div>
              <div className="p-2.5 border border-neo-line/40 bg-neo-rice/60 shadow-sm">
                <div className="font-heading text-2xl font-bold text-neo-ink">48+</div>
                <div className="font-label text-[10px] uppercase text-neo-ash font-semibold">Shelters Live</div>
              </div>
              <div className="p-2.5 border border-neo-line/40 bg-neo-rice/60 shadow-sm">
                <div className="font-heading text-2xl font-bold text-neo-gold">12.4K</div>
                <div className="font-label text-[10px] uppercase text-neo-ash font-semibold">Items Delivered</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Live Radar Visual Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
            id="hero-wishlists"
          >
            {/* Visual Header Schematic Frame */}
            <div className="border border-neo-line bg-neo-rice text-neo-ink p-5 space-y-4 shadow-xl relative overflow-hidden">
              {/* Top Bar Decorative Header */}
              <div className="flex items-center justify-between border-b border-neo-line/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-neo-sun inline-block" />
                  <span className="font-heading text-sm font-bold tracking-wider text-neo-ink">
                    LIVE LOGISTICS RADAR
                  </span>
                </div>
                <span className="font-label text-[10px] text-neo-sun bg-neo-bg px-2 py-0.5 border border-neo-line font-bold uppercase">
                  GPS :: BAY AREA NODE
                </span>
              </div>

              {/* Status Header */}
              <p className="font-label text-xs text-neo-ash leading-relaxed">
                Urgent community demand pipeline updated in real-time via Prisma transactions.
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
                      className="p-3.5 border border-neo-line/70 bg-neo-bg hover:border-neo-sun transition-all group shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="space-y-0.5">
                          <span className="font-heading text-sm font-bold text-neo-ink group-hover:text-neo-sun transition-colors block">
                            {item.title}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-neo-ash font-body">
                            <Building2 className="w-3 h-3 text-neo-sun" />
                            <span>{item.shelter}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-label font-bold px-2 py-0.5 border ${
                            item.urgency === "CRITICAL"
                              ? "bg-neo-sun/15 border-neo-sun text-neo-sun"
                              : "bg-neo-gold/15 border-neo-gold text-neo-gold"
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </div>

                      {/* Progress Metrics */}
                      <div className="space-y-1.5 mt-2">
                        <div className="flex justify-between text-[10px] font-label text-neo-ash">
                          <span className="font-semibold text-neo-ink">Progress: {progressPct}%</span>
                          <span className="text-neo-sun font-bold">
                            {available} {item.unit} available
                          </span>
                        </div>
                        <div className="w-full bg-neo-rice/60 h-2 border border-neo-line/50 overflow-hidden">
                          <div
                            className="bg-neo-sun h-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Card Action Link */}
                      <div className="mt-2.5 pt-2 border-t border-neo-line/30 flex items-center justify-between text-[11px] font-label">
                        <span className="text-neo-ash flex items-center gap-1 font-mono">
                          <MapPin className="w-3 h-3 text-neo-sun" /> {item.city}
                        </span>
                        <Link
                          href="/register"
                          className="text-neo-sun hover:underline font-bold flex items-center gap-1 uppercase"
                        >
                          <span>Pledge</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Frame Footer Telemetry */}
              <div className="pt-2 flex items-center justify-between text-[10px] font-label text-neo-ash border-t border-neo-line/50">
                <span className="flex items-center gap-1 text-neo-ink font-semibold">
                  <Lock className="w-3 h-3 text-neo-sun" /> ATOMIC RESERVATIONS
                </span>
                <span className="text-neo-sun font-bold">【 VERIFIED 501(c)(3) QUEUE 】</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
