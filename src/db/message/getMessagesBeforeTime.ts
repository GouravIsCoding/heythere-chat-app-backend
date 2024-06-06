import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const numberOfMessages = 10;

export const getMessagesBeforeTime = async (
  cursor: number | null,
  houseId: string
) => {
  try {
    const messages = await prisma.message.findMany({
      take: 10,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        houseId,
      },
      orderBy: { timestamp: "desc" },
      select: {
        id: true,
        text: true,
        houseId: true,
        timestamp: true,
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
    return messages;
  } catch (error) {
    throw error;
  }
};
