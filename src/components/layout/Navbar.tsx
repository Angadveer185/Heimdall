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
  Activity,
  Heart,
  QrCode,
  Layers,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { name: "3-Stage Protocol", href: "#about-protocol", icon: Layers },
    { name: "Features", href: "#features", icon: Sparkles },
    { name: "Transparency Reviews", href: "#reviews", icon: QrCode },
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
        className={`w-full transition-all duration-200 border-b ${scrolled
            ? "bg-neo-bg/95 backdrop-blur-md border-neo-line/60 shadow-md py-3"
            : "bg-neo-bg/85 backdrop-blur-sm border-neo-line/40 py-4"
          }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 bg-neo-rice border border-neo-line group-hover:border-neo-sun transition-colors duration-200 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-neo-sun" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-xl tracking-tight text-neo-ink group-hover:text-neo-sun transition-colors">
                  HEIMDALL
                </span>
                <span className="text-[10px] font-label px-1.5 py-0.5 border border-neo-line bg-neo-rice text-neo-ink">
                  501(c)(3)
                </span>
              </div>
              <span className="text-[10px] font-label tracking-widest text-neo-ash uppercase">
                Donation Logistics
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 border border-neo-line/40 bg-neo-rice/70 p-1 rounded-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-3 py-1.5 text-xs font-label uppercase tracking-wider text-neo-ink hover:text-neo-sun hover:bg-neo-bg transition-colors flex items-center gap-2"
                >
                  <Icon className="w-3.5 h-3.5 text-neo-sun" />
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Action CTAs & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 border border-neo-line bg-neo-rice text-neo-ink hover:border-neo-sun hover:text-neo-sun transition-all cursor-pointer shadow-sm"
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-neo-sun" />
              ) : (
                <Sun className="w-4 h-4 text-neo-sun" />
              )}
            </button>

            {/* Login Link */}
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-label uppercase tracking-wider text-neo-ink border border-neo-line/60 bg-neo-rice/50 hover:bg-neo-rice hover:border-neo-sun hover:text-neo-sun transition-all"
            >
              Sign In
            </Link>

            {/* Register / Pledge Button */}
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-label uppercase tracking-wider bg-neo-sun text-neo-rice font-semibold border border-neo-sun hover:bg-neo-sun/90 active:translate-y-0.5 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neo-rice" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 border border-neo-line bg-neo-rice text-neo-ink"
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-neo-sun" /> : <Sun className="w-4 h-4 text-neo-sun" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-neo-line bg-neo-rice text-neo-ink"
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
            className="sm:hidden border-b border-neo-line bg-neo-bg px-4 py-4 space-y-3 shadow-lg"
          >
            <div className="flex flex-col space-y-2 font-label text-xs uppercase">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 border border-neo-line/40 bg-neo-rice/60 flex items-center gap-2.5 text-neo-ink hover:text-neo-sun hover:border-neo-sun"
                  >
                    <Icon className="w-4 h-4 text-neo-sun" />
                    {link.name}
                  </a>
                );
              })}
            </div>
            <div className="pt-2 flex flex-col gap-2 font-label text-xs uppercase">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 border border-neo-line text-neo-ink hover:bg-neo-rice"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-neo-sun text-neo-rice font-bold"
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
