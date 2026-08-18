"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
  AlertCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export function LoginForm() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Client-side validations
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setValidationErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || "Failed to log in.");
      }

      useUserStore.getState().setUser(resData.data.user); // Update Zustand store with the logged-in user

      router.push("/profile");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Donor Badge */}
      <div 
        className="mb-4 inline-flex items-center gap-1.5 border border-neo-ink bg-neo-rice text-neo-ink px-3 py-1.5 shadow-[2px_2px_0px_0px_var(--color-neo-ink)] font-label text-xs tracking-wider uppercase"
      >
        <Heart className="w-3.5 h-3.5 fill-neo-sun text-neo-sun" />
        Donor Portal // Security Portal
      </div>

      {/* Error Alert Block */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-neo-sun/10 text-neo-sun border border-neo-sun p-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs font-label font-semibold">
                {errorMsg}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-neo-ink font-semibold font-label">
            Email Address
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ paddingLeft: "2.75rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              className={`w-full font-body text-sm bg-neo-rice border ${
                validationErrors.email ? "border-neo-sun" : "border-neo-line"
              } text-neo-ink placeholder-neo-ink/40 focus:outline-none focus:border-neo-sun focus:ring-1 focus:ring-neo-sun transition-colors`}
            />
          </div>
          {validationErrors.email && (
            <p className="text-xs font-label font-semibold text-neo-sun flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {validationErrors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-neo-ink font-semibold font-label">
            Password
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem", paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
              className={`w-full font-body text-sm bg-neo-rice border ${
                validationErrors.password ? "border-neo-sun" : "border-neo-line"
              } text-neo-ink placeholder-neo-ink/40 focus:outline-none focus:border-neo-sun focus:ring-1 focus:ring-neo-sun transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ top: "50%", transform: "translateY(-50%)" }}
              className="absolute right-3.5 flex items-center text-neo-ink/45 hover:text-neo-ink transition-colors cursor-pointer select-none"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-xs font-label font-semibold text-neo-sun flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {validationErrors.password}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 font-label font-semibold py-3 text-xs tracking-wider uppercase bg-neo-sun hover:opacity-90 text-neo-rice border border-neo-sun transition-all duration-150 cursor-pointer disabled:opacity-65"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-neo-rice" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying Credentials...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Access System
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 text-center text-xs font-label text-neo-ink/60">
        New to Heimdall?{" "}
        <Link
          href="/register"
          className="text-neo-sun font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5"
        >
          Create an account here
          <Sparkles className="w-3.5 h-3.5 fill-neo-sun/10" />
        </Link>
      </div>
    </div>
  );
}
