"use client";

import React from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { useTheme } from "@/components/theme/theme-context";
import { Sun, Moon, Heart, ShieldCheck, Lock, CheckCircle2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neo-bg text-neo-ink font-body selection:bg-neo-sun selection:text-neo-rice">
      <div className="film-grain" />

      {/* Outer Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Left Interactive Vibe Panel (hidden on mobile, visible on desktop) */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 lg:p-12 overflow-hidden text-[#faf6ec] bg-neo-night lg:border-r border-neo-line/20">
          
          {/* Warm Ambient Glows (Replacing sharp technical keyhole/crosshairs) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Soft Radial Ambient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,var(--color-neo-gold),transparent_24rem)] opacity-40" />
            {/* Outer Concentric Ring */}
            <div 
              className="absolute -right-20 top-8 w-80 h-80 rounded-full border-[1px] border-neo-gold/20 flex items-center justify-center"
              style={{ transform: "translate3d(0,0,0)" }}
            >
              {/* Mid Ring */}
              <div className="w-64 h-64 rounded-full border-[1.5px] border-neo-gold/35 flex items-center justify-center">
                {/* Inner Ring */}
                <div className="w-48 h-48 rounded-full border-[2.5px] border-neo-gold/45 bg-neo-night flex items-center justify-center relative">
                  {/* Glowing Eclipse Center */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-b from-neo-gold to-neo-sun opacity-85 shadow-[0_0_25px_rgba(204,163,82,0.4)]" />
                  {/* Crosshair lines for technical feel */}
                  <div className="absolute w-[220px] h-[1px] bg-neo-gold/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                  <div className="absolute w-[1px] h-[220px] bg-neo-gold/20 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Header Area */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Human-centric Brand Mark */}
              <div className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-neo-gold to-neo-sun shadow-md shadow-neo-gold/20 text-neo-night font-heading font-bold text-lg transition-transform duration-300 group-hover:scale-105">
                H
              </div>
              <div className="grid gap-0.5 leading-tight text-[#faf6ec]">
                <span className="font-heading font-bold text-sm tracking-wide">Heimdall</span>
                <span className="text-xs text-[#faf6ec]/70 font-body">Community Logistics</span>
              </div>
            </Link>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf6ec]/10 text-neo-gold text-xs font-medium tracking-wide">
              <Heart className="w-3.5 h-3.5 fill-neo-gold text-neo-gold" />
              Direct Donor Impact
            </div>
          </div>

          {/* Mid Section: Three Stages of Transparency */}
          <div className="relative z-10 my-16 lg:my-auto lg:pl-4">
            <div className="mb-8">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-neo-gold/15 text-neo-gold text-xs font-semibold tracking-wide mb-3">
                Our Transparency Promise
              </span>
              <h2 className="font-heading text-3xl font-normal tracking-tight text-[#faf6ec] leading-snug">
                Three Stages of Real-Time Impact
              </h2>
              <p className="text-sm text-[#faf6ec]/80 mt-2 font-body leading-relaxed max-w-md">
                Every donation is dynamically tracked from verified shelter wishlists to safe drop-off delivery.
              </p>
            </div>

            {/* Softer Timeline Rail */}
            <ol className="relative border-l-2 border-neo-gold/30 pl-6 space-y-7 font-body">
              
              {/* Step 1 */}
              <li className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-neo-gold bg-neo-night shadow-[0_0_10px_rgba(204,163,82,0.4)]" />
                <span className="text-xs font-semibold text-neo-gold tracking-wide block mb-0.5">
                  Stage 01 · Live Needs
                </span>
                <h3 className="font-heading text-base font-semibold text-[#faf6ec]">
                  Explore Verified Wishlists
                </h3>
                <p className="text-sm text-[#faf6ec]/75 mt-1 max-w-sm font-body leading-relaxed">
                  Browse urgent shelter requests in real time with clear item quantities, units, and urgency levels.
                </p>
              </li>

              {/* Step 2 */}
              <li className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-neo-gold bg-neo-night shadow-[0_0_10px_rgba(204,163,82,0.4)]" />
                <span className="text-xs font-semibold text-neo-gold tracking-wide block mb-0.5">
                  Stage 02 · Reserved Impact
                </span>
                <h3 className="font-heading text-base font-semibold text-[#faf6ec]">
                  Secure Digital Reservation
                </h3>
                <p className="text-sm text-[#faf6ec]/75 mt-1 max-w-sm font-body leading-relaxed">
                  Pledge items with atomic transaction protection. Instantly receive a digital QR drop-off pass.
                </p>
              </li>

              {/* Step 3 */}
              <li className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-neo-gold bg-neo-night shadow-[0_0_10px_rgba(204,163,82,0.4)]" />
                <span className="text-xs font-semibold text-neo-gold tracking-wide block mb-0.5">
                  Stage 03 · Verified Handoff
                </span>
                <h3 className="font-heading text-base font-semibold text-[#faf6ec]">
                  QR Scan & Fulfillment
                </h3>
                <p className="text-sm text-[#faf6ec]/75 mt-1 max-w-sm font-body leading-relaxed">
                  Shelter staff scan your pass upon delivery. Inventory updates immediately with verified transparency.
                </p>
              </li>
            </ol>
          </div>

          {/* Footer of Left Panel */}
          <div className="relative z-10 text-xs text-[#faf6ec]/60 font-body">
            © {new Date().getFullYear()} Heimdall · Connecting Donors & Local Non-Profit Shelters
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 lg:p-12 bg-neo-bg relative w-full overflow-hidden">
          
          {/* Ambient Warm Backlights (Replacing grid line overlay) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,var(--color-neo-gold)/12,transparent_70%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle_at_bottom_left,var(--color-neo-sun)/8,transparent_70%)] pointer-events-none" />

          {/* Header Action Buttons (Theme & Register redirect) */}
          <div className="flex justify-end gap-3 items-center z-20">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neo-ink bg-neo-rice/80 hover:bg-neo-rice border border-neo-line/60 px-4.5 py-2 rounded-full shadow-sm hover:shadow transition-all duration-200"
            >
              Create Account <ArrowRight className="w-3.5 h-3.5 text-neo-sun" />
            </Link>
            
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-full border border-neo-line/60 bg-neo-rice/80 hover:bg-neo-rice text-neo-ink shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-neo-ink" />
              ) : (
                <Sun className="w-4 h-4 text-neo-gold" />
              )}
            </button>
          </div>

          {/* Form wrapper */}
          <div className="my-auto py-6 z-10 w-full flex items-center justify-center">
            <div className="max-w-xl w-full">
              
              {/* Form title */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neo-sun/10 text-neo-sun text-xs font-semibold tracking-wide mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Community & Donor Portal
                </div>
                <h1 className="font-heading text-3xl lg:text-4xl font-bold text-neo-ink tracking-tight leading-tight">
                  Welcome back
                </h1>
                <p className="text-sm font-body text-neo-ink/75 mt-2 leading-relaxed max-w-md">
                  Sign in to manage your active pledges, view urgent shelter needs, and track your community impact.
                </p>
              </div>

              {/* Render the actual Next.js LoginForm component */}
              <div className="w-full">
                <LoginForm />
              </div>
            </div>
          </div>

          {/* Trust and Security Indicators Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-body text-neo-ink/65 pt-6 border-t border-neo-line/30 z-10">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-neo-sun/80" />
              <span>Your trust is our priority</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-neo-gold" />
              <span>Verified Non-Profit Network</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
