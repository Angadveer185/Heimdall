"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Layers,
  ShieldCheck,
  QrCode,
  Lock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Camera,
  Activity,
  Zap,
} from "lucide-react";

export function AboutSection() {
  const protocolStages = [
    {
      stage: "01",
      title: "Available to Pledge",
      kanji: "開",
      accentColor: "border-neo-gold text-neo-gold",
      badge: "LIVE DEMAND LIST",
      formula: "Available = quantityNeeded - quantityReserved",
      description:
        "Shelters itemize exact inventory needs. Public wishlists state raw counts required, unit metrics, and real-time urgency scores.",
      detailItems: [
        "100% verified 501(c)(3) shelter origin",
        "Categorized by priority & geographic radius",
        "Transparent real-time count updates",
      ],
      icon: Layers,
    },
    {
      stage: "02",
      title: "Pledged & Atomic Reserve",
      kanji: "約",
      accentColor: "border-neo-sun text-neo-sun",
      badge: "PRISMA TRANSACTION LOCK",
      formula: "PLEDGED -> Increments quantityReserved",
      description:
        "Donors select items to drop off. A database transaction executes atomically—guaranteeing zero double-pledges or race conditions.",
      detailItems: [
        "Encrypted QR Drop-off Pass generated",
        "Pledge reservation lock with expiration timer",
        "Atomic capacity control in MongoDB Atlas",
      ],
      icon: Lock,
    },
    {
      stage: "03",
      title: "QR Scan & Verification",
      kanji: "済",
      accentColor: "border-neo-ink text-neo-ink",
      badge: "INSTANT PHOTO RECEIPT",
      formula: "DELIVERED -> Increments quantityDelivered",
      description:
        "Donor presents QR pass at shelter. Admin scans QR code to verify receipt, incrementing delivered counts and issuing photo proof.",
      detailItems: [
        "Instant smartphone camera QR scanning",
        "Proof photo attached directly to donor record",
        "100% complete audit log closed",
      ],
      icon: QrCode,
    },
  ];

  return (
    <section
      id="about-protocol"
      className="w-full py-20 bg-neo-bg text-neo-ink border-b border-neo-line/40 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-neo-line bg-neo-rice text-neo-ash font-label text-xs uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-neo-sun" />
            <span>THE HEIMDALL ARCHITECTURE</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-neo-ink">
            How The 3-Stage Pipeline Works
          </h2>

          <p className="font-body text-base sm:text-lg text-neo-ash leading-relaxed">
            Traditional charity platforms suffer from mystery black holes and zero inventory accountability. Heimdall enforces a strict, mathematically verifiable 3-state pipeline.
          </p>
        </motion.div>

        {/* 3-Stage Protocol Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {protocolStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="relative bg-neo-rice border border-neo-line p-6 flex flex-col justify-between hover:border-neo-sun transition-all duration-300 group shadow-sm"
              >
                {/* Top Kanji Stamp & Stage Number */}
                <div className="flex items-center justify-between border-b border-neo-line/40 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-2xl font-bold text-neo-sun">
                      STAGE {stage.stage}
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-neo-bg text-neo-ink flex items-center justify-center border border-neo-line font-heading font-bold text-sm shadow-sm">
                    {stage.kanji}
                  </div>
                </div>

                {/* Stage Title & Icon */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border border-neo-line bg-neo-bg text-neo-sun shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-neo-ink group-hover:text-neo-sun transition-colors">
                      {stage.title}
                    </h3>
                  </div>

                  <span className="inline-block font-label text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border bg-neo-bg text-neo-ash">
                    {stage.badge}
                  </span>

                  {/* Theme-Aware Formula Box */}
                  <div className="p-3 bg-neo-bg text-neo-ink border border-neo-line/70 font-label text-[11px] shadow-inner">
                    <span className="text-neo-sun font-bold">\[</span>{" "}
                    <span className="text-neo-ink font-semibold">{stage.formula}</span>{" "}
                    <span className="text-neo-sun font-bold">\]</span>
                  </div>

                  <p className="font-body text-sm text-neo-ash leading-relaxed pt-1">
                    {stage.description}
                  </p>

                  {/* Bullet Checklist */}
                  <ul className="space-y-2 pt-2 border-t border-neo-line/30 font-label text-xs text-neo-ink">
                    {stage.detailItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neo-sun shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footnote */}
                <div className="mt-6 pt-3 border-t border-neo-line/40 flex items-center justify-between text-[11px] font-label text-neo-ash">
                  <span>ATOMIC PIPELINE</span>
                  <span className="text-neo-sun group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                    PROTOCOL {stage.stage} <ArrowRight className="w-3 h-3 text-neo-sun" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Guaranteed Mathematical Constraint Box - Theme-Aware */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-neo-rice text-neo-ink border border-neo-line/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md"
        >
          <div className="space-y-2 text-left max-w-2xl">
            <div className="flex items-center gap-2 text-neo-sun font-label text-xs font-bold uppercase tracking-widest">
              <Zap className="w-4 h-4 text-neo-sun animate-bounce" />
              <span>GUARANTEED MATHEMATICAL CONSTRAINTS</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-neo-ink">
              No Over-Allocation. No Lost Pledges. 100% Audit Trace.
            </h3>
            <p className="font-body text-sm text-neo-ash leading-relaxed">
              Every reservation executes within Prisma database transactions. The system enforces that <code className="text-neo-sun bg-neo-bg px-1.5 py-0.5 border border-neo-line font-mono font-bold">quantityReserved</code> will never exceed remaining unpledged capacity under high concurrent donor load.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href="/register"
              className="px-6 py-3 bg-neo-sun text-neo-rice font-label text-xs uppercase font-bold tracking-wider hover:bg-neo-sun/90 transition-all flex items-center gap-2 border border-neo-sun shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-neo-rice" />
              <span>Verify Protocol</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
