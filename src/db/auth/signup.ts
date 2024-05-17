import { PrismaClient } from "@prisma/client";
import { signupUser } from "../../interfaces/signupUser";

const prisma = new PrismaClient();

export const singupDB = async (user: signupUser) => {
  try {
    const createdUser = await prisma.user.create({
      data: user,
    });

    return {
      firstname: createdUser.firstname,
      lastname: createdUser.lastname,
      email: createdUser.email,
      bio: createdUser?.bio,
    };
  } catch (error) {
    throw error;
  }
};
