"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  PackageCheck,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowRight,
  HeartHandshake,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PledgedItemDetail {
  id: string;
  quantityPledged: number;
  requestedItem?: {
    globalItem?: {
      title: string;
      defaultUnit?: string;
    };
    unit?: string;
  };
}

export interface ShelterPledgeData {
  id: string;
  pledgeCode: string;
  status: string;
  scheduledDropOffDate: string;
  donor?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    pledgesCompleted?: number;
    profileImageUrl?: string | null;
  };
  items?: PledgedItemDetail[];
}

interface ShelterVerifyDropoffModalProps {
  pledge: ShelterPledgeData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ShelterVerifyDropoffModal({
  pledge,
  isOpen,
  onClose,
  onSuccess,
}: ShelterVerifyDropoffModalProps) {
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"ENTER_CODE" | "CONFIRM_COMPLETION" | "COMPLETED">("ENTER_CODE");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isFulfilling, setIsFulfilling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thankYouNote, setThankYouNote] = useState("");

  if (!isOpen || !pledge) return null;

  const handleReset = () => {
    setCode("");
    setStep("ENTER_CODE");
    setIsVerifying(false);
    setIsFulfilling(false);
    setError(null);
    setThankYouNote("");
  };

  const handleModalClose = () => {
    handleReset();
    onClose();
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the pledge code.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const res = await fetch(`/api/pledges/${pledge.id}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Incorrect code. Please double-check the pledge code provided by the donor.");
      } else {
        setStep("CONFIRM_COMPLETION");
      }
    } catch (err) {
      console.error("Error verifying pledge code:", err);
      setError("An unexpected error occurred while verifying the code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleConfirmFulfill = async () => {
    setIsFulfilling(true);
    setError(null);

    try {
      const res = await fetch("/api/pledges/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pledgeCode: pledge.pledgeCode,
          shelterThankYouNote: thankYouNote.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to complete drop-off. Please try again.");
      } else {
        setStep("COMPLETED");
        onSuccess();
      }
    } catch (err) {
      console.error("Error completing drop-off:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsFulfilling(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neo-night/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleModalClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-neo-rice border border-neo-line/80 shadow-2xl p-6 md:p-8 space-y-6 text-neo-ink animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-2 rounded-xl border border-neo-line/60 bg-neo-bg hover:bg-neo-line/20 text-neo-ash hover:text-neo-ink transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: Enter & Verify Code */}
        {step === "ENTER_CODE" && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-neo-sun/15 border border-neo-sun/30 flex items-center justify-center text-neo-sun shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neo-sun/10 text-neo-sun text-[10px] font-heading font-semibold uppercase tracking-wider mb-0.5">
                  <KeyRound className="w-3 h-3" />
                  Shelter Verification
                </div>
                <h3 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
                  Verify Donor Drop-Off
                </h3>
              </div>
            </div>

            {/* Target Pledge Summary */}
            <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2 text-xs font-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                  <span className="font-heading font-semibold text-neo-ink">
                    {pledge.donor?.name || "Registered Donor"}
                  </span>
                  {pledge.donor?.pledgesCompleted !== undefined && (
                    <span className="text-[10px] text-neo-ash">
                      ({pledge.donor.pledgesCompleted} drop-offs completed)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-neo-ash">
                  <Calendar className="w-3.5 h-3.5 text-neo-sun shrink-0" />
                  <span>{formatDate(pledge.scheduledDropOffDate)}</span>
                </div>
              </div>

              {pledge.items && pledge.items.length > 0 && (
                <div className="pt-2 border-t border-neo-line/40 flex flex-wrap gap-1.5">
                  {pledge.items.map((item) => (
                    <span
                      key={item.id}
                      className="px-2 py-0.5 rounded bg-neo-rice border border-neo-line/60 text-[11px] font-body text-neo-ink"
                    >
                      <strong className="font-heading text-neo-sun">
                        {item.quantityPledged}x
                      </strong>{" "}
                      {item.requestedItem?.globalItem?.title || "Item"}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-body flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="font-heading font-semibold block">
                    Verification Failed
                  </strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Code Input Form */}
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="pledgeCodeInput"
                  className="block text-xs font-heading font-semibold uppercase tracking-wider text-neo-ash"
                >
                  Enter Donor Pledge Code
                </label>
                <input
                  id="pledgeCodeInput"
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. PLG-ABC123"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-neo-bg border border-neo-line/60 focus:border-neo-sun focus:ring-1 focus:ring-neo-sun text-base font-mono font-bold text-neo-ink placeholder:font-sans placeholder:font-normal placeholder:text-neo-ash/60 outline-none transition-all uppercase tracking-wider"
                />
                <p className="text-[11px] font-body text-neo-ash">
                  The donor can find their code by clicking "Get Code" on their active pledge card.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-neo-line/40">
                <button
                  type="button"
                  onClick={handleModalClose}
                  disabled={isVerifying}
                  className="px-4 py-2.5 rounded-xl bg-neo-bg text-neo-ink font-heading font-semibold text-xs border border-neo-line/60 hover:bg-neo-line/20 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || !code.trim()}
                  className="px-5 py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-bold text-xs hover:bg-neo-sun/90 transition-all flex items-center gap-2 shadow-md shadow-neo-sun/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Code Verified - Confirmation Prompt */}
        {step === "CONFIRM_COMPLETION" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-heading font-semibold uppercase tracking-wider mb-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  Code Matches
                </div>
                <h3 className="font-heading font-bold text-xl md:text-2xl text-neo-ink">
                  Code Verified
                </h3>
              </div>
            </div>

            {/* Verification Prompt Card */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <p className="font-heading font-bold text-sm text-emerald-800 dark:text-emerald-200">
                Code Verified, would you like to complete the dropoff?
              </p>
              <p className="text-xs font-body text-neo-ash">
                Confirming completion will mark this pledge as delivered, update inventory counts, and increment the donor's completed drop-offs count.
              </p>
            </div>

            {/* Drop-off Details */}
            <div className="p-4 rounded-xl bg-neo-bg border border-neo-line/60 space-y-2.5 text-xs font-body">
              <div className="flex items-center justify-between border-b border-neo-line/40 pb-2">
                <span className="text-neo-ash">Pledge Code:</span>
                <span className="font-mono font-bold text-neo-ink">#{pledge.pledgeCode}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neo-line/40 pb-2">
                <span className="text-neo-ash">Donor:</span>
                <span className="font-heading font-semibold text-neo-ink">
                  {pledge.donor?.name || "Registered Donor"}
                </span>
              </div>

              {pledge.items && pledge.items.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-neo-ash block">Items to be delivered:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {pledge.items.map((item) => (
                      <span
                        key={item.id}
                        className="px-2 py-0.5 rounded bg-neo-rice border border-neo-line/60 text-[11px] font-body text-neo-ink"
                      >
                        <strong className="font-heading text-emerald-600 dark:text-emerald-400">
                          {item.quantityPledged}x
                        </strong>{" "}
                        {item.requestedItem?.globalItem?.title || "Item"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Optional Thank-You Note */}
            <div className="space-y-1.5">
              <label
                htmlFor="thankYouNoteInput"
                className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-neo-ash"
              >
                Optional Thank-You Note for Donor
              </label>
              <input
                id="thankYouNoteInput"
                type="text"
                value={thankYouNote}
                onChange={(e) => setThankYouNote(e.target.value)}
                placeholder="e.g. Thank you so much for your generous support!"
                maxLength={500}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neo-bg border border-neo-line/60 focus:border-neo-sun focus:ring-1 focus:ring-neo-sun text-xs text-neo-ink placeholder:text-neo-ash/60 outline-none transition-all"
              />
            </div>

            {/* Error Message if fulfillment fails */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-body flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons: Yes / Cancel */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neo-line/40">
              <button
                type="button"
                onClick={handleModalClose}
                disabled={isFulfilling}
                className="px-4 py-2.5 rounded-xl bg-neo-bg text-neo-ink font-heading font-semibold text-xs border border-neo-line/60 hover:bg-neo-line/20 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFulfill}
                disabled={isFulfilling}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isFulfilling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Yes, Complete Dropoff</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Celebration */}
        {step === "COMPLETED" && (
          <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-2xl text-neo-ink">
                Drop-Off Completed!
              </h3>
              <p className="text-xs font-body text-neo-ash max-w-sm mx-auto">
                The pledge has been fulfilled and closed. The donor's completed drop-offs score has incremented by 1.
              </p>
            </div>
            <div className="pt-3 border-t border-neo-line/40">
              <button
                type="button"
                onClick={handleModalClose}
                className="w-full py-2.5 rounded-xl bg-neo-sun text-neo-rice font-heading font-semibold text-xs border border-neo-sun hover:bg-neo-sun/90 transition-all shadow-md shadow-neo-sun/20 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
