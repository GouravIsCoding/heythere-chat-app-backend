import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addMemberToHouse = async (userId: string, houseId: string) => {
  try {
    await prisma.userHouse.create({
      data: {
        userId,
        houseId,
      },
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const removeMemberFromHouse = async (
  userId: string,
  houseId: string
) => {
  try {
    await prisma.userHouse.delete({
      where: {
        userId_houseId: {
          userId,
          houseId,
        },
      },
    });
    return true;
  } catch (error) {
    throw error;
  }
};
