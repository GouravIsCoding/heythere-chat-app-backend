import { Router } from "express";
import { signupValidate } from "../../validators/signup";
import { ZodError } from "zod";
import { singupDB } from "../../db/auth/signup";
import { signinValidate } from "../../validators/signin";
import { singinDB } from "../../db/auth/signin";
import { comparePasswords, hashPassword } from "../../utils/bcrypt";
import { sign, verify } from "jsonwebtoken";
import { Env } from "../../config";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    signupValidate.parse(req.body);

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const createdUser = await singupDB(req.body);

    return res.json({ ...createdUser, message: "Signup success!" });
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

router.post("/signin", async (req, res) => {
  try {
    signinValidate.parse(req.body);

    const fetchedUser = await singinDB(req.body);

    if (!fetchedUser)
      return res.status(400).json({ message: "wrong credentials" });

    const validPassword = comparePasswords(
      req.body.password,
      fetchedUser?.password
    );

    if (!validPassword)
      return res.status(400).json({ message: "wrong credentials" });

    const token = sign(
      {
        id: fetchedUser.id,
        firstname: fetchedUser.firstname,
        lastname: fetchedUser.lastname,
        email: fetchedUser.email,
      },
      Env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    return res.json({
      message: "signin successfull",
      email: fetchedUser.email,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});

router.post("/signout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Logout successful" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});
router.get("/status", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(400)
        .json({ message: "not logged in!", authStatus: false });

    const authStatus = verify(token, Env.JWT_SECRET);

    if (!authStatus)
      return res
        .status(400)
        .json({ message: "not logged in!", authStatus: false });

    return res.json({ message: "Logged in", authStatus: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors[0]?.message });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
});

export default router;
