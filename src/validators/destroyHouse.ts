import { z } from "zod";

export const destroyHouse = z.object({
  houseId: z.string().uuid({ message: "Invalid houseId" }),
});
