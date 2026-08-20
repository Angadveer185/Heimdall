import { z } from "zod";
import { Role } from "@prisma/client";

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

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters"),
  email: z
    .string()
    .email("Please provide a valid email address")
    .trim(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters"),
  role: z.nativeEnum(Role).optional().default(Role.DONOR),
  phone: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional(),
  shelterId: z.string().nullable().optional(),
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
  phone: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional(),
  role: z.nativeEnum(Role).optional(),
  shelterId: z.string().nullable().optional(),
  isReported: z.boolean().optional(),
});

export const deleteUserSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
    .trim(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;