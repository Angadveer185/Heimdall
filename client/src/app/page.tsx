"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-neo-bg text-neo-ink font-body selection:bg-neo-sun selection:text-neo-rice">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col w-full">
        {/* 1. Hero Section & CTAs */}
        <HeroSection />

        {/* 2. How Heimdall Works (3 Simple Steps) */}
        <AboutSection />

        {/* 3. Features & Trust Section */}
        <FeaturesSection />

        {/* 4. Community Reviews & Stories */}
        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
