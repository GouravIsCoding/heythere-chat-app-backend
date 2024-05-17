import { Router } from "express";
import { ZodError } from "zod";
import { updateMemberInHouse } from "../../validators/updateMembers";
import {
  addMemberToHouse,
  createHouseDb,
  removeMemberFromHouse,
} from "../../db/house";
import { createHouse } from "../../validators/createHouse";

const router = Router();

router.post("/member/add", async (req, res) => {
  try {
    updateMemberInHouse.parse(req.body);

    await addMemberToHouse(req.body.userId, req.body.houseId);

    return res.json({ message: "succesfully joined the House" });
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

router.post("/member/remove", async (req, res) => {
  try {
    updateMemberInHouse.parse(req.body);

    await removeMemberFromHouse(req.body.userId, req.body.houseId);

    return res.json({ message: "Left the House" });
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

router.post("/create", async (req, res) => {
  try {
    createHouse.parse(req.body);

    const house = await createHouseDb(
      req.body.userId,
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

export default router;
