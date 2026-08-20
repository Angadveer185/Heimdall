"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ListChecks,
  QrCode,
  CheckCircle2,
  ArrowRight,
  Heart,
  Sparkles,
  ShieldCheck,
  Building,
} from "lucide-react";

export function AboutSection() {
  const steps = [
    {
      step: "01",
      title: "Shelters List Exact Needs",
      badge: "STEP 1 · TRANSPARENT NEEDS",
      description:
        "Verified non-profit shelters list exact items and quantities they need right now — from warm blankets to infant formula — so you know precisely what is required.",
      detailItems: [
        "100% verified non-profit shelters",
        "Categorized by urgent priority and location",
        "Live progress updates as items are pledged",
      ],
      icon: ListChecks,
    },
    {
      step: "02",
      title: "Donors Reserve & Pledge",
      badge: "STEP 2 · NO DUPLICATES",
      description:
        "Choose the items you can drop off and reserve them on the website. This prevents shelters from receiving 100 extra blankets while lacking basic hygiene supplies.",
      detailItems: [
        "Digital Drop-Off Pass generated instantly",
        "Reserves items so others know help is on the way",
        "Flexible drop-off dates matching shelter hours",
      ],
      icon: Heart,
    },
    {
      step: "03",
      title: "Drop Off & Photo Confirmation",
      badge: "STEP 3 · REAL IMPACT",
      description:
        "Bring your items to the shelter and show your digital pass. Shelter staff quickly confirm receipt and post a photo update so you see your donation in action.",
      detailItems: [
        "Quick 5-second QR pass scan at drop-off",
        "Photo confirmation sent to your profile",
        "Full trust and confidence in your donation",
      ],
      icon: QrCode,
    },
  ];

  return (
    <section
      id="about-protocol"
      className="w-full py-16 lg:py-24 bg-neo-bg text-neo-ink border-b border-neo-line/40 relative overflow-hidden"
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neo-line/60 bg-neo-rice text-neo-sun font-heading text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-neo-sun" />
            <span>HOW HEIMDALL WORKS</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-neo-ink">
            How Community Giving Works
          </h2>

          <p className="font-body text-base sm:text-lg text-neo-ash leading-relaxed">
            Traditional giving can feel uncertain when you don&apos;t know if your donation is actually needed. Heimdall makes giving simple, transparent, and direct in 3 simple steps.
          </p>
        </motion.div>

        {/* 3-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            return (
              <motion.div
                key={stepItem.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="relative rounded-2xl bg-neo-rice border border-neo-line/60 p-6 sm:p-8 flex flex-col justify-between hover:border-neo-sun/60 transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                {/* Top Step Number Badge */}
                <div className="flex items-center justify-between border-b border-neo-line/40 pb-4 mb-5">
                  <span className="font-heading text-xl font-bold text-neo-sun">
                    {stepItem.step}
                  </span>
                  <span className="inline-block font-heading text-xs font-semibold px-3 py-1 rounded-full bg-neo-bg text-neo-ink border border-neo-line/60">
                    {stepItem.badge}
                  </span>
                </div>

                {/* Step Title & Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-bg text-neo-sun shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading font-bold text-xl text-neo-ink group-hover:text-neo-sun transition-colors">
                      {stepItem.title}
                    </h3>
                  </div>

                  <p className="font-body text-sm text-neo-ash leading-relaxed">
                    {stepItem.description}
                  </p>

                  {/* Bullet Checklist */}
                  <ul className="space-y-2 pt-3 border-t border-neo-line/40 font-body text-xs text-neo-ink">
                    {stepItem.detailItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-neo-sun shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footnote */}
                <div className="mt-6 pt-4 border-t border-neo-line/40 flex items-center justify-between text-xs font-heading font-semibold text-neo-ash">
                  <span>COMMUNITY GIVING</span>
                  <span className="text-neo-sun group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
                    Learn More <ArrowRight className="w-3.5 h-3.5 text-neo-sun" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Community Trust Callout Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 rounded-2xl bg-neo-rice text-neo-ink border border-neo-line/60 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md"
        >
          <div className="space-y-2 text-left max-w-2xl">
            <div className="flex items-center gap-2 text-neo-sun font-heading text-xs font-semibold uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-neo-sun" />
              <span>Full Transparency Guarantee</span>
            </div>
            <h3 className="font-heading font-bold text-2xl text-neo-ink">
              Every Item Accounted For. Zero Guesswork.
            </h3>
            <p className="font-body text-sm text-neo-ash leading-relaxed">
              When shelters receive exact requested quantities, resources go further and families get what they truly need. Join our community of verified donors and local shelters today.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href="/register"
              className="px-6 py-3.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs uppercase tracking-wider hover:bg-neo-sun/90 transition-all flex items-center gap-2 border border-neo-sun shadow-md shadow-neo-sun/20 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-neo-rice fill-neo-rice" />
              <span>Start Giving Today</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
