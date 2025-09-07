import { z } from "zod";

export const CheckoutFormSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(7, "Phone number is required"),
    paymentMethod: z.string().min(1, "Payment method is required"),

    // Make them optional first
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    selectedAddressId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.selectedAddressId === "new") {
      if (!data.address) {
        ctx.addIssue({
          path: ["address"],
          code: "custom",
          message: "Address is required",
        });
      }
      if (!data.city) {
        ctx.addIssue({
          path: ["city"],
          code: "custom",
          message: "City is required",
        });
      }
      if (!data.state) {
        ctx.addIssue({
          path: ["state"],
          code: "custom",
          message: "State is required",
        });
      }
    }
  });

export type CheckoutFormData = z.infer<typeof CheckoutFormSchema>;
