import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { Env } from "../../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ message: "not logged in!" });
    const verifiedToken = verify(token, Env.JWT_SECRET) as JwtPayload;
    if (!verifiedToken)
      return res.status(400).json({ message: "not logged in!" });
    res.locals.userId = verifiedToken.id;
    return next();
  } catch (error) {
    throw error;
  }
};
