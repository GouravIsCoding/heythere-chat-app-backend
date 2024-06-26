import { z } from "zod";

export const updateMemberInHouse = z.object({
  houseId: z.string().uuid({ message: "Invalid houseId" }),
});
