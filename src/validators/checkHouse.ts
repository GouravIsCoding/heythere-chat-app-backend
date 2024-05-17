import { z } from "zod";

export const checkHouse = z.object({
  name: z
    .string()
    .min(2, { message: "minimum 2 characters are needed" })
    .max(30, { message: "max 30 characters" }),
});
