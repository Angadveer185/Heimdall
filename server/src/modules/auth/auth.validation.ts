import z from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const registerSuperAdminSchema = registerSchema.extend({
  inviteToken: z
    .string()
    .min(1, "Super Admin invite secret is required"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export type RegisterData = z.infer<typeof registerSchema>;
export type RegisterSuperAdminData = z.infer<typeof registerSuperAdminSchema>;
export type LoginData = z.infer<typeof loginSchema>;
