"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Activity,
  Cpu,
  Radio,
  Database,
  Heart,
} from "lucide-react";

/**
 * Universal Loading Fallback for Project Heimdall
 * Styled strictly according to Design.md (Warm, Human-Centric NGO design tokens).
 * 
 * Works automatically in Next.js App Router:
 * 1. Place as `src/app/loading.tsx` for root fallback.
 * 2. Or place inside any route directory alongside `page.tsx`.
 */
export default function Loading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink font-body relative overflow-hidden">
      <div className="film-grain" />

      {/* Soft Ambient Background Radiance */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,var(--color-neo-gold)/12,transparent_65%)]" />
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-neo-sun/8 blur-3xl pointer-events-none" />
      </div>

      {/* Main Loading Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg bg-neo-rice border border-neo-line/60 rounded-2xl shadow-xl relative z-10 p-6 md:p-8 space-y-6"
      >
        {/* Card Header with System Info */}
        <div className="flex items-start justify-between border-b border-neo-line/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 bg-neo-bg rounded-xl border border-neo-line/60 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-neo-sun animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg tracking-tight text-neo-ink">
                  Heimdall
                </h2>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-neo-sun/10 text-neo-sun font-body">
                  Syncing
                </span>
              </div>
              <p className="text-xs font-body text-neo-ash mt-0.5">
                Connecting Shelter & Donor Network
              </p>
            </div>
          </div>

          {/* Real-Time Impact Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neo-gold/15 text-neo-gold text-xs font-medium">
            <Heart className="w-3.5 h-3.5 fill-neo-gold text-neo-gold" />
            <span>Real-Time</span>
          </div>
        </div>

        {/* Central Animated Loader Node */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          {/* Animated Spinner Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-t-neo-sun border-r-transparent border-b-neo-gold border-l-transparent"
            />
            <div className="w-10 h-10 bg-neo-bg border border-neo-line/60 rounded-full flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-neo-sun animate-pulse" />
            </div>
          </div>

          {/* Telemetry Status Text */}
          <div className="text-center space-y-1">
            <p className="font-heading text-sm text-neo-ink font-semibold tracking-wide flex items-center justify-center gap-2">
              <Radio className="w-3.5 h-3.5 text-neo-sun animate-ping" />
              <span>Updating community data...</span>
            </p>
            <p className="text-xs font-body text-neo-ash">
              Fetching shelter requests & active pledge reservations
            </p>
          </div>
        </div>

        {/* Shimmer Progress & Skeleton Block Preview */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-body text-neo-ash">
            <span className="flex items-center gap-1.5 font-medium">
              <Cpu className="w-3.5 h-3.5 text-neo-gold" /> Inventory Sync Status
            </span>
            <span className="text-neo-gold text-[11px]">Available · Pledged · Delivered</span>
          </div>

          {/* Shimmer Line Bar */}
          <div className="w-full h-2 bg-neo-bg rounded-full border border-neo-line/60 overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-neo-sun to-transparent opacity-80"
            />
          </div>

          {/* Skeleton Placeholder Panels */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-xl border border-neo-line/40 bg-neo-bg/60 animate-pulse space-y-2">
              <div className="h-2 w-12 bg-neo-ash/30 rounded-full" />
              <div className="h-4 w-8 bg-neo-sun/20 rounded-md" />
            </div>
            <div className="p-3 rounded-xl border border-neo-line/40 bg-neo-bg/60 animate-pulse space-y-2">
              <div className="h-2 w-12 bg-neo-ash/30 rounded-full" />
              <div className="h-4 w-8 bg-neo-gold/20 rounded-md" />
            </div>
            <div className="p-3 rounded-xl border border-neo-line/40 bg-neo-bg/60 animate-pulse space-y-2">
              <div className="h-2 w-12 bg-neo-ash/30 rounded-full" />
              <div className="h-4 w-8 bg-neo-ink/20 rounded-md" />
            </div>
          </div>
        </div>

        {/* Footer Security Status Bar */}
        <div className="border-t border-neo-line/40 pt-4 flex items-center justify-between text-xs font-body text-neo-ash">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-neo-ash" /> Secure Data Stream
          </span>
          <span className="text-neo-sun font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neo-sun animate-pulse" />
            Verified Network
          </span>
        </div>
      </motion.div>
    </div>
  );
}
