import { Router } from "express";
import { ZodError } from "zod";

import { createHouseDb, destroyHouseDb } from "../../db/house";
import { createHouse } from "../../validators/createHouse";
import { destroyHouse } from "../../validators/destroyHouse";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.post("/add", authMiddleware, async (req, res) => {
  try {
    createHouse.parse(req.body);
    const { userId } = res.locals;

    const house = await createHouseDb(
      userId,
      req.body.name,
      req.body.description
    );
    return res.json({ message: "House created succesfully", ...house });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message });
    }
    if (error instanceof Error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});

router.post("/remove", authMiddleware, async (req, res) => {
  try {
    const data = destroyHouse.parse(req.body);
    const { userId } = res.locals;
    const house = await destroyHouseDb(userId, data.houseId);
    return res.json({ message: "House destroyed succesfully", ...house });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message });
    }
    if (error instanceof Error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});

export default router;
