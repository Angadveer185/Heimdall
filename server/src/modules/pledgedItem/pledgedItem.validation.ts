import { z } from "zod";

export const getPledgedItemSchema = z.object({
    id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid pledged item ID format")
    .trim(),
});

export const createPledgedItemSchema = z.object({
    pledgeId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid pledge ID format")
    .trim(),
    requestedItemId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid requested item ID format")
    .trim(),
    quantityPledged: z
    .number()
    .int()
    .positive({ message: "Quantity pledged must be a positive integer" })
});

export const updatePledgedItemSchema = z.object({
    quantityPledged: z
    .number()
    .int()
    .positive({ message: "Quantity pledged must be a positive integer" })
});

export const deletePledgedItemSchema = z.object({
    id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid pledged item ID format")
    .trim()
});

export type CreatePledgedItemInput = z.infer<typeof createPledgedItemSchema>;
export type UpdatePledgedItemInput = z.infer<typeof updatePledgedItemSchema>;