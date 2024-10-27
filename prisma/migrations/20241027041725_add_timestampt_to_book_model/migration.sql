-- AlterTable
ALTER TABLE "book" ADD COLUMN     "borrowedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_past_bookings" ALTER COLUMN "returnDate" SET DEFAULT CURRENT_TIMESTAMP;
