import { z } from "zod";

export const getUserSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
    .trim(),
});

export const getUserByEmailSchema = z.object({
  email: z
    .string()
    .email("Please provide a valid email address")
    .trim(),
});

export const updateUserSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
    .trim(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters")
    .optional(),
  email: z
    .string()
    .email("Please provide a valid email address")
    .trim()
    .optional(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .optional(),
  phone: z.string().optional(),
});

export const deleteUserSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
    .trim(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;