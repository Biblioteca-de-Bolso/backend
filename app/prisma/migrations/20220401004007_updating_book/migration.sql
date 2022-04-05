/*
  Warnings:

  - The `readStatus` column on the `book` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `borrowStatus` column on the `book` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BorrowStatus" AS ENUM ('PENDING', 'RETURNED');

-- CreateEnum
CREATE TYPE "ReadStatus" AS ENUM ('PLANNING', 'READING', 'CONCLUDED', 'DROPPED', 'NO_STATUS');

-- AlterTable
ALTER TABLE "book" DROP COLUMN "readStatus",
ADD COLUMN     "readStatus" "ReadStatus" DEFAULT E'NO_STATUS',
DROP COLUMN "borrowStatus",
ADD COLUMN     "borrowStatus" "BorrowStatus" DEFAULT E'RETURNED';

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
