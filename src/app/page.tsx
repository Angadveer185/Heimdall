import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-neo-bg text-neo-ink font-body film-grain selection:bg-neo-sun selection:text-neo-rice">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col w-full">
        {/* 1. Hero Section & CTAs */}
        <HeroSection />

        {/* 2. About the Site (The 3-Stage Protocol) */}
        <AboutSection />

        {/* 3. Features Section */}
        <FeaturesSection />

        {/* 4. User Reviews & Testimonials */}
        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
