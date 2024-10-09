-- CreateEnum
CREATE TYPE "BookCategory" AS ENUM ('FICTION', 'LITERARY_FICTION', 'HISTORICAL_FICTION', 'MYSTERY', 'THRILLER', 'SCIENCE_FICTION', 'FANTASY', 'HORROR', 'ROMANCE', 'ADVENTURE', 'NON_FICTION', 'BIOGRAPHY', 'SELF_HELP', 'HISTORY', 'TRAVEL', 'COOKBOOK', 'HEALTH_WELLNESS', 'BUSINESS', 'SCIENCE', 'YOUNG_ADULT', 'CHILDRENS', 'GRAPHIC_NOVEL', 'POETRY', 'CLASSIC_LITERATURE', 'OTHER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "book" (
    "id" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "category" "BookCategory" NOT NULL DEFAULT 'OTHER',
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "totalScore" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentOwnerId" TEXT NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT,
    "score" INTEGER NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "passwordChangedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follow" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "user_follow_pkey" PRIMARY KEY ("followingId","followerId")
);

-- CreateTable
CREATE TABLE "user_liked_books" (
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "user_liked_books_pkey" PRIMARY KEY ("userId","bookId")
);

-- CreateTable
CREATE TABLE "user_past_bookings" (
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,

    CONSTRAINT "user_past_bookings_pkey" PRIMARY KEY ("userId","bookId")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");

-- CreateIndex
CREATE INDEX "book_title_id_idx" ON "book"("title", "id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_currentOwnerId_fkey" FOREIGN KEY ("currentOwnerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_liked_books" ADD CONSTRAINT "user_liked_books_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_liked_books" ADD CONSTRAINT "user_liked_books_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_past_bookings" ADD CONSTRAINT "user_past_bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_past_bookings" ADD CONSTRAINT "user_past_bookings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
