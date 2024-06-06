import { Router } from "express";

import { authMiddleware } from "../../middleware/auth";
import { getMessagesBeforeTime } from "../../db/message/getMessagesBeforeTime";

const router = Router();

router.get("/page", authMiddleware, async (req, res) => {
  try {
    const { cursor, houseId } = req.query;

    if (!houseId)
      return res.status(400).json({ message: "houseId not provided" });

    const messages = await getMessagesBeforeTime(
      cursor ? Number(cursor) : null,
      String(houseId)
    );

    if (messages.length === 0 || messages.length === 1)
      return res.json({ message: "Here are the messages", messages });

    let high = messages.length - 1;
    let low = 0;
    while (low < high) {
      let temp = messages[low];
      messages[low] = messages[high];
      messages[high] = temp;
      low++;
      high--;
    }

    return res.json({ message: "Here are the messages", messages });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});

export default router;
