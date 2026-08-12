import { z } from "zod";

export const getItemSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID format")
    .trim(),
});

export const createItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  defaultUnit: z
    .string()
    .trim()
    .min(1, "Default unit must not be empty")
    .max(50, "Default unit must be at most 50 characters")
    .default("units")
    .optional(),
  categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format")
    .trim()
    .optional(),
});

export const updateItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  defaultUnit: z
    .string()
    .trim()
    .min(1, "Default unit must not be empty")
    .max(50, "Default unit must be at most 50 characters")
    .optional(),
  categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format")
    .trim()
    .optional(),
});

export const deleteItemSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID format")
    .trim(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
