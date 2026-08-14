"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  CheckCircle2,
  Building2,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  QrCode,
} from "lucide-react";

export function ReviewsSection() {
  const reviews = [
    {
      id: "review-1",
      role: "SHELTER_ADMIN",
      name: "Elena Rostova",
      title: "Operations Director",
      organization: "Hope Harbor Crisis Center",
      location: "San Francisco, CA",
      badge: "VERIFIED 501(c)(3) SHELTER",
      rating: 5,
      quote:
        "Heimdall completely eliminated double-donations and phone tag. When winter hit, we published a need for 50 heavy sleeping bags and received exact counts before the first freeze.",
      stats: "142 Items Received // 100% Fulfilled",
      avatarInitials: "ER",
    },
    {
      id: "review-2",
      role: "DONOR",
      name: "Marcus Chen",
      title: "Frequent Community Donor",
      organization: "Bay Area Resident",
      location: "Oakland, CA",
      badge: "VERIFIED DONOR // 18 PLEDGES",
      rating: 5,
      quote:
        "Receiving a notification when my pledged goods were scanned at drop-off—along with a photo proof of families receiving them—changed how I view charity.",
      stats: "18 Drop-offs Completed // \$2,400 Impact",
      avatarInitials: "MC",
    },
    {
      id: "review-3",
      role: "AUDITOR",
      name: "Dr. Aris Thorne",
      title: "Non-Profit Audit Officer",
      organization: "Urban Logistics Watch",
      location: "San Jose, CA",
      badge: "LOGISTICS AUDITOR",
      rating: 5,
      quote:
        "The atomic 3-stage inventory protocol is the first platform that mathematically guarantees zero donation leakage. It provides 100% auditability for donors and shelters.",
      stats: "Audited 48 Shelter Accounts",
      avatarInitials: "AT",
    },
    {
      id: "review-4",
      role: "SHELTER_ADMIN",
      name: "Aisha Patel",
      title: "Supply Chain Lead",
      organization: "St. Jude Family Sanctuary",
      location: "San Jose, CA",
      badge: "VERIFIED 501(c)(3) SHELTER",
      rating: 5,
      quote:
        "Scanning QR code passes on arrival takes 3 seconds per drop-off. Inventory status updates automatically, so our team spends time serving families instead of doing paperwork.",
      stats: "310 Kits Scanned // Zero Discrepancy",
      avatarInitials: "AP",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const current = reviews[currentIndex];

  return (
    <section
      id="reviews"
      className="w-full py-20 bg-neo-bg text-neo-ink border-b border-neo-line/40 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-neo-line bg-neo-rice text-neo-ash font-label text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-neo-sun" />
            <span>TRANSPARENCY REVIEWS</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-neo-ink">
            Trusted by Shelters & Community Donors
          </h2>

          <p className="font-body text-base sm:text-lg text-neo-ash leading-relaxed">
            See how non-profit shelters, active donors, and independent auditors rely on Heimdall's transparent inventory pipeline.
          </p>
        </motion.div>

        {/* Carousel / Interactive Review Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-neo-rice border border-neo-line p-6 sm:p-10 relative shadow-lg">
            
            {/* Top Bar Navigation & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neo-line/40 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neo-night text-neo-gold font-heading font-bold text-lg flex items-center justify-center border border-neo-line">
                  {current.avatarInitials}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-neo-ink">
                    {current.name}
                  </h3>
                  <p className="font-body text-xs text-neo-ash">
                    {current.title} • <span className="text-neo-ink font-semibold">{current.organization}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-label text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 border bg-neo-bg text-neo-sun border-neo-sun">
                  {current.badge}
                </span>
              </div>
            </div>

            {/* Quote Body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-neo-gold text-neo-gold" />
                  ))}
                  <span className="font-label text-xs text-neo-ash ml-2">
                    5.0 / 5.0 VERIFIED RATING
                  </span>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-3 -left-3 w-8 h-8 text-neo-line/30 -z-0" />
                  <p className="font-body text-lg sm:text-xl text-neo-ink italic leading-relaxed relative z-10 pl-4 border-l-2 border-neo-sun">
                    "{current.quote}"
                  </p>
                </div>

                {/* Stat Pill */}
                <div className="pt-4 flex flex-wrap items-center justify-between text-xs font-label border-t border-neo-line/30 text-neo-ash">
                  <span className="flex items-center gap-1.5 text-neo-ink">
                    <CheckCircle2 className="w-4 h-4 text-neo-sun" />
                    {current.stats}
                  </span>
                  <span>LOCATION :: {current.location}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <div className="mt-8 pt-6 border-t border-neo-line/40 flex items-center justify-between">
              <div className="flex items-center gap-2 font-label text-xs">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2.5 h-2.5 transition-all ${
                      i === currentIndex
                        ? "bg-neo-sun w-6"
                        : "bg-neo-line/50 hover:bg-neo-line"
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevReview}
                  className="p-2 border border-neo-line bg-neo-bg hover:border-neo-sun text-neo-ink transition-colors cursor-pointer"
                  aria-label="Previous Review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextReview}
                  className="p-2 border border-neo-line bg-neo-bg hover:border-neo-sun text-neo-ink transition-colors cursor-pointer"
                  aria-label="Next Review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
