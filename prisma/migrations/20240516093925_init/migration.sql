/*
  Warnings:

  - You are about to drop the `_HouseToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `House` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `House` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `House` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_HouseToUser" DROP CONSTRAINT "_HouseToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_HouseToUser" DROP CONSTRAINT "_HouseToUser_B_fkey";

-- AlterTable
ALTER TABLE "House" ADD COLUMN     "adminId" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "_HouseToUser";

-- CreateTable
CREATE TABLE "UserHouse" (
    "userId" TEXT NOT NULL,
    "houseId" TEXT NOT NULL,

    CONSTRAINT "UserHouse_pkey" PRIMARY KEY ("userId","houseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "House_name_key" ON "House"("name");

-- AddForeignKey
ALTER TABLE "House" ADD CONSTRAINT "House_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHouse" ADD CONSTRAINT "UserHouse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHouse" ADD CONSTRAINT "UserHouse_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
