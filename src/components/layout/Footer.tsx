"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, QrCode, Lock, CheckCircle2, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-neo-rice text-neo-ink border-t border-neo-line/40 pt-12 pb-8 px-4 sm:px-6 lg:px-8 font-body text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neo-sun flex items-center justify-center border border-neo-sun text-neo-rice font-bold text-lg shadow-sm">
              <ShieldCheck className="w-6 h-6 text-neo-rice" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xl tracking-tight text-neo-ink">
                  HEIMDALL
                </span>
                <span className="text-[10px] bg-neo-sun/10 px-2 py-0.5 rounded-full border border-neo-sun/30 text-neo-sun font-heading font-semibold">
                  Verified NGO Platform
                </span>
              </div>
              <p className="text-xs text-neo-ash font-body">
                Transparent Community Logistics & Shelter Support
              </p>
            </div>
          </div>

          <p className="text-neo-ash font-body text-sm leading-relaxed max-w-md">
            Connecting local non-profit shelters directly with community donors to ensure every contribution reaches people in need with total transparency.
          </p>

          <div className="p-3.5 rounded-xl border border-neo-line/60 bg-neo-bg max-w-md space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neo-ash font-medium">Platform Guarantee:</span>
              <span className="text-neo-sun font-heading font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Verified Impact
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neo-ash font-medium">Shelter Validation:</span>
              <span className="text-neo-ink font-heading font-semibold">Tax-Exempt 501(c)(3) Registry</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-xs tracking-wider uppercase text-neo-sun">
            How It Works
          </h3>
          <ul className="space-y-2 text-neo-ash font-medium text-xs">
            <li>
              <a href="#about-protocol" className="hover:text-neo-sun transition-colors">
                3-Step Giving Process
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-neo-sun transition-colors">
                Zero Waste Guarantee
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-neo-sun transition-colors">
                Digital Pass Drop-Off
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-neo-sun transition-colors">
                Photo Proof Receipt
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Portals */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-xs tracking-wider uppercase text-neo-sun">
            Portals
          </h3>
          <ul className="space-y-2 text-neo-ash font-medium text-xs">
            <li>
              <Link href="/login" className="hover:text-neo-sun transition-colors flex items-center gap-1">
                <span>Donor Drop-off Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neo-sun" />
              </Link>
            </li>
            <li>
              <Link href="/register?type=shelter" className="hover:text-neo-sun transition-colors flex items-center gap-1">
                <span>Shelter Registration</span>
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
                Live Shelter Wishlists
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Trust & Security */}
        <div className="space-y-3">
          <h3 className="font-heading font-bold text-xs tracking-wider uppercase text-neo-sun">
            Trust & Security
          </h3>
          <ul className="space-y-2 text-neo-ash font-medium text-xs">
            <li className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-neo-sun" /> Secure Session Cookies
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neo-sun" /> Verified Shelter EINs
            </li>
            <li className="flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-neo-sun" /> Private Digital Passes
            </li>
            <li className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-neo-sun" /> Direct Community Help
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-neo-line/40 flex flex-col md:flex-row items-center justify-between gap-4 text-neo-ash text-xs font-body">
        <div className="flex items-center gap-3">
          <span>&copy; {new Date().getFullYear()} Project Heimdall. All Rights Reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-neo-sun transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-neo-sun transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-neo-sun transition-colors">Transparency Audit</a>
        </div>
      </div>
    </footer>
  );
}
