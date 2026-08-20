"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  QrCode,
  Building2,
  MapPin,
  Camera,
  Heart,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Users,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      id: "ein-verification",
      title: "Verified Non-Profit Shelters",
      subtitle: "TRUSTED COMMUNITY ORGANIZATIONS",
      description:
        "Every shelter facility is officially verified before posting wishlists, so you can be 100% confident your donation reaches a legitimate non-profit.",
      icon: Building2,
      badge: "VERIFIED ORGANIZATIONS",
    },
    {
      id: "qr-tickets",
      title: "Digital Drop-Off Pass",
      subtitle: "FAST & EASY DROP-OFFS",
      description:
        "When you pledge items, a digital pass with a simple QR code is saved to your account. Shelter staff scan it in 5 seconds when you drop off.",
      icon: QrCode,
      badge: "DIGITAL PASS",
    },
    {
      id: "impact-photo",
      title: "Photo Proof & Thank-You Notes",
      subtitle: "SEE YOUR REAL IMPACT",
      description:
        "Shelter staff snap a photo confirmation when receiving your items and send a personal thank-you note directly to your donor profile.",
      icon: Camera,
      badge: "PHOTO CONFIRMATION",
    },
    {
      id: "zero-waste",
      title: "Zero Waste & Duplicate Control",
      subtitle: "SMART INVENTORY MANAGEMENT",
      description:
        "Real-time item reservation prevents shelters from receiving 50 extra coats while remaining completely out of infant diapers and food.",
      icon: RefreshCw,
      badge: "BALANCED SUPPLY",
    },
    {
      id: "urgency-radar",
      title: "Urgent Local Demands",
      subtitle: "CRITICAL HELP WHERE NEEDED MOST",
      description:
        "Easily view urgent needs near you tagged by priority (Critical, High, Medium) so you can respond quickly to emergency situations.",
      icon: MapPin,
      badge: "LOCAL MAP",
    },
    {
      id: "privacy-secure",
      title: "Safe & Private Account",
      subtitle: "PROTECTED PERSONAL INFORMATION",
      description:
        "Your contact information and donation history are kept strictly secure and private. You control what you share with shelters.",
      icon: ShieldCheck,
      badge: "PRIVACY FIRST",
    },
  ];

  return (
    <section
      id="features"
      className="w-full py-16 lg:py-24 bg-neo-rice text-neo-ink border-b border-neo-line/40 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neo-line/60 bg-neo-bg text-neo-sun font-heading text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-neo-sun" />
            <span>WHY COMMUNITIES TRUST HEIMDALL</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-neo-ink">
            Built for Trust, Ease & Community Impact
          </h2>

          <p className="font-body text-base sm:text-lg text-neo-ash leading-relaxed">
            Every feature in Heimdall is designed to make giving simple for donors and inventory management stress-free for local shelters.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-2xl bg-neo-bg border border-neo-line/60 p-6 flex flex-col justify-between hover:border-neo-sun/60 transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-md"
              >
                <div className="space-y-4">
                  {/* Top Bar Icon & Badge */}
                  <div className="flex items-center justify-between border-b border-neo-line/40 pb-3">
                    <div className="w-10 h-10 rounded-xl bg-neo-rice border border-neo-line/60 text-neo-sun flex items-center justify-center group-hover:bg-neo-sun group-hover:text-neo-rice transition-colors shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-heading text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neo-sun/10 text-neo-sun border border-neo-sun/30">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Subtitle & Title */}
                  <div className="space-y-1">
                    <span className="font-heading text-[10px] text-neo-ash uppercase font-semibold tracking-wider block">
                      {feat.subtitle}
                    </span>
                    <h3 className="font-heading font-bold text-xl text-neo-ink group-hover:text-neo-sun transition-colors">
                      {feat.title}
                    </h3>
                  </div>

                  <p className="font-body text-sm text-neo-ash leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Card Footnote Action */}
                <div className="mt-6 pt-3 border-t border-neo-line/40 flex items-center justify-between font-body text-xs text-neo-ash">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Community Verified
                  </span>
                  <span className="text-neo-ink font-heading font-semibold group-hover:text-neo-sun flex items-center gap-0.5">
                    Learn More <ArrowUpRight className="w-3.5 h-3.5 text-neo-sun" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
