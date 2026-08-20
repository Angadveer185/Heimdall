import { Request, Response, NextFunction } from "express";

/**
 * Formats a Date object into a human-readable local string representation.
 * Example format: "August 10, 2026, 09:23:05 AM"
 */
function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/**
 * Recursively cleans response data by formatting dates and stripping sensitive credentials.
 */
function sanitizeAndFormat(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;

  if (obj instanceof Date) {
    return formatDateTime(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeAndFormat(item));
  }

  if (typeof obj === "object") {
    const rawObj = obj as Record<string, unknown>;
    const newObj: Record<string, unknown> = {};
    for (const key of Object.keys(rawObj)) {
      if (key === "passwordHash" || key === "refreshTokenHash") {
        continue;
      }
      const val = rawObj[key];

      // Handle ISO 8601 string formatting
      if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(val)) {
        const date = new Date(val);
        if (!isNaN(date.getTime())) {
          newObj[key] = formatDateTime(date);
          continue;
        }
      }

      newObj[key] = sanitizeAndFormat(val);
    }
    return newObj;
  }

  return obj;
}

/**
 * Express middleware to intercept JSON responses, formatting DateTimes and sanitizing credentials.
 */
export function responseFormatter(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.json = function (body: any) {
    const formattedBody = sanitizeAndFormat(body);
    return originalJson(formattedBody);
  };

  next();
}
