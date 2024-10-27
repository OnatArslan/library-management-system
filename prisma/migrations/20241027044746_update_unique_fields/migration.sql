/*
  Warnings:

  - The primary key for the `user_past_bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[bookId,userId,returnDate]` on the table `user_past_bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_past_bookings" DROP CONSTRAINT "user_past_bookings_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "user_past_bookings_bookId_userId_returnDate_key" ON "user_past_bookings"("bookId", "userId", "returnDate");
