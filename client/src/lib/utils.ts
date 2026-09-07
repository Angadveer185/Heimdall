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
    let d: Date;
    if (dateVal instanceof Date) {
      d = dateVal;
    } else if (typeof dateVal === "number") {
      d = new Date(dateVal);
    } else if (typeof dateVal === "string") {
      const trimmed = dateVal.trim();
      if (!trimmed) return fallback;
      if (/^\d+$/.test(trimmed)) {
        d = new Date(parseInt(trimmed, 10));
      } else if (trimmed.includes(" ") && !trimmed.includes("T")) {
        d = new Date(trimmed.replace(" ", "T"));
      } else {
        d = new Date(trimmed);
      }
    } else {
      d = new Date(dateVal as unknown as string);
    }

    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("en-US", options ?? {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return fallback;
  }
}
