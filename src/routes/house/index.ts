import { Router } from "express";
import { ZodError } from "zod";

import {
  checkHouseDb,
  createHouseDb,
  destroyHouseDb,
  getHouseDb,
  getHousesByPage,
  searchHousesByName,
} from "../../db/house";
import { createHouse } from "../../validators/createHouse";
import { destroyHouse } from "../../validators/destroyHouse";
import { authMiddleware } from "../../middleware/auth";
import { checkHouse } from "../../validators/checkHouse";

const router = Router();

router.get("/search", authMiddleware, async (req, res) => {
  try {
    const name = req.query.name;
    if (!name)
      return res.status(400).json({ message: "name not provided or empty" });
    const houses = await searchHousesByName(String(name));

    return res.json({ message: "Houses Found.", houses });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});

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

router.get("/check/:name", async (req, res) => {
  try {
    checkHouse.parse(req.params);

    const isHouse = await checkHouseDb(req.params.name);

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

router.delete("/remove/:houseId", authMiddleware, async (req, res) => {
  try {
    const { houseId } = req.params;
    const data = destroyHouse.parse({ houseId });
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

router.get("/:houseId", authMiddleware, async (req, res) => {
  try {
    const { houseId } = req.params;
    const { userId } = res.locals;

    const house = await getHouseDb(houseId, userId);

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
