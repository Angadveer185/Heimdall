import { z } from "zod";
import { OrganizationIdType } from "@prisma/client";

export const getShelterSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid shelter ID format")
    .trim(),
});

export const getShelterByOrganizationIdSchema = z.object({
  organizationId: z.string().trim(),
});

export const createShelterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  country: z
    .string()
    .trim()
    .min(1, "Country is required")
    .max(100, "Country must be at most 100 characters"),
  organizationIdType: z.enum(OrganizationIdType, {
    message: "Invalid Organization ID Type",
  }),
  organizationId: z
    .string()
    .trim()
    .min(1, "Organization ID is required")
    .max(100, "Organization ID must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters")
    .optional(),
  street: z
    .string()
    .trim()
    .min(1, "Street is required")
    .max(100, "Street must be at most 100 characters"),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City must be at most 100 characters"),
  state: z
    .string()
    .trim()
    .min(1, "State is required")
    .max(100, "State must be at most 100 characters"),
  zip: z
    .string()
    .trim()
    .min(1, "ZIP code is required")
    .max(20, "ZIP code must be at most 20 characters"),
  longitude: z.number({ message: "Longitude is required" }),
  latitude: z.number({ message: "Latitude is required" }),
  dropOffHours: z
    .string()
    .trim()
    .min(1, "Drop-off hours are required")
    .max(200, "Drop-off hours must be at most 200 characters"),
  contactEmail: z
    .string()
    .min(1, "Contact email is required")
    .email("Please provide a valid email address")
    .trim()
    .max(100, "Contact email must be at most 100 characters"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be at most 20 characters")
    .optional(),
  website: z
    .string()
    .trim()
    .max(200, "Website must be at most 200 characters")
    .optional(),
});

export const updateShelterSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid shelter ID format")
    .trim(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  country: z
    .string()
    .trim()
    .min(1, "Country is required")
    .max(100, "Country must be at most 100 characters")
    .optional(),
  organizationIdType: z.enum(OrganizationIdType, {
    message: "Invalid Organization ID Type",
  }).optional(),
  organizationId: z
    .string()
    .trim()
    .min(1, "Organization ID is required")
    .max(100, "Organization ID must be at most 100 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(200, "Description must be at most 200 characters")
    .optional(),
  street: z
    .string()
    .trim()
    .min(1, "Street is required")
    .max(100, "Street must be at most 100 characters")
    .optional(),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City must be at most 100 characters")
    .optional(),
  state: z
    .string()
    .trim()
    .min(1, "State is required")
    .max(100, "State must be at most 100 characters")
    .optional(),
  zip: z
    .string()
    .trim()
    .min(1, "ZIP code is required")
    .max(20, "ZIP code must be at most 20 characters")
    .optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  dropOffHours: z
    .string()
    .trim()
    .min(1, "Drop-off hours are required")
    .max(200, "Drop-off hours must be at most 200 characters")
    .optional(),
  contactEmail: z
    .string()
    .min(1, "Contact email is required")
    .email("Please provide a valid email address")
    .trim()
    .max(100, "Contact email must be at most 100 characters")
    .optional(),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be at most 20 characters")
    .optional(),
  website: z
    .string()
    .trim()
    .max(200, "Website must be at most 200 characters")
    .optional(),
});

export const deleteShelterSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid shelter ID format")
    .trim(),
});

export type CreateShelterInput = z.infer<typeof createShelterSchema>;
export type UpdateShelterInput = z.infer<typeof updateShelterSchema>;
