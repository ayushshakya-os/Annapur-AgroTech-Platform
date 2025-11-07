// lib/validation/addProductSchema.ts
import { z } from "zod";

export const AddProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .positive("Price must be positive"),
  category: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  isBiddable: z.boolean().optional(),
  imageFile: z
    .instanceof(File)
    .refine((f) => f.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .optional()
    .nullable(),
});

export type AddProductFormData = z.infer<typeof AddProductSchema>;
