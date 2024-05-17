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
        text: true,
        sender: {
          select: {
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
