"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
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
      badge: "VERIFIED SHELTER DIRECTOR",
      rating: 5,
      quote:
        "Heimdall completely eliminated donation black holes and phone tag. When winter hit, we listed 50 heavy sleeping bags and received exact counts before the first freeze.",
      stats: "142 Essential Items Received · 100% Fulfilled",
      avatarInitials: "ER",
    },
    {
      id: "review-2",
      role: "DONOR",
      name: "Marcus Chen",
      title: "Community Donor",
      organization: "Bay Area Resident",
      location: "Oakland, CA",
      badge: "ACTIVE DONOR · 18 PLEDGES",
      rating: 5,
      quote:
        "Knowing my pledged goods were scanned upon drop-off—along with a photo thank-you note showing families receiving them—completely changed how I view community giving.",
      stats: "18 Drop-offs Completed · 100% Verified",
      avatarInitials: "MC",
    },
    {
      id: "review-3",
      role: "VOLUNTEER",
      name: "Sarah Jenkins",
      title: "Community Outreach Lead",
      organization: "Urban Community Watch",
      location: "San Jose, CA",
      badge: "COMMUNITY VOLUNTEER",
      rating: 5,
      quote:
        "The step-by-step reservation system guarantees zero wasted effort. Shelters get exactly what they need, and donors know their items are directly making a difference.",
      stats: "Helped Coordinate 48 Local Wishlists",
      avatarInitials: "SJ",
    },
    {
      id: "review-4",
      role: "SHELTER_ADMIN",
      name: "Aisha Patel",
      title: "Supply Coordinator",
      organization: "St. Jude Family Sanctuary",
      location: "San Jose, CA",
      badge: "VERIFIED SHELTER ADMIN",
      rating: 5,
      quote:
        "Scanning the digital pass when donors arrive takes less than 5 seconds. Our team spends time helping families instead of filling out paper receipts.",
      stats: "310 Kits Scanned · Zero Discrepancy",
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
      className="w-full py-16 lg:py-24 bg-neo-bg text-neo-ink border-b border-neo-line/40 relative overflow-hidden"
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neo-line/60 bg-neo-rice text-neo-sun font-heading text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-neo-sun" />
            <span>COMMUNITY STORIES</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-neo-ink">
            Loved by Donors & Shelter Teams
          </h2>

          <p className="font-body text-base sm:text-lg text-neo-ash leading-relaxed">
            See how non-profit shelters and active community donors rely on Heimdall to bring direct help where it&apos;s needed most.
          </p>
        </motion.div>

        {/* Carousel / Interactive Review Card */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-neo-rice border border-neo-line/60 p-6 sm:p-10 relative shadow-xl">
            
            {/* Top Bar Info & Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neo-line/40 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neo-gold to-neo-sun text-neo-rice font-heading font-bold text-lg flex items-center justify-center border border-neo-line/60 shadow-sm">
                  {current.avatarInitials}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-neo-ink">
                    {current.name}
                  </h3>
                  <p className="font-body text-xs text-neo-ash">
                    {current.title} · <span className="text-neo-ink font-semibold">{current.organization}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-heading text-xs font-semibold px-3 py-1 rounded-full bg-neo-sun/10 text-neo-sun border border-neo-sun/30">
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
                  <span className="font-body text-xs text-neo-ash ml-2 font-medium">
                    5.0 / 5.0 Verified Community Experience
                  </span>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-3 -left-3 w-8 h-8 text-neo-line/30 -z-0" />
                  <p className="font-body text-lg sm:text-xl text-neo-ink italic leading-relaxed relative z-10 pl-4 border-l-2 border-neo-sun">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                </div>

                {/* Stat Line */}
                <div className="pt-4 flex flex-wrap items-center justify-between text-xs font-body border-t border-neo-line/40 text-neo-ash">
                  <span className="flex items-center gap-1.5 text-neo-ink font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {current.stats}
                  </span>
                  <span>LOCATION: {current.location}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <div className="mt-8 pt-6 border-t border-neo-line/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      i === currentIndex
                        ? "bg-neo-sun w-7"
                        : "bg-neo-line/50 w-2.5 hover:bg-neo-line"
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevReview}
                  className="p-2.5 rounded-full border border-neo-line/60 bg-neo-bg hover:border-neo-sun text-neo-ink transition-colors cursor-pointer shadow-sm"
                  aria-label="Previous Story"
                >
                  <ChevronLeft className="w-5 h-5 text-neo-sun" />
                </button>
                <button
                  onClick={nextReview}
                  className="p-2.5 rounded-full border border-neo-line/60 bg-neo-bg hover:border-neo-sun text-neo-ink transition-colors cursor-pointer shadow-sm"
                  aria-label="Next Story"
                >
                  <ChevronRight className="w-5 h-5 text-neo-sun" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
