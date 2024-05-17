import { z } from "zod";

export const signupValidate = z.object({
  firstname: z
    .string()
    .min(1, { message: "First name cannot be empty" })
    .max(50, { message: "First name cannot be more than 50 characters" }),

  lastname: z
    .string()
    .min(1, { message: "Last name cannot be empty" })
    .max(50, { message: "Last name cannot be more than 50 characters" }),

  email: z.string().email({ message: "Email not valid." }),

  bio: z
    .string()
    .min(1, { message: "Bio cannot be empty" })
    .max(255, { message: "Bio cannot be more than 255 characters" })
    .optional(),

  password: z
    .string()
    .min(6, { message: "Password has to be minimum 6 characters" })
    .max(30, { message: "Password cannot be more than 30 characters" }),
});
