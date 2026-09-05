import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Robust date formatter that safely handles null, undefined, timestamps,
 * and invalid date strings without crashing or printing "Invalid Date".
 */
export function formatDate(
  dateVal?: string | number | Date | null,
  fallback = "N/A",
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateVal) return fallback;
  try {
    const d = typeof dateVal === "string" || typeof dateVal === "number" ? new Date(dateVal) : dateVal;
    if (!(d instanceof Date) || isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-US", options ?? {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return fallback;
  }
}
