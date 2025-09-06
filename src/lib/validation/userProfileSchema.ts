import { z } from "zod";
const phoneValidation = new RegExp(
  /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/
);

export const UserProfileSchema = z.object({
  firstName: z.string().min(1, { message: "Firstname is required" }),
  lastName: z.string().min(1, { message: "Lastname is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  phone: z.coerce
    .string()
    .min(1, { message: "Must have at least 1 character" })
    .regex(phoneValidation, { message: "Invalid Phone Number" }),
});
export type TUserProfile = z.infer<typeof UserProfileSchema>;
