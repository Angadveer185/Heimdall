"use client";

import React from "react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/super-register-form";
import { useTheme } from "@/components/theme/theme-context";
import { Sun, Moon } from "lucide-react";

export default function RegisterPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neo-bg text-neo-ink font-body selection:bg-neo-sun selection:text-neo-rice">
      <div className="film-grain" />

      {/* Outer Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Left Interactive Vibe Panel (hidden on mobile, visible on desktop) */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-8 lg:p-12 overflow-hidden text-[#faf6ec] bg-neo-night lg:border-r border-neo-line/20">
          
          {/* Agenda Background Glow & Sun Disk */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Soft Radial Ambient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,var(--color-neo-gold),transparent_20rem)]" />
            {/* The Sun / Crimson Disk */}
            <div 
              className="absolute -right-32 top-0 w-80 h-80 rounded-full bg-gradient-to-b from-neo-gold to-neo-sun mix-blend-multiply opacity-80 filter blur-[1px]" 
              style={{ transform: "translate3d(0,0,0)" }}
            />
          </div>

          {/* Header Area */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Retro-futurism Brand Mark */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#faf6ec]/35 bg-gradient-to-br from-neo-gold via-neo-sun to-neo-night transition-transform duration-500 group-hover:rotate-180">
                <div className="absolute inset-[58%] 0 0 bg-neo-bg/60" />
              </div>
              <div className="grid gap-0.5 font-label text-xs leading-none uppercase tracking-widest text-[#faf6ec]/80">
                <span className="font-bold text-[#faf6ec]">HEIMDALL</span>
                <span>SYSTEM</span>
              </div>
            </Link>
            <div className="font-label text-xs uppercase tracking-widest text-neo-gold">
              EST. 2026 // LOGISTICS
            </div>
          </div>

          {/* Mid Section: Pipeline Timeline (The Agenda style) */}
          <div className="relative z-10 my-16 lg:my-auto lg:pl-6">
            <div className="mb-8">
              <span className="font-label text-xs uppercase tracking-widest text-neo-gold block mb-2">// PIPELINE PIPELINE</span>
              <h2 className="font-heading text-3xl font-light uppercase tracking-tight text-[#faf6ec] leading-none">
                Three Stages of Transparency
              </h2>
            </div>

            {/* Timeline Rail */}
            <ol className="relative border-l border-neo-gold/40 pl-6 space-y-8 font-body">
              
              {/* Step 1 */}
              <li className="relative">
                {/* Node Dot */}
                <div className="absolute -left-[30px] top-1.5 w-[9px] h-[9px] rounded-full border border-neo-gold bg-neo-night" />
                <time className="font-label text-xs uppercase font-bold text-neo-gold block mb-0.5">
                  STAGE 01 <span className="text-[#faf6ec]/40 font-normal ml-1.5">01 // AVAILABLE</span>
                </time>
                <h3 className="font-heading text-sm font-semibold text-[#faf6ec] uppercase tracking-wide">
                  Explore Live Wishlists
                </h3>
                <p className="text-sm text-[#faf6ec]/70 mt-1 max-w-sm font-light">
                  Browse real-time community needs directly. Transparent quantities required, units, and urgency levels.
                </p>
              </li>

              {/* Step 2 */}
              <li className="relative">
                {/* Node Dot */}
                <div className="absolute -left-[30px] top-1.5 w-[9px] h-[9px] rounded-full border border-neo-gold bg-neo-night" />
                <time className="font-label text-xs uppercase font-bold text-neo-gold block mb-0.5">
                  STAGE 02 <span className="text-[#faf6ec]/40 font-normal ml-1.5">02 // PLEDGED</span>
                </time>
                <h3 className="font-heading text-sm font-semibold text-[#faf6ec] uppercase tracking-wide">
                  Secure Pledge Reservations
                </h3>
                <p className="text-sm text-[#faf6ec]/70 mt-1 max-w-sm font-light">
                  Reserve items securely using safe race-prevention transactions. Instant digital QR tickets generated.
                </p>
              </li>

              {/* Step 3 */}
              <li className="relative">
                {/* Node Dot */}
                <div className="absolute -left-[30px] top-1.5 w-[9px] h-[9px] rounded-full border border-neo-gold bg-neo-night" />
                <time className="font-label text-xs uppercase font-bold text-neo-gold block mb-0.5">
                  STAGE 03 <span className="text-[#faf6ec]/40 font-normal ml-1.5">03 // DELIVERED</span>
                </time>
                <h3 className="font-heading text-sm font-semibold text-[#faf6ec] uppercase tracking-wide">
                  Verified Handoff Scan
                </h3>
                <p className="text-sm text-[#faf6ec]/70 mt-1 max-w-sm font-light">
                  Shelters scan your ticket at drop-off. Inventory shifts instantly to verified fulfillment.
                </p>
              </li>
            </ol>
          </div>

          {/* Footer of Left Panel */}
          <div className="relative z-10 text-xs font-label text-[#faf6ec]/55 tracking-wider">
            © {new Date().getFullYear()} HEIMDALL // TOKYO 2042 INSPIRATION
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 lg:px-12 neo-grid-bg relative w-full">
          
          {/* Header Action Button (Theme & Login redirect) */}
          <div className="flex justify-end gap-3 items-center z-20">
            <Link 
              href="/login" 
              className="font-label text-xs font-semibold uppercase tracking-wider text-neo-ink border border-neo-ink px-4 py-2 hover:bg-neo-ink hover:text-neo-rice transition-colors"
            >
              Sign In →
            </Link>
            
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 border border-neo-ink text-neo-ink hover:bg-neo-ink hover:text-neo-rice transition-colors cursor-pointer animate-none"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Form wrapper */}
          <div className="my-auto py-2 z-10 w-full flex items-center justify-center">
            <div className="max-w-xl w-full">
              
              {/* Form title */}
              <div className="mb-6">
                <span className="font-label text-xs uppercase tracking-widest text-neo-sun font-bold block mb-1">
                  // REGISTER SUPER ADMIN ACCOUNT
                </span>
                <h1 className="font-heading text-4xl lg:text-5xl font-light text-neo-ink tracking-tight uppercase leading-none">
                  JOIN THE NETWORK
                </h1>
                <p className="text-sm font-body text-neo-ink/70 mt-2">
                  Create a secure operational profile to pledge, track, and verify drop-offs.
                </p>
              </div>

              {/* Render the actual Next.js register form component */}
              <div className="w-full">
                <RegisterForm />
              </div>
            </div>
          </div>

          {/* Bottom metadata details */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-label text-neo-ink/60 tracking-wider pt-6 border-t border-neo-line/35 z-10">
            <div>SECURITY: STRICT SAMEDATE COOKIE AUTH // RBAC REGISTER</div>
            <div>STATUS: ACTIVE NODE</div>
          </div>
        </div>

      </div>
    </div>
  );
}