import { z } from "zod";

export const updateMemberInHouse = z.object({
  userId: z.string().uuid({ message: "Invalid userId" }),
  houseId: z.string().uuid({ message: "Invalid houseId" }),
});
