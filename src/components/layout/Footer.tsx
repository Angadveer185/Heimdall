"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, QrCode, Lock, CheckCircle2, ExternalLink, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-neo-rice text-neo-ink border-t border-neo-line pt-12 pb-8 px-4 sm:px-6 lg:px-8 font-label text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-sun flex items-center justify-center border border-neo-line text-neo-rice font-bold text-lg shadow-sm">
              <ShieldCheck className="w-6 h-6 text-neo-rice" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xl tracking-tight text-neo-ink">
                  HEIMDALL
                </span>
                <span className="text-[10px] bg-neo-bg px-1.5 py-0.5 border border-neo-line text-neo-sun font-bold">
                  v2040.8
                </span>
              </div>
              <p className="text-[11px] text-neo-ash font-body">
                Operational Micro-Logistics & Donation Transparency
              </p>
            </div>
          </div>

          <p className="text-neo-ash font-body text-sm leading-relaxed max-w-md">
            Connecting local non-profit shelters with community donors through a zero-leakage, mathematically verifiable 3-stage inventory protocol.
          </p>

          <div className="p-3 border border-neo-line/60 bg-neo-bg max-w-md space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neo-ash uppercase">Protocol Status:</span>
              <span className="text-neo-sun font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-neo-sun" /> 100% AUDITED
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neo-ash uppercase">EIN Verification Engine:</span>
              <span className="text-neo-ink font-mono font-semibold">PROPUBLICA API LIVE</span>
            </div>
          </div>
        </div>

        {/* Column 2: Protocol */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm tracking-wider uppercase text-neo-sun flex items-center gap-1.5">
            <span>【 01 】</span> Protocol
          </h3>
          <ul className="space-y-2 text-neo-ash font-medium">
            <li>
              <a href="#about-protocol" className="hover:text-neo-sun transition-colors">
                3-Stage Inventory Pipeline
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-neo-sun transition-colors">
                Atomic Race Lock
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-neo-sun transition-colors">
                QR Drop-Off Tickets
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-neo-sun transition-colors">
                Photo Proof Verification
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Portals */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm tracking-wider uppercase text-neo-sun flex items-center gap-1.5">
            <span>【 02 】</span> Portals
          </h3>
          <ul className="space-y-2 text-neo-ash font-medium">
            <li>
              <Link href="/login" className="hover:text-neo-sun transition-colors flex items-center gap-1">
                <span>Donor Drop-off Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neo-sun" />
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-neo-sun transition-colors flex items-center gap-1">
                <span>Shelter 501(c)(3) Register</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neo-sun" />
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-neo-sun transition-colors">
                Super Admin Desk
              </Link>
            </li>
            <li>
              <a href="#hero-wishlists" className="hover:text-neo-sun transition-colors">
                Active Wishlist Radar
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Security & Compliance */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-sm tracking-wider uppercase text-neo-sun flex items-center gap-1.5">
            <span>【 03 】</span> Security
          </h3>
          <ul className="space-y-2 text-neo-ash font-medium">
            <li className="flex items-center gap-1.5 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-neo-sun" /> httpOnly Cookies
            </li>
            <li className="flex items-center gap-1.5 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-neo-sun" /> Prisma `$transaction`
            </li>
            <li className="flex items-center gap-1.5 text-[11px]">
              <QrCode className="w-3.5 h-3.5 text-neo-sun" /> Encrypted QR Pass
            </li>
            <li className="flex items-center gap-1.5 text-[11px]">
              <Heart className="w-3.5 h-3.5 text-neo-sun" /> Zero Inventory Leakage
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-neo-line/40 flex flex-col md:flex-row items-center justify-between gap-4 text-neo-ash text-[11px]">
        <div className="flex items-center gap-3">
          <span>&copy; {new Date().getFullYear()} HEIMDALL LOGISTICS CORE. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-neo-sun transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-neo-sun transition-colors">Terms of Protocol</a>
          <a href="#" className="hover:text-neo-sun transition-colors">Audit Ledger</a>
        </div>
      </div>
    </footer>
  );
}
