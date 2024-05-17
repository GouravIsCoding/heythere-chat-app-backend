import { Router } from "express";
import { ZodError } from "zod";
import { updateMemberInHouse } from "../../validators/updateMembers";
import {
  addMemberToHouse,
  getMemberById,
  removeMemberFromHouse,
} from "../../db/member";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/:memberId", authMiddleware, async (req, res) => {
  try {
    const { memberId } = req.params;

    const user = await getMemberById(memberId);

    if (!user) res.status(400).json({ message: "user not found" });

    res.json({ message: "user found", ...user });
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
    updateMemberInHouse.parse(req.body);
    const { userId } = res.locals;

    await addMemberToHouse(userId, req.body.houseId);

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

router.post("/remove", authMiddleware, async (req, res) => {
  try {
    updateMemberInHouse.parse(req.body);
    const { userId } = res.locals;

    await removeMemberFromHouse(userId, req.body.houseId);

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

export default router;
