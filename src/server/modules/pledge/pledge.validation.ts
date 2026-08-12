import { z } from "zod";

export const getPledgeSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid pledge ID format")
    .trim(),
});

export const getPledgeByCodeSchema = z.object({
  code: z.string().trim().min(1, "Pledge code must not be empty"),
});

export const createPledgeSchema = z.object({
  items: z
    .array(
      z.object({
        requestedItemId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid requested item ID format")
          .trim(),
        quantityPledged: z
          .number()
          .int()
          .positive("Quantity pledged must be a positive integer"),
      })
    )
    .min(1, "At least one item must be pledged"),
  scheduledDropOffDate: z.iso
    .datetime({
      message: "Scheduled drop-off date must be a valid ISO datetime string",
    })
    .trim()
    .refine((val) => new Date(val) > new Date(), {
      message: "Scheduled drop-off date must be in the future",
    })
    .transform((val) => new Date(val)),
});

export const verifyPledgeSchema = z.object({
  pledgeCode: z.string().trim().min(1, "Pledge code must not be empty"),
  impactPhotoUrl: z
    .url("Impact photo must be a valid URL")
    .trim()
    .optional()
    .nullable(),
  shelterThankYouNote: z
    .string()
    .trim()
    .max(500, "Thank you note must be at most 500 characters")
    .optional()
    .nullable(),
});

export type CreatePledgeInput = z.infer<typeof createPledgeSchema>;
export type VerifyPledgeInput = z.infer<typeof verifyPledgeSchema>;
