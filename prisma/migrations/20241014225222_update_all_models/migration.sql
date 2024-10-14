/*
  Warnings:

  - You are about to alter the column `totalScore` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `returnDate` to the `user_past_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'BLOCKED';

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_bookId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_reviewerId_fkey";

-- DropForeignKey
ALTER TABLE "user_follow" DROP CONSTRAINT "user_follow_followerId_fkey";

-- DropForeignKey
ALTER TABLE "user_follow" DROP CONSTRAINT "user_follow_followingId_fkey";

-- DropForeignKey
ALTER TABLE "user_liked_books" DROP CONSTRAINT "user_liked_books_bookId_fkey";

-- DropForeignKey
ALTER TABLE "user_liked_books" DROP CONSTRAINT "user_liked_books_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_past_bookings" DROP CONSTRAINT "user_past_bookings_bookId_fkey";

-- DropForeignKey
ALTER TABLE "user_past_bookings" DROP CONSTRAINT "user_past_bookings_userId_fkey";

-- DropIndex
DROP INDEX "book_title_id_idx";

-- AlterTable
ALTER TABLE "book" ALTER COLUMN "totalScore" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "passwordChangedAt" DROP NOT NULL,
ALTER COLUMN "passwordChangedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_past_bookings" ADD COLUMN     "returnDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "book_title_idx" ON "book"("title");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_liked_books" ADD CONSTRAINT "user_liked_books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_liked_books" ADD CONSTRAINT "user_liked_books_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_past_bookings" ADD CONSTRAINT "user_past_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_past_bookings" ADD CONSTRAINT "user_past_bookings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
