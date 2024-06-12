import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMemberById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        bio: true,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};
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

export const getJoinedHousesDB = async (userId: string) => {
  try {
    const houses = await prisma.userHouse.findMany({
      where: {
        userId,
      },
      select: {
        house: true,
      },
    });

    return houses;
  } catch (error) {
    throw error;
  }
};
