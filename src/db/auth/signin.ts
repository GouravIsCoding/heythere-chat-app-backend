import { PrismaClient } from "@prisma/client";
import { signinUser } from "../../interfaces/signinUser";

const prisma = new PrismaClient();

export const singinDB = async (user: signinUser) => {
  try {
    const fetchedUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    return fetchedUser;
  } catch (error) {
    throw error;
  }
};
