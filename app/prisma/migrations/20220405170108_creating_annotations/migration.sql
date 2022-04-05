/*
  Warnings:

  - The primary key for the `book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `book` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "book_bookId_key";

-- AlterTable
ALTER TABLE "book" DROP CONSTRAINT "book_pkey",
DROP COLUMN "bookId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "book_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "annotation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "text" TEXT NOT NULL,
    "page" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annotation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "annotation_id_key" ON "annotation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "book_id_key" ON "book"("id");

-- AddForeignKey
ALTER TABLE "annotation" ADD CONSTRAINT "annotation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annotation" ADD CONSTRAINT "annotation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
