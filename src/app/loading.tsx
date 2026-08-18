"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Activity,
  Cpu,
  Radio,
  Database,
} from "lucide-react";

/**
 * Universal Loading Fallback for Project Heimdall
 * Styled strictly according to Design.md (Neo-Mirai Retro-Futurism design tokens).
 * 
 * Works automatically in Next.js App Router:
 * 1. Place as `src/app/loading.tsx` for root fallback.
 * 2. Or place inside any route directory alongside `page.tsx` (e.g. `src/app/admin/loading.tsx`).
 */
export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6 bg-neo-bg text-neo-ink font-body neo-grid-bg film-grain relative overflow-hidden">
      {/* Decorative Neo-Mirai Radar Background Grid Effects */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15">
        <div className="w-[500px] h-[500px] rounded-full border border-dashed border-neo-line animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[350px] h-[350px] rounded-full border border-neo-line/60" />
        <div className="absolute w-[200px] h-[200px] rounded-full border border-neo-gold/40" />
      </div>

      {/* Main Loading Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg bg-neo-rice border border-neo-line shadow-xl relative z-10 p-6 md:p-8 space-y-6"
      >
        {/* Card Header with Japanese Accent Stamp & System Info */}
        <div className="flex items-start justify-between border-b border-neo-line/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 bg-neo-bg border border-neo-line shadow-inner">
              <ShieldCheck className="w-6 h-6 text-neo-sun animate-pulse" />
              {/* Corner accent block */}
              <span className="absolute -top-1 -left-1 w-2 h-2 bg-neo-sun" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg tracking-tight text-neo-ink">
                  HEIMDALL // LOGISTICS
                </h2>
                <span className="text-[10px] font-label px-1.5 py-0.5 border border-neo-sun/50 bg-neo-sun/10 text-neo-sun font-semibold">
                  SYNCING
                </span>
              </div>
              <p className="text-xs font-label text-neo-ash uppercase tracking-wider">
                3-Stage Inventory Pipeline
              </p>
            </div>
          </div>

          {/* Japanese Accent Seal Stamp (Neo-Mirai Pillar) */}
          <div className="flex flex-col items-center justify-center w-10 h-10 border-2 border-neo-sun text-neo-sun rounded-sm p-0.5 select-none rotate-3 hover:rotate-0 transition-transform">
            <span className="text-[9px] font-bold font-heading leading-none">
              待機
            </span>
            <span className="text-[9px] font-bold font-heading leading-none">
              中
            </span>
          </div>
        </div>

        {/* Central Animated Loader Node */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          {/* Animated Spinner & Scanning Reticle */}
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Outer Spinning Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-t-neo-sun border-r-transparent border-b-neo-gold border-l-transparent"
            />
            {/* Inner Counter Spinning Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-2 rounded-full border border-dashed border-neo-line"
            />
            {/* Center Glowing Pulse Icon */}
            <div className="w-10 h-10 bg-neo-bg border border-neo-line rounded-full flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5 text-neo-sun animate-pulse" />
            </div>
          </div>

          {/* Telemetry Status Text */}
          <div className="text-center space-y-1">
            <p className="font-label text-sm text-neo-ink font-semibold tracking-wide flex items-center justify-center gap-2">
              <Radio className="w-3.5 h-3.5 text-neo-sun animate-ping" />
              <span>INITIALIZING DATA STREAM...</span>
            </p>
            <p className="text-xs font-label text-neo-ash">
              FETCHING LIVE REQUESTS & PLEDGE RESERVATIONS
            </p>
          </div>
        </div>

        {/* Shimmer Progress & Skeleton Block Preview */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between text-[11px] font-label text-neo-ash uppercase">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-neo-gold" /> PIPELINE ALLOCATION
            </span>
            <span className="text-neo-gold font-mono">AVAILABLE / PLEDGED / DELIVERED</span>
          </div>

          {/* Shimmer Line Bar */}
          <div className="w-full h-2 bg-neo-bg border border-neo-line/80 overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1/2 h-full bg-gradient-to-r from-transparent via-neo-sun to-transparent opacity-80"
            />
          </div>

          {/* Skeleton Placeholder Panels */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2.5 border border-neo-line/40 bg-neo-bg/60 animate-pulse space-y-1.5">
              <div className="h-2 w-12 bg-neo-ash/30" />
              <div className="h-4 w-8 bg-neo-sun/20" />
            </div>
            <div className="p-2.5 border border-neo-line/40 bg-neo-bg/60 animate-pulse space-y-1.5">
              <div className="h-2 w-12 bg-neo-ash/30" />
              <div className="h-4 w-8 bg-neo-gold/20" />
            </div>
            <div className="p-2.5 border border-neo-line/40 bg-neo-bg/60 animate-pulse space-y-1.5">
              <div className="h-2 w-12 bg-neo-ash/30" />
              <div className="h-4 w-8 bg-neo-ink/20" />
            </div>
          </div>
        </div>

        {/* Footer System Telemetry Status Bar */}
        <div className="border-t border-neo-line/60 pt-3 flex items-center justify-between text-[10px] font-label text-neo-ash">
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-neo-ash" /> SYS.VER // 2040.8.18
          </span>
          <span className="text-neo-sun uppercase font-semibold">
            ● SECURE TRANSACTION PROTOCOL
          </span>
        </div>
      </motion.div>
    </div>
  );
}
