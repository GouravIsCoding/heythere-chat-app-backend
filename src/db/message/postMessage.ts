import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const postMessage = async (
  userId: string,
  houseId: string,
  text: string
) => {
  try {
    const message = await prisma.message.create({
      data: {
        senderId: userId,
        houseId,
        text,
      },
      select: {
        id: true,
        houseId: true,
        timestamp: true,
        text: true,
        sender: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
    return message;
  } catch (error) {
    throw error;
  }
};
