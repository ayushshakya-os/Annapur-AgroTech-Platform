import * as z from "zod";

export const createAccountSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .regex(
        /^[a-zA-Z]{2,}(?:\s+[a-zA-Z]{2,})+$/,
        "Enter your full name (first and last name)"
      ),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    phone: z
      .string()
      .min(1, "Phone no. is required")
      .regex(
        /^(98|97)\d{8}$/,
        "Phone must start with 98 or 97 and be 10 digits"
      ),
    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
        "Password must be 8+ characters, include upper, lower, number and a symbol"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.string().min(1, "Please select a role"),
    termsChecked: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
