"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Heart,
  Info,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function RegisterForm() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Client-side validations
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.trim().length > 50) {
      errors.name = "Name must be at most 50 characters";
    }

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
    } else if (password.length > 100) {
      errors.password = "Password must be at most 100 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (phone && phone.trim().length < 7) {
      errors.phone = "Phone number is too short";
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        if (resData.errors && Array.isArray(resData.errors)) {
          const errorsMap: { [key: string]: string } = {};
          resData.errors.forEach(
            (err: { path: (string | number)[]; message: string }) => {
              const field = err.path[0];
              if (field) errorsMap[field] = err.message;
            },
          );
          setValidationErrors(errorsMap);
          throw new Error("Validation check failed. Please check the inputs.");
        }
        throw new Error(resData.message || "Failed to register account.");
      }

      router.push("/");
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
      {/* Donor Role Badge */}
      <div className="mb-4 inline-flex items-center gap-1.5 border border-neo-ink bg-neo-rice text-neo-ink px-3 py-1.5 shadow-[2px_2px_0px_0px_var(--color-neo-ink)] font-label text-xs tracking-wider uppercase">
        <Heart className="w-3.5 h-3.5 fill-neo-sun text-neo-sun" />
        Donor Portal // Registration
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
              <div className="text-xs font-label font-semibold">{errorMsg}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <div className="flex items-center">
            <label className="block text-xs uppercase tracking-wider text-neo-ink font-semibold font-label">
            Full Name
          </label>
            <span className="text-[20px] font-normal text-neo-sun normal-case italic font-body">
              *
            </span>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              style={{
                paddingLeft: "2.75rem",
                paddingRight: "1rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
              }}
              className={`w-full font-body text-sm bg-neo-rice border ${
                validationErrors.name ? "border-neo-sun" : "border-neo-line"
              } text-neo-ink placeholder-neo-ink/40 focus:outline-none focus:border-neo-sun focus:ring-1 focus:ring-neo-sun transition-colors`}
            />
          </div>
          {validationErrors.name && (
            <p className="text-xs font-label font-semibold text-neo-sun flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {validationErrors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <div className="flex items-center">
            <label className="block text-xs uppercase tracking-wider text-neo-ink font-semibold font-label">
            Email Address
          </label>
            <span className="text-[20px] font-normal text-neo-sun normal-case italic font-body">
              *
            </span>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                paddingLeft: "2.75rem",
                paddingRight: "1rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
              }}
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

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider text-neo-ink font-semibold font-label flex items-center justify-between">
            <span>Phone Number</span>
            <span className="text-[10px] font-normal text-neo-ink/50 normal-case italic font-body">
              Optional
            </span>
          </label>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
              <Phone className="w-4 h-4" />
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              style={{
                paddingLeft: "2.75rem",
                paddingRight: "1rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
              }}
              className={`w-full font-body text-sm bg-neo-rice border ${
                validationErrors.phone ? "border-neo-sun" : "border-neo-line"
              } text-neo-ink placeholder-neo-ink/40 focus:outline-none focus:border-neo-sun focus:ring-1 focus:ring-neo-sun transition-colors`}
            />
          </div>
          {validationErrors.phone && (
            <p className="text-xs font-label font-semibold text-neo-sun flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {validationErrors.phone}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center">
            <label className="block text-xs uppercase tracking-wider text-neo-ink font-semibold font-label">
            Password
          </label>
            <span className="text-[20px] font-normal text-neo-sun normal-case italic font-body">
              *
            </span>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                paddingLeft: "2.75rem",
                paddingRight: "2.75rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
              }}
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
        {/* Confirm Password */}
        <div className="space-y-1">
          <div className="flex items-center">
            <label className="block text-xs uppercase tracking-wider text-neo-ink font-semibold font-label">
              Confirm Password
            </label>
            <span className="text-[20px] font-normal text-neo-sun normal-case italic font-body">
              *
            </span>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                paddingLeft: "2.75rem",
                paddingRight: "2.75rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
              }}
              className={`w-full font-body text-sm bg-neo-rice border ${
                validationErrors.confirmPassword ? "border-neo-sun" : "border-neo-line"
              } text-neo-ink placeholder-neo-ink/40 focus:outline-none focus:border-neo-sun focus:ring-1 focus:ring-neo-sun transition-colors`}
            />
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-xs font-label font-semibold text-neo-sun flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> {validationErrors.confirmPassword}
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
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-neo-rice"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign Up As Donor
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Shelter Notice Info Box */}
      <div className="mt-4 p-3 bg-neo-ash/10 border border-neo-line flex items-start gap-3">
        <Info className="w-5 h-5 text-neo-sun shrink-0 mt-0.5" />
        <div className="text-xs font-body text-neo-ink/75">
          <span className="font-bold text-neo-ink font-heading uppercase tracking-wide block mb-0.5">
            Looking to register a shelter?
          </span>
          Register as a donor first. Once your account is active, you can apply
          to register or join your shelter administrative team directly from the
          platform interface.
        </div>
      </div>

      {/* Switch to login */}
      <div className="mt-4 text-center text-xs font-label text-neo-ink/60">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-neo-sun font-bold hover:underline cursor-pointer inline-flex items-center gap-0.5"
        >
          Log In here
          <Sparkles className="w-3.5 h-3.5 fill-neo-sun/10" />
        </Link>
      </div>
    </div>
  );
}
