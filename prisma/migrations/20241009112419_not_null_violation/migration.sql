-- DropForeignKey
ALTER TABLE "book" DROP CONSTRAINT "book_currentOwnerId_fkey";

-- AlterTable
ALTER TABLE "book" ALTER COLUMN "currentOwnerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_currentOwnerId_fkey" FOREIGN KEY ("currentOwnerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
