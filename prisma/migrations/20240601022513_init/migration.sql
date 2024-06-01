-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_houseId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House"("id") ON DELETE CASCADE ON UPDATE CASCADE;
