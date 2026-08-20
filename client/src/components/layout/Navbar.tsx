"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme/theme-context";
import {
  Sun,
  Moon,
  Menu,
  X,
  ShieldCheck,
  ArrowUpRight,
  Heart,
  QrCode,
  ListChecks,
  Sparkles,
} from "lucide-react";

import { useUserStore } from "@/store/useUserStore";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearUser();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setVisible(false); // Scrolling down -> slide navbar up
      } else if (currentScrollY < lastScrollY) {
        setVisible(true); // Scrolling up -> slide navbar down
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { name: "Live Wishlists", href: "#hero-wishlists", icon: Heart },
    { name: "How It Works", href: "#about-protocol", icon: ListChecks },
    { name: "Why Heimdall", href: "#features", icon: Sparkles },
    { name: "Community Stories", href: "#reviews", icon: QrCode },
  ];

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: visible ? 0 : "-100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky top-0 z-50 w-full"
    >
      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-200 border-b ${
          scrolled
            ? "bg-neo-bg/95 backdrop-blur-md border-neo-line/60 shadow-md py-3"
            : "bg-neo-bg/85 backdrop-blur-sm border-neo-line/40 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-neo-rice border border-neo-line/60 group-hover:border-neo-sun transition-colors duration-200 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-neo-sun" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-xl tracking-tight text-neo-ink group-hover:text-neo-sun transition-colors">
                  HEIMDALL
                </span>
              </div>
              <span className="text-[11px] font-body text-neo-ash">
                Community Donation Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 border border-neo-line/40 bg-neo-rice/70 p-1.5 rounded-xl shadow-xs">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3.5 py-1.5 text-xs font-heading font-semibold text-neo-ink hover:text-neo-sun hover:bg-neo-bg rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Icon className="w-3.5 h-3.5 text-neo-sun" />
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Action CTAs & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-neo-line/60 bg-neo-rice text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all cursor-pointer shadow-sm"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-neo-sun" />
              ) : (
                <Sun className="w-4 h-4 text-neo-sun" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-neo-line/60 bg-neo-rice hover:border-neo-sun transition-all group shadow-sm"
                  title="View Profile Dossier"
                >
                  <div className="w-5 h-5 rounded-full bg-neo-sun/15 border border-neo-sun/40 text-neo-sun flex items-center justify-center font-heading text-[10px] uppercase font-bold">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <span className="text-xs font-heading font-semibold text-neo-ink group-hover:text-neo-sun transition-colors">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-xs font-heading font-semibold text-neo-sun border border-neo-sun/40 bg-neo-rice hover:bg-neo-sun hover:text-neo-rice transition-all cursor-pointer shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                {/* Login Link */}
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-heading font-semibold text-neo-ink border border-neo-line/60 bg-neo-rice/60 hover:bg-neo-rice hover:border-neo-sun hover:text-neo-sun transition-all shadow-sm"
                >
                  Sign In
                </Link>

                {/* Register / Pledge Button */}
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-xs font-heading font-semibold bg-neo-sun text-neo-rice border border-neo-sun hover:bg-neo-sun/90 transition-all flex items-center gap-1.5 shadow-md shadow-neo-sun/20"
                >
                  <span>Get Started</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neo-rice" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-neo-line/60 bg-neo-rice text-neo-ink"
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-neo-sun" /> : <Sun className="w-4 h-4 text-neo-sun" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-neo-line/60 bg-neo-rice text-neo-ink"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-neo-sun" /> : <Menu className="w-5 h-5 text-neo-sun" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-b border-neo-line/60 bg-neo-bg px-4 py-4 space-y-3 shadow-lg"
          >
            <div className="flex flex-col space-y-2 font-heading text-xs font-semibold">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl border border-neo-line/40 bg-neo-rice flex items-center gap-2.5 text-neo-ink hover:text-neo-sun hover:border-neo-sun transition-all"
                  >
                    <Icon className="w-4 h-4 text-neo-sun" />
                    {link.name}
                  </a>
                );
              })}
            </div>
            <div className="pt-2 flex flex-col gap-2 font-heading text-xs font-semibold">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-neo-line/60 text-neo-ink hover:bg-neo-rice"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-neo-sun text-neo-rice shadow-md shadow-neo-sun/20"
              >
                Get Started / Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
