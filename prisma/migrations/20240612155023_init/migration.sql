-- DropForeignKey
ALTER TABLE "UserHouse" DROP CONSTRAINT "UserHouse_houseId_fkey";

-- DropForeignKey
ALTER TABLE "UserHouse" DROP CONSTRAINT "UserHouse_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserHouse" ADD CONSTRAINT "UserHouse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHouse" ADD CONSTRAINT "UserHouse_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;
