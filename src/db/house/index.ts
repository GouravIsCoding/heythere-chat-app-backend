import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createHouseDb = async (
  adminId: string,
  name: string,
  description: string
) => {
  try {
    const house = await prisma.house.create({
      data: {
        adminId,
        name,
        description,
      },
      select: {
        name: true,
        id: true,
        description: true,
        admin: {
          select: {
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    return house;
  } catch (error) {
    throw error;
  }
};

export const checkUserHouse = async (userId: string, houseId: string) => {
  try {
    const user = await prisma.userHouse.findFirst({
      where: {
        userId,
        houseId,
      },
    });
    return user ? true : false;
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
