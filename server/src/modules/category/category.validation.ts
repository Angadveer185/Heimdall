import { z } from "zod";

export const getCategorySchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format")
    .trim(),
});

export const getCategoryByNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  icon: z.string().trim().max(200, "Icon must be at most 200 characters"),
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters")
    .optional(),
});

export const updateCategorySchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format")
    .trim(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  icon: z
    .string()
    .trim()
    .max(200, "Icon must be at most 200 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters")
    .optional(),
});

export const deleteCategorySchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format")
    .trim(),
});

export type createCategoryInput = z.infer<typeof createCategorySchema>;
export type updateCategoryInput = z.infer<typeof updateCategorySchema>;