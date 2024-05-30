import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ItemsInPage = 4;

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

export const destroyHouseDb = async (userId: string, houseId: string) => {
  try {
    const house = await prisma.house.delete({
      where: {
        id: houseId,
        adminId: userId,
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

export const checkHouseDb = async (houseName: string) => {
  try {
    const house = await prisma.house.findFirst({
      where: {
        name: houseName,
      },
    });

    return house ? true : false;
  } catch (error) {
    throw error;
  }
};
export const getHouseDb = async (houseId: string, userId: string) => {
  try {
    const house = await prisma.house.findUnique({
      where: {
        id: houseId,
      },
      select: {
        id: true,
        name: true,
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

    if (!house) return;

    const joinedHouse = await prisma.userHouse.findFirst({
      where: {
        houseId,
        userId,
      },
    });

    return { ...house, joined: joinedHouse ? true : false };
  } catch (error) {
    throw error;
  }
};

export const getHousesByPage = async (adminId: string, page: number) => {
  try {
    const houses = await prisma.house.findMany({
      where: {
        adminId,
      },
      skip: ItemsInPage * (page - 1),
      take: ItemsInPage,
    });

    return houses;
  } catch (error) {
    throw error;
  }
};

export const searchHousesByName = async (filter: string) => {
  try {
    const houses = await prisma.house.findMany({
      where: {
        name: {
          contains: filter,
          mode: "insensitive",
        },
      },
    });

    return houses;
  } catch (error) {
    throw error;
  }
};
