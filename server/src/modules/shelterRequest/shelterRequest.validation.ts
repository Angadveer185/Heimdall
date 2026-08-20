import { z } from "zod";
import { Urgency, RequestStatus } from "@prisma/client";

export const getShelterRequestSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid shelter request ID format")
    .trim(),
});

export const createShelterRequestSchema = z.object({
  shelterId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid shelter ID format")
    .trim(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title must be at most 150 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .optional()
    .nullable(),
  urgency: z
    .nativeEnum(Urgency)
    .optional(),
  categoryIds: z
    .array(
      z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format").trim()
    )
    .optional(),
  items: z
    .array(
      z.object({
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
      })
    )
    .optional(),
});

export const updateShelterRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title must be at most 150 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .optional()
    .nullable(),
  urgency: z
    .nativeEnum(Urgency)
    .optional(),
  status: z
    .nativeEnum(RequestStatus)
    .optional(),
  categoryIds: z
    .array(
      z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format").trim()
    )
    .optional(),
});

export const deleteShelterRequestSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid shelter request ID format")
    .trim(),
});

export type CreateShelterRequestInput = z.infer<typeof createShelterRequestSchema>;
export type UpdateShelterRequestInput = z.infer<typeof updateShelterRequestSchema>;
