import { z } from "zod";

export const signinValidate = z.object({
  email: z.string().email({ message: "Email not valid." }),

  password: z
    .string()
    .min(6, { message: "Password has to be minimum 6 characters" })
    .max(30, { message: "Password cannot be more than 30 characters" }),
});
