import { Router } from "express";
import { ZodError } from "zod";

import {
  checkHouseDb,
  createHouseDb,
  destroyHouseDb,
  getHouseDb,
  getHousesByPage,
} from "../../db/house";
import { createHouse } from "../../validators/createHouse";
import { destroyHouse } from "../../validators/destroyHouse";
import { authMiddleware } from "../../middleware/auth";
import { checkHouse } from "../../validators/checkHouse";

const router = Router();

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals;
    const page = Number(req.query.page);

    const houses = await getHousesByPage(userId, page);

    res.json({
      message: "Houses List",
      houses,
      nextCursor: page + 1,
      prevCursor: page - 1,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});

router.post("/check", async (req, res) => {
  try {
    checkHouse.parse(req.body);

    const isHouse = await checkHouseDb(req.body.name);

    if (!isHouse) {
      return res.json({ message: "name not present!", housePresent: false });
    }

    return res.json({ message: "name present!", housePresent: true });
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

router.get("/:houseId", async (req, res) => {
  try {
    const { houseId } = req.params;

    const house = await getHouseDb(houseId);

    if (!house) return res.status(400).json({ message: "House Not Found" });

    return res.json({ message: "House found!", ...house });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});

export default router;
