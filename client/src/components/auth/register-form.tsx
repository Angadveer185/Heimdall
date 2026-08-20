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
import { useUserStore } from "@/store/useUserStore";

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

      if (resData.data) {
        useUserStore.getState().setUser(resData.data);
      }

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
      {/* Donor Role Badge */}
      <div className="mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neo-rice border border-neo-line/60 shadow-sm text-neo-ink font-body text-xs font-medium">
        <Heart className="w-3.5 h-3.5 fill-neo-sun text-neo-sun" />
        <span>Donor Registration & Portal</span>
      </div>

      {/* Error Alert Block */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="mb-5 overflow-hidden"
          >
            <div className="bg-neo-sun/15 text-neo-sun border border-neo-sun/30 rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-neo-sun" />
              <div className="text-xs font-medium leading-relaxed font-body">{errorMsg}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <div className="flex items-center">
            <label className="block text-xs font-semibold tracking-wide text-neo-ink font-body">
              Full Name
            </label>
            <span className="text-neo-sun text-sm font-semibold ml-1">*</span>
          </div>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neo-ink/50 pointer-events-none">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jane Doe"
              style={{
                paddingLeft: "2.75rem",
                paddingRight: "1rem",
                paddingTop: "0.75rem",
                paddingBottom: "0.75rem",
              }}
              className={`w-full font-body text-sm bg-neo-rice border ${
                validationErrors.name ? "border-neo-sun focus:ring-neo-sun/30" : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
              } text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all`}
            />
          </div>
          {validationErrors.name && (
            <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1.5 font-body">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <div className="flex items-center">
            <label className="block text-xs font-semibold tracking-wide text-neo-ink font-body">
              Email Address
            </label>
            <span className="text-neo-sun text-sm font-semibold ml-1">*</span>
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
                validationErrors.email ? "border-neo-sun focus:ring-neo-sun/30" : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
              } text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all`}
            />
          </div>
          {validationErrors.email && (
            <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1.5 font-body">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.email}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold tracking-wide text-neo-ink font-body">
              Phone Number
            </label>
            <span className="text-[11px] font-normal text-neo-ink/50 italic font-body">
              Optional
            </span>
          </div>
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
                validationErrors.phone ? "border-neo-sun focus:ring-neo-sun/30" : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
              } text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all`}
            />
          </div>
          {validationErrors.phone && (
            <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1.5 font-body">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.phone}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center">
            <label className="block text-xs font-semibold tracking-wide text-neo-ink font-body">
              Password
            </label>
            <span className="text-neo-sun text-sm font-semibold ml-1">*</span>
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
                validationErrors.password ? "border-neo-sun focus:ring-neo-sun/30" : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
              } text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ top: "50%", transform: "translateY(-50%)" }}
              className="absolute right-3.5 flex items-center text-neo-ink/50 hover:text-neo-ink p-1 rounded-md transition-colors cursor-pointer select-none"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1.5 font-body">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <div className="flex items-center">
            <label className="block text-xs font-semibold tracking-wide text-neo-ink font-body">
              Confirm Password
            </label>
            <span className="text-neo-sun text-sm font-semibold ml-1">*</span>
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
                validationErrors.confirmPassword ? "border-neo-sun focus:ring-neo-sun/30" : "border-neo-line/70 focus:border-neo-sun focus:ring-neo-sun/20"
              } text-neo-ink placeholder-neo-ink/40 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all`}
            />
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-xs font-medium text-neo-sun flex items-center gap-1.5 mt-1.5 font-body">
              <AlertCircle className="w-3.5 h-3.5" /> {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 font-heading font-semibold py-3.5 px-6 text-sm text-neo-rice bg-neo-sun hover:bg-neo-sun/90 rounded-xl shadow-md shadow-neo-sun/20 hover:shadow-lg hover:shadow-neo-sun/25 transition-all duration-200 cursor-pointer disabled:opacity-65"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-neo-rice"
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
                Creating Donor Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create Donor Account
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-neo-line/40" />
          <span className="absolute bg-neo-bg px-3 text-xs font-medium text-neo-ink/50 uppercase font-body tracking-wider">
            OR
          </span>
        </div>

        {/* Google OAuth Register Button */}
        <div>
          <a
            href="/api/auth/google?intent=register_donor"
            className="w-full flex items-center justify-center gap-3 font-heading font-semibold py-3 px-6 text-sm text-neo-ink bg-neo-rice border border-neo-line/70 hover:bg-neo-rice/90 hover:border-neo-line rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </a>
        </div>
      </form>

      {/* Shelter Notice Info Box */}
      <div className="mt-5 p-4 rounded-xl bg-neo-rice border border-neo-line/60 shadow-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-neo-sun shrink-0 mt-0.5" />
        <div className="text-xs font-body text-neo-ink/80 leading-relaxed">
          <span className="font-semibold text-neo-ink font-heading tracking-wide block mb-0.5">
            Looking to register a non-profit shelter?
          </span>
          Register as a donor first. Once your account is active, you can apply
          to register or join your shelter administrative team directly from your profile dashboard.
        </div>
      </div>

      {/* Switch to login */}
      <div className="mt-5 text-center text-xs font-body text-neo-ink/70">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-neo-sun font-semibold hover:underline cursor-pointer inline-flex items-center gap-1 ml-0.5"
        >
          Sign in here
          <Sparkles className="w-3.5 h-3.5 text-neo-sun" />
        </Link>
      </div>
    </div>
  );
}
