import { z } from "zod";

export const getRequestedItemSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid requested item ID format")
    .trim(),
});

export const createRequestedItemSchema = z.object({
  requestId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid request ID format")
    .trim(),
  globalItemId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid global item ID format")
    .trim(),
  quantityNeeded: z
    .number()
    .int()
    .positive("Quantity needed must be a positive integer"),
  unit: z
    .string()
    .trim()
    .min(1, "Unit must not be empty")
    .max(50, "Unit must be at most 50 characters")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be at most 500 characters")
    .optional()
    .nullable(),
});

export const updateRequestedItemSchema = z.object({
  quantityNeeded: z
    .number()
    .int()
    .positive("Quantity needed must be a positive integer")
    .optional(),
  unit: z
    .string()
    .trim()
    .min(1, "Unit must not be empty")
    .max(50, "Unit must be at most 50 characters")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must be at most 500 characters")
    .optional()
    .nullable(),
});

export const deleteRequestedItemSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid requested item ID format")
    .trim(),
});

export type CreateRequestedItemInput = z.infer<typeof createRequestedItemSchema>;
export type UpdateRequestedItemInput = z.infer<typeof updateRequestedItemSchema>;
